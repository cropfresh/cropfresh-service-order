import { Request, Response, NextFunction } from 'express';
import pinoHttp from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import { logger, asyncLocalStorage } from '../utils/logger';

export const requestLogger = pinoHttp({
    logger: logger as any,
    genReqId: (req: Request) => {
        const traceId = req.headers['x-trace-id'] as string || uuidv4();
        // Attach traceId to request object for easy access if needed
        (req as any).id = traceId;
        return traceId;
    },
    customProps: (req: Request) => {
        return {
            trace_id: (req as any).id
        };
    },
    serializers: {
        req: (req: any) => ({
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
            headers: {
                ...req.headers,
                authorization: undefined // Redact authorization header
            },
            remoteAddress: req.remoteAddress
        }),
        res: (res: any) => ({
            statusCode: res.statusCode
        })
    }
});

export const traceIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const traceId = (req.headers['x-trace-id'] as string) || uuidv4();
    (req as any).id = traceId;
    res.setHeader('X-Trace-ID', traceId);

    asyncLocalStorage.run({ traceId }, () => {
        next();
    });
};
