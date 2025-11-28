import pino from 'pino';
import { AsyncLocalStorage } from 'async_hooks';

// Create AsyncLocalStorage for trace ID context
export const asyncLocalStorage = new AsyncLocalStorage<{ traceId: string }>();

const transport = process.env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
        },
    }
    : undefined;

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport,
    base: {
        service: process.env.SERVICE_NAME || 'unknown-service',
        env: process.env.NODE_ENV || 'development',
    },
    redact: {
        paths: [
            'password',
            'token',
            'authorization',
            'headers.authorization',
            'req.headers.authorization',
            'user.password',
            'user.token'
        ],
        remove: true,
    },
    mixin() {
        const store = asyncLocalStorage.getStore();
        return store ? { trace_id: store.traceId } : {};
    },
});
