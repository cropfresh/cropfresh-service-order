import { Request, Response } from 'express';
import { logger } from '../utils/logger';

// Use generic types to avoid requiring @prisma/client and ioredis packages
interface PrismaLike {
    $queryRaw: (query: TemplateStringsArray) => Promise<unknown>;
}

interface RedisLike {
    ping: () => Promise<string>;
}

export interface DependencyCheckResult {
    name: string;
    status: 'ok' | 'failed';
    latency?: number;
    error?: string;
}

export interface HealthCheckResponse {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    checks?: Record<string, string>;
}

/**
 * Liveness check - returns 200 if server is running
 * Does NOT check dependencies (Kubernetes will restart if this fails)
 */
export const livenessHandler = (req: Request, res: Response) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
};

/**
 * Readiness check - returns 200 only if ALL dependencies are accessible
 * Kubernetes uses this to determine if pod can receive traffic
 */
export const createReadinessHandler = (
    prisma?: PrismaLike,
    redis?: RedisLike,
    // rabbitmq?: any // TODO: Add when RabbitMQ is integrated
) => {
    return async (req: Request, res: Response) => {
        const checks: DependencyCheckResult[] = [];
        let allHealthy = true;

        // Check PostgreSQL connection
        if (prisma) {
            const dbStart = Date.now();
            try {
                await prisma.$queryRaw`SELECT 1`;
                checks.push({
                    name: 'database',
                    status: 'ok',
                    latency: Date.now() - dbStart
                });
            } catch (error) {
                allHealthy = false;
                checks.push({
                    name: 'database',
                    status: 'failed',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        // Check Redis connection
        if (redis) {
            const redisStart = Date.now();
            try {
                await redis.ping();
                checks.push({
                    name: 'redis',
                    status: 'ok',
                    latency: Date.now() - redisStart
                });
            } catch (error) {
                allHealthy = false;
                checks.push({
                    name: 'redis',
                    status: 'failed',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        // TODO: Add RabbitMQ check when integrated
        // TODO: Add gRPC service checks when integrated

        // Build standardized response
        const response: HealthCheckResponse = {
            status: allHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            checks: checks.reduce((acc, check) => {
                acc[check.name] = check.status;
                return acc;
            }, {} as Record<string, string>)
        };

        // Return 503 if any dependency failed
        const statusCode = allHealthy ? 200 : 503;

        if (!allHealthy) {
            logger.warn({ checks }, 'Readiness check failed');
        }

        res.status(statusCode).json(response);
    };
};
