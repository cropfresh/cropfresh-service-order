// Tracing (Must be first)
import './tracing';

import { GrpcServer } from './grpc/server';
import { orderServiceHandlers } from './grpc/services/order';
import path from 'path';
import express from 'express';
import { logger } from './utils/logger';
import { requestLogger, traceIdMiddleware } from './middleware/logging';
import { monitoringMiddleware, metricsHandler } from './middleware/monitoring';
import { PrismaClient } from '@prisma/client';
import { livenessHandler, createReadinessHandler } from './middleware/health';

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3003;
const SERVICE_NAME = 'Order Management Service';

// Middleware
app.use(express.json());
app.use(monitoringMiddleware);
app.use(traceIdMiddleware);
app.use(requestLogger);

// Health check endpoints (Kubernetes probes)
app.get('/health', livenessHandler);
app.get('/ready', createReadinessHandler(prisma));

// Metrics Endpoint
app.get('/metrics', metricsHandler);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: `CropFresh `,
    version: '0.1.0'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(` running on port `);
});

export default app;

// gRPC Server Setup
const GRPC_PORT = parseInt(process.env.GRPC_PORT || '50051', 10);
const PROTO_PATH = path.join(__dirname, '../protos/proto/order.proto');
const PACKAGE_NAME = 'cropfresh.order';
const SERVICE_NAME_GRPC = 'Service';

(async () => {
  try {
    const grpcServer = new GrpcServer(GRPC_PORT, logger);
    const packageDef = grpcServer.loadProto(PROTO_PATH);
    const proto = packageDef.cropfresh.order as any;
    const serviceDef = proto[SERVICE_NAME_GRPC].service;

    grpcServer.addService(serviceDef, orderServiceHandlers(logger));

    await grpcServer.start();
  } catch (err) {
    logger.error(err, 'Failed to start gRPC server');
  }
})();
