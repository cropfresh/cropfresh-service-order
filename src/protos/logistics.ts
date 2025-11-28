import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { LogisticsServiceClient as _cropfresh_logistics_LogisticsServiceClient, LogisticsServiceDefinition as _cropfresh_logistics_LogisticsServiceDefinition } from './cropfresh/logistics/LogisticsService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  cropfresh: {
    logistics: {
      AssignRouteRequest: MessageTypeDefinition
      AssignRouteResponse: MessageTypeDefinition
      CompleteRouteRequest: MessageTypeDefinition
      CompleteRouteResponse: MessageTypeDefinition
      GetOptimizedRouteRequest: MessageTypeDefinition
      GetOptimizedRouteResponse: MessageTypeDefinition
      LogisticsService: SubtypeConstructor<typeof grpc.Client, _cropfresh_logistics_LogisticsServiceClient> & { service: _cropfresh_logistics_LogisticsServiceDefinition }
      UpdateLocationRequest: MessageTypeDefinition
      UpdateLocationResponse: MessageTypeDefinition
      Waypoint: MessageTypeDefinition
    }
  }
}

