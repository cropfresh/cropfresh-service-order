import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { Logger } from 'pino';

export class GrpcClient {
  private client: grpc.Client;
  private logger: Logger;

  constructor(
    serviceName: string,
    protoPath: string,
    packageName: string,
    serviceNameProto: string,
    logger: Logger
  ) {
    this.logger = logger;
    
    // Service Discovery (Env vars)
    const host = process.env[serviceName.toUpperCase() + '_SERVICE_HOST'] || 'localhost';
    const port = process.env[serviceName.toUpperCase() + '_SERVICE_PORT'] || '50051';
    const address = host + ':' + port;

    // Load Proto
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    const proto = grpc.loadPackageDefinition(packageDefinition) as any;
    const Service = proto[packageName][serviceNameProto];

    // Retry Policy (Service Config)
    const serviceConfig = {
      "loadBalancingConfig": [ { "round_robin": {} } ],
      "methodConfig": [
        {
          "name": [ { "service": packageName + '.' + serviceNameProto } ],
          "retryPolicy": {
            "maxAttempts": 3,
            "initialBackoff": "1s",
            "maxBackoff": "10s",
            "backoffMultiplier": 2,
            "retryableStatusCodes": [ "UNAVAILABLE", "DEADLINE_EXCEEDED" ]
          }
        }
      ]
    };
    
    const options = {
      'grpc.service_config': JSON.stringify(serviceConfig)
    };

    this.client = new Service(address, grpc.credentials.createInsecure(), options);
  }

  public getClient(): any {
    return this.client;
  }
  
  // Helper to make calls with trace ID
  public makeCall(method: string, request: any, metadata: grpc.Metadata = new grpc.Metadata()): Promise<any> {
    return new Promise((resolve, reject) => {
      // Ensure trace-id is present
      if (!metadata.get('trace-id').length) {
         // In a real app, we'd get this from context/CLS. For now, generate if missing or pass through.
         // Assuming caller passes it.
      }

      (this.client as any)[method](request, metadata, (err: any, response: any) => {
        if (err) {
          this.logger.error({ err, method }, 'gRPC call failed');
          return reject(err);
        }
        resolve(response);
      });
    });
  }
}
