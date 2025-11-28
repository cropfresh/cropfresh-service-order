import { GrpcServer } from './grpc/server';
import { orderServiceHandlers } from './grpc/services/order';
import path from 'path';
import express from 'express';
import pino from 'pino';

const app = express();
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

const PORT = process.env.PORT || 3003;
const SERVICE_NAME = 'Order Management Service';

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: SERVICE_NAME,
    timestamp: new Date().toISOString()
  });
});

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
const SERVICE_NAME = 'Service';

(async () => {
  try {
    const grpcServer = new GrpcServer(GRPC_PORT, logger);
    const packageDef = grpcServer.loadProto(PROTO_PATH);
    const proto = packageDef.cropfresh.order as any;
    const serviceDef = proto[SERVICE_NAME].service;
    
    grpcServer.addService(serviceDef, orderServiceHandlers(logger));
    
    await grpcServer.start();
  } catch (err) {
    logger.error(err, 'Failed to start gRPC server');
  }
})();
