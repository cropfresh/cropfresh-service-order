import { Request, Response, NextFunction } from 'express';
import client from 'prom-client';

// Create a Registry
export const register = new client.Registry();

// Add default labels to all metrics
register.setDefaultLabels({
    app: 'cropfresh-service-order',
    service: 'order-service'
});

// Enable collection of default metrics (CPU, memory, event loop lag)
client.collectDefaultMetrics({ register });

// =======================
// HTTP Metrics
// =======================

export const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.001, 0.01, 0.1, 0.5, 1, 2, 5, 10]
});
register.registerMetric(httpRequestDuration);

export const httpRequestTotal = new client.Counter({
    name: 'http_request_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpRequestTotal);

// =======================
// gRPC Metrics
// =======================

export const grpcRequestDuration = new client.Histogram({
    name: 'grpc_request_duration_seconds',
    help: 'Duration of gRPC requests in seconds',
    labelNames: ['service', 'method', 'status_code'],
    buckets: [0.001, 0.01, 0.1, 0.5, 1, 2, 5, 10]
});
register.registerMetric(grpcRequestDuration);

export const grpcRequestTotal = new client.Counter({
    name: 'grpc_request_total',
    help: 'Total number of gRPC requests',
    labelNames: ['service', 'method', 'status_code']
});
register.registerMetric(grpcRequestTotal);

// =======================
// Database Metrics
// =======================

export const dbQueryDuration = new client.Histogram({
    name: 'db_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation'],
    buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1, 2]
});
register.registerMetric(dbQueryDuration);

export const dbConnectionPoolSize = new client.Gauge({
    name: 'db_connection_pool_size',
    help: 'Current number of active database connections'
});
register.registerMetric(dbConnectionPoolSize);

export const dbConnectionPoolMax = new client.Gauge({
    name: 'db_connection_pool_max',
    help: 'Maximum configured database connections'
});
register.registerMetric(dbConnectionPoolMax);

// =======================
// Redis Metrics
// =======================

export const redisOperationDuration = new client.Histogram({
    name: 'redis_operation_duration_seconds',
    help: 'Duration of Redis operations in seconds',
    labelNames: ['operation'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1]
});
register.registerMetric(redisOperationDuration);

// =======================
// RabbitMQ Metrics
// =======================

export const rabbitmqMessagePublished = new client.Counter({
    name: 'rabbitmq_message_published_total',
    help: 'Total number of messages published to RabbitMQ',
    labelNames: ['queue', 'exchange']
});
register.registerMetric(rabbitmqMessagePublished);

// =======================
// Middleware
// =======================

export const monitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route ? req.route.path : req.path;
        const status = res.statusCode.toString();

        httpRequestDuration.labels(req.method, route, status).observe(duration);
        httpRequestTotal.labels(req.method, route, status).inc();
    });

    next();
};

export const metricsHandler = async (req: Request, res: Response) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
};
