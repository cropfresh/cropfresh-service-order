import { GrpcClient } from '../../src/grpc/client';
import pino from 'pino';
import path from 'path';

const logger = pino();

async function run() {
  // Mock env vars for test
  process.env.CATALOG_SERVICE_HOST = 'localhost';
  process.env.CATALOG_SERVICE_PORT = '50052';

  const client = new GrpcClient(
    'catalog',
    path.join(__dirname, '../../protos/proto/catalog.proto'),
    'cropfresh.catalog',
    'CatalogService',
    logger
  );

  try {
    console.log('Calling GetProduct...');
    const result = await client.makeCall('GetProduct', { id: '123' });
    console.log('GetProduct Result:', result);
  } catch (err) {
    console.error('GetProduct Failed:', err);
    process.exit(1);
  }
}

run();
