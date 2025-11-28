import { GrpcClient } from '../../src/grpc/client';
import pino from 'pino';
import path from 'path';
import * as grpc from '@grpc/grpc-js';

const logger = pino();

async function run() {
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
    console.log('--- Test 1: Successful Call with Automatic Trace ID ---');
    const result = await client.makeCall('GetProduct', { id: '123' });
    console.log('GetProduct Result:', result);
    
    console.log('\n--- Test 2: Error Handling (Simulated Error) ---');
    try {
        await client.makeCall('GetProduct', { id: 'error-test' });
        console.error('Error Test Failed: Should have thrown an error');
        process.exit(1);
    } catch (err: any) {
        console.log('Caught Expected Error:', err.message || err);
        if (err.code === grpc.status.INTERNAL) {
            console.log('Verified: Received INTERNAL status code');
        } else {
            console.warn('Warning: Did not receive INTERNAL status code, got:', err.code);
        }
    }

  } catch (err) {
    console.error('Test Failed:', err);
    process.exit(1);
  }
}

run();
