import pino from 'pino';
import os from 'os';
import { AsyncLocalStorage } from 'async_hooks';

export const asyncLocalStorage = new AsyncLocalStorage<{ traceId: string }>();

const serviceName = 'cropfresh-service-order';
const logLevel = process.env.LOG_LEVEL || 'info';
const env = process.env.NODE_ENV || 'development';

export const logger = pino({
    level: logLevel,
    redact: {
        paths: ['password', 'token', 'authorization', 'headers.authorization', 'user.password'],
        remove: true,
    },
    transport: env === 'development' ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
        },
    } : undefined,
    base: {
        pid: process.pid,
        hostname: os.hostname(),
        service: serviceName,
        env: env,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    mixin: () => {
        const store = asyncLocalStorage.getStore();
        return store ? { trace_id: store.traceId } : {};
    },
});

export default logger;
