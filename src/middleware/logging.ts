import { Request, Response, NextFunction } from 'express';
import { pinoHttp } from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import { logger, asyncLocalStorage } from '../utils/logger';

export const requestLogger = pinoHttp({
    logger: logger as any,
    genReqId: (req: Request) => {
        const traceId = req.headers['x-trace-id'] as string || uuidv4();
        req.headers['x-trace-id'] = traceId; // Ensure header is present for downstream
        return traceId;
    },
    customProps: (req: Request) => {
        return {
            trace_id: req.id,
        };
    },
    serializers: {
        req: (req) => ({
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
            remoteAddress: req.remoteAddress,
        }),
        res: (res) => ({
            statusCode: res.statusCode,
        }),
    },
});

export const traceIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const traceId = (req.headers['x-trace-id'] as string) || (req.id as string) || uuidv4();

    // Ensure traceId is set on request object and header
    req.id = traceId;
    res.setHeader('X-Trace-ID', traceId);

    asyncLocalStorage.run({ traceId }, () => {
        next();
    });
};
