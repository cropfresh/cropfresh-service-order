// Original file: protos/proto/logistics.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AssignRouteRequest as _cropfresh_logistics_AssignRouteRequest, AssignRouteRequest__Output as _cropfresh_logistics_AssignRouteRequest__Output } from '../../cropfresh/logistics/AssignRouteRequest';
import type { AssignRouteResponse as _cropfresh_logistics_AssignRouteResponse, AssignRouteResponse__Output as _cropfresh_logistics_AssignRouteResponse__Output } from '../../cropfresh/logistics/AssignRouteResponse';
import type { CompleteRouteRequest as _cropfresh_logistics_CompleteRouteRequest, CompleteRouteRequest__Output as _cropfresh_logistics_CompleteRouteRequest__Output } from '../../cropfresh/logistics/CompleteRouteRequest';
import type { CompleteRouteResponse as _cropfresh_logistics_CompleteRouteResponse, CompleteRouteResponse__Output as _cropfresh_logistics_CompleteRouteResponse__Output } from '../../cropfresh/logistics/CompleteRouteResponse';
import type { GetOptimizedRouteRequest as _cropfresh_logistics_GetOptimizedRouteRequest, GetOptimizedRouteRequest__Output as _cropfresh_logistics_GetOptimizedRouteRequest__Output } from '../../cropfresh/logistics/GetOptimizedRouteRequest';
import type { GetOptimizedRouteResponse as _cropfresh_logistics_GetOptimizedRouteResponse, GetOptimizedRouteResponse__Output as _cropfresh_logistics_GetOptimizedRouteResponse__Output } from '../../cropfresh/logistics/GetOptimizedRouteResponse';
import type { UpdateLocationRequest as _cropfresh_logistics_UpdateLocationRequest, UpdateLocationRequest__Output as _cropfresh_logistics_UpdateLocationRequest__Output } from '../../cropfresh/logistics/UpdateLocationRequest';
import type { UpdateLocationResponse as _cropfresh_logistics_UpdateLocationResponse, UpdateLocationResponse__Output as _cropfresh_logistics_UpdateLocationResponse__Output } from '../../cropfresh/logistics/UpdateLocationResponse';

export interface LogisticsServiceClient extends grpc.Client {
  AssignRoute(argument: _cropfresh_logistics_AssignRouteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_AssignRouteResponse__Output>): grpc.ClientUnaryCall;
  AssignRoute(argument: _cropfresh_logistics_AssignRouteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_logistics_AssignRouteResponse__Output>): grpc.ClientUnaryCall;
  AssignRoute(argument: _cropfresh_logistics_AssignRouteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_AssignRouteResponse__Output>): grpc.ClientUnaryCall;
  AssignRoute(argument: _cropfresh_logistics_AssignRouteRequest, callback: grpc.requestCallback<_cropfresh_logistics_AssignRouteResponse__Output>): grpc.ClientUnaryCall;
  assignRoute(argument: _cropfresh_logistics_AssignRouteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_AssignRouteResponse__Output>): grpc.ClientUnaryCall;
  assignRoute(argument: _cropfresh_logistics_AssignRouteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_logistics_AssignRouteResponse__Output>): grpc.ClientUnaryCall;
  assignRoute(argument: _cropfresh_logistics_AssignRouteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_AssignRouteResponse__Output>): grpc.ClientUnaryCall;
  assignRoute(argument: _cropfresh_logistics_AssignRouteRequest, callback: grpc.requestCallback<_cropfresh_logistics_AssignRouteResponse__Output>): grpc.ClientUnaryCall;
  
  CompleteRoute(argument: _cropfresh_logistics_CompleteRouteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_CompleteRouteResponse__Output>): grpc.ClientUnaryCall;
  CompleteRoute(argument: _cropfresh_logistics_CompleteRouteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_logistics_CompleteRouteResponse__Output>): grpc.ClientUnaryCall;
  CompleteRoute(argument: _cropfresh_logistics_CompleteRouteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_CompleteRouteResponse__Output>): grpc.ClientUnaryCall;
  CompleteRoute(argument: _cropfresh_logistics_CompleteRouteRequest, callback: grpc.requestCallback<_cropfresh_logistics_CompleteRouteResponse__Output>): grpc.ClientUnaryCall;
  completeRoute(argument: _cropfresh_logistics_CompleteRouteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_CompleteRouteResponse__Output>): grpc.ClientUnaryCall;
  completeRoute(argument: _cropfresh_logistics_CompleteRouteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_logistics_CompleteRouteResponse__Output>): grpc.ClientUnaryCall;
  completeRoute(argument: _cropfresh_logistics_CompleteRouteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_CompleteRouteResponse__Output>): grpc.ClientUnaryCall;
  completeRoute(argument: _cropfresh_logistics_CompleteRouteRequest, callback: grpc.requestCallback<_cropfresh_logistics_CompleteRouteResponse__Output>): grpc.ClientUnaryCall;
  
