import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { Logger } from 'pino';
import { v4 as uuidv4 } from 'uuid';
import { asyncLocalStorage } from '../utils/logger';

export class GrpcServer {
  private server: grpc.Server;
  private port: number;
  private logger: Logger;

  constructor(port: number, logger: Logger) {
    this.port = port;
    this.logger = logger;
    this.server = new grpc.Server();
  }

  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.bindAsync(
        '0.0.0.0:' + this.port,
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
          if (err) {
            this.logger.error(err, 'Failed to bind gRPC server');
            return reject(err);
          }
          this.logger.info('gRPC server running on port ' + port);
          resolve();
        }
      );
    });
  }

  public stop(): void {
    this.server.forceShutdown();
    this.logger.info('gRPC server stopped');
  }

  public loadProto(protoPath: string): any {
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    return grpc.loadPackageDefinition(packageDefinition);
  }

  public addService(serviceDefinition: grpc.ServiceDefinition, implementation: grpc.UntypedServiceImplementation): void {
    const wrappedImplementation: grpc.UntypedServiceImplementation = {};

    for (const key in implementation) {
      const method = implementation[key];
      if (typeof method === 'function') {
        wrappedImplementation[key] = this.wrapMethod(key, method as grpc.handleUnaryCall<any, any>);
      } else {
        wrappedImplementation[key] = method;
      }
    }

    this.server.addService(serviceDefinition, wrappedImplementation);
  }

  private wrapMethod(methodName: string, handler: grpc.handleUnaryCall<any, any>): grpc.handleUnaryCall<any, any> {
    return (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
      const traceId = this.getTraceId(call.metadata);

      // Run within AsyncLocalStorage context
      asyncLocalStorage.run({ traceId }, () => {
        const childLogger = this.logger.child({ method: methodName }); // traceId added via mixin

        try {
          childLogger.info('gRPC call started');

          handler(call, (err: any, value?: any, trailer?: grpc.Metadata, flags?: number) => {
            if (err) {
              childLogger.error({ err }, 'gRPC call failed');
              if (!err.code) {
                err = {
                  code: grpc.status.INTERNAL,
                  details: err.message || 'Internal Server Error',
                  metadata: err.metadata
                };
              }
            } else {
              childLogger.info('gRPC call completed');
            }
            callback(err, value, trailer, flags);
          });
        } catch (err: any) {
          childLogger.error({ err }, 'gRPC call threw exception');
          const grpcError = {
            code: grpc.status.INTERNAL,
            details: err.message || 'Internal Server Error'
          };
          callback(grpcError, null);
        }
      });
    };
  }

  private getTraceId(metadata: grpc.Metadata): string {
    const traceId = metadata.get('trace-id');
    if (traceId.length > 0) {
      return traceId[0].toString();
    }
    return uuidv4();
  }
}