  GetOptimizedRoute(argument: _cropfresh_logistics_GetOptimizedRouteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_GetOptimizedRouteResponse__Output>): grpc.ClientUnaryCall;
  GetOptimizedRoute(argument: _cropfresh_logistics_GetOptimizedRouteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_logistics_GetOptimizedRouteResponse__Output>): grpc.ClientUnaryCall;
  GetOptimizedRoute(argument: _cropfresh_logistics_GetOptimizedRouteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_GetOptimizedRouteResponse__Output>): grpc.ClientUnaryCall;
  GetOptimizedRoute(argument: _cropfresh_logistics_GetOptimizedRouteRequest, callback: grpc.requestCallback<_cropfresh_logistics_GetOptimizedRouteResponse__Output>): grpc.ClientUnaryCall;
  getOptimizedRoute(argument: _cropfresh_logistics_GetOptimizedRouteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_GetOptimizedRouteResponse__Output>): grpc.ClientUnaryCall;
  getOptimizedRoute(argument: _cropfresh_logistics_GetOptimizedRouteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_logistics_GetOptimizedRouteResponse__Output>): grpc.ClientUnaryCall;
  getOptimizedRoute(argument: _cropfresh_logistics_GetOptimizedRouteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_GetOptimizedRouteResponse__Output>): grpc.ClientUnaryCall;
  getOptimizedRoute(argument: _cropfresh_logistics_GetOptimizedRouteRequest, callback: grpc.requestCallback<_cropfresh_logistics_GetOptimizedRouteResponse__Output>): grpc.ClientUnaryCall;
  
  UpdateLocation(argument: _cropfresh_logistics_UpdateLocationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_UpdateLocationResponse__Output>): grpc.ClientUnaryCall;
  UpdateLocation(argument: _cropfresh_logistics_UpdateLocationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_logistics_UpdateLocationResponse__Output>): grpc.ClientUnaryCall;
  UpdateLocation(argument: _cropfresh_logistics_UpdateLocationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_UpdateLocationResponse__Output>): grpc.ClientUnaryCall;
  UpdateLocation(argument: _cropfresh_logistics_UpdateLocationRequest, callback: grpc.requestCallback<_cropfresh_logistics_UpdateLocationResponse__Output>): grpc.ClientUnaryCall;
  updateLocation(argument: _cropfresh_logistics_UpdateLocationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_UpdateLocationResponse__Output>): grpc.ClientUnaryCall;
  updateLocation(argument: _cropfresh_logistics_UpdateLocationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_logistics_UpdateLocationResponse__Output>): grpc.ClientUnaryCall;
  updateLocation(argument: _cropfresh_logistics_UpdateLocationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_logistics_UpdateLocationResponse__Output>): grpc.ClientUnaryCall;
  updateLocation(argument: _cropfresh_logistics_UpdateLocationRequest, callback: grpc.requestCallback<_cropfresh_logistics_UpdateLocationResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface LogisticsServiceHandlers extends grpc.UntypedServiceImplementation {
  AssignRoute: grpc.handleUnaryCall<_cropfresh_logistics_AssignRouteRequest__Output, _cropfresh_logistics_AssignRouteResponse>;
  
  CompleteRoute: grpc.handleUnaryCall<_cropfresh_logistics_CompleteRouteRequest__Output, _cropfresh_logistics_CompleteRouteResponse>;
  
  GetOptimizedRoute: grpc.handleUnaryCall<_cropfresh_logistics_GetOptimizedRouteRequest__Output, _cropfresh_logistics_GetOptimizedRouteResponse>;
  
  UpdateLocation: grpc.handleUnaryCall<_cropfresh_logistics_UpdateLocationRequest__Output, _cropfresh_logistics_UpdateLocationResponse>;
  
}

export interface LogisticsServiceDefinition extends grpc.ServiceDefinition {
  AssignRoute: MethodDefinition<_cropfresh_logistics_AssignRouteRequest, _cropfresh_logistics_AssignRouteResponse, _cropfresh_logistics_AssignRouteRequest__Output, _cropfresh_logistics_AssignRouteResponse__Output>
  CompleteRoute: MethodDefinition<_cropfresh_logistics_CompleteRouteRequest, _cropfresh_logistics_CompleteRouteResponse, _cropfresh_logistics_CompleteRouteRequest__Output, _cropfresh_logistics_CompleteRouteResponse__Output>
  GetOptimizedRoute: MethodDefinition<_cropfresh_logistics_GetOptimizedRouteRequest, _cropfresh_logistics_GetOptimizedRouteResponse, _cropfresh_logistics_GetOptimizedRouteRequest__Output, _cropfresh_logistics_GetOptimizedRouteResponse__Output>
  UpdateLocation: MethodDefinition<_cropfresh_logistics_UpdateLocationRequest, _cropfresh_logistics_UpdateLocationResponse, _cropfresh_logistics_UpdateLocationRequest__Output, _cropfresh_logistics_UpdateLocationResponse__Output>
}
