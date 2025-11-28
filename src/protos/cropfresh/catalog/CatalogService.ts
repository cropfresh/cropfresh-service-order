// Original file: protos/proto/catalog.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetProduceDetailsRequest as _cropfresh_catalog_GetProduceDetailsRequest, GetProduceDetailsRequest__Output as _cropfresh_catalog_GetProduceDetailsRequest__Output } from '../../cropfresh/catalog/GetProduceDetailsRequest';
import type { GetProduceDetailsResponse as _cropfresh_catalog_GetProduceDetailsResponse, GetProduceDetailsResponse__Output as _cropfresh_catalog_GetProduceDetailsResponse__Output } from '../../cropfresh/catalog/GetProduceDetailsResponse';
import type { ListProduceRequest as _cropfresh_catalog_ListProduceRequest, ListProduceRequest__Output as _cropfresh_catalog_ListProduceRequest__Output } from '../../cropfresh/catalog/ListProduceRequest';
import type { ListProduceResponse as _cropfresh_catalog_ListProduceResponse, ListProduceResponse__Output as _cropfresh_catalog_ListProduceResponse__Output } from '../../cropfresh/catalog/ListProduceResponse';
import type { UpdateInventoryRequest as _cropfresh_catalog_UpdateInventoryRequest, UpdateInventoryRequest__Output as _cropfresh_catalog_UpdateInventoryRequest__Output } from '../../cropfresh/catalog/UpdateInventoryRequest';
import type { UpdateInventoryResponse as _cropfresh_catalog_UpdateInventoryResponse, UpdateInventoryResponse__Output as _cropfresh_catalog_UpdateInventoryResponse__Output } from '../../cropfresh/catalog/UpdateInventoryResponse';

export interface CatalogServiceClient extends grpc.Client {
  GetProduceDetails(argument: _cropfresh_catalog_GetProduceDetailsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_catalog_GetProduceDetailsResponse__Output>): grpc.ClientUnaryCall;
  GetProduceDetails(argument: _cropfresh_catalog_GetProduceDetailsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_catalog_GetProduceDetailsResponse__Output>): grpc.ClientUnaryCall;
  GetProduceDetails(argument: _cropfresh_catalog_GetProduceDetailsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_catalog_GetProduceDetailsResponse__Output>): grpc.ClientUnaryCall;
  GetProduceDetails(argument: _cropfresh_catalog_GetProduceDetailsRequest, callback: grpc.requestCallback<_cropfresh_catalog_GetProduceDetailsResponse__Output>): grpc.ClientUnaryCall;
  getProduceDetails(argument: _cropfresh_catalog_GetProduceDetailsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_catalog_GetProduceDetailsResponse__Output>): grpc.ClientUnaryCall;
  getProduceDetails(argument: _cropfresh_catalog_GetProduceDetailsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_catalog_GetProduceDetailsResponse__Output>): grpc.ClientUnaryCall;
  getProduceDetails(argument: _cropfresh_catalog_GetProduceDetailsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_catalog_GetProduceDetailsResponse__Output>): grpc.ClientUnaryCall;
  getProduceDetails(argument: _cropfresh_catalog_GetProduceDetailsRequest, callback: grpc.requestCallback<_cropfresh_catalog_GetProduceDetailsResponse__Output>): grpc.ClientUnaryCall;
  
  ListProduce(argument: _cropfresh_catalog_ListProduceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_catalog_ListProduceResponse__Output>): grpc.ClientUnaryCall;
  ListProduce(argument: _cropfresh_catalog_ListProduceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_catalog_ListProduceResponse__Output>): grpc.ClientUnaryCall;
  ListProduce(argument: _cropfresh_catalog_ListProduceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_catalog_ListProduceResponse__Output>): grpc.ClientUnaryCall;
  ListProduce(argument: _cropfresh_catalog_ListProduceRequest, callback: grpc.requestCallback<_cropfresh_catalog_ListProduceResponse__Output>): grpc.ClientUnaryCall;
  listProduce(argument: _cropfresh_catalog_ListProduceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_catalog_ListProduceResponse__Output>): grpc.ClientUnaryCall;
  listProduce(argument: _cropfresh_catalog_ListProduceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_catalog_ListProduceResponse__Output>): grpc.ClientUnaryCall;
  listProduce(argument: _cropfresh_catalog_ListProduceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_catalog_ListProduceResponse__Output>): grpc.ClientUnaryCall;
  listProduce(argument: _cropfresh_catalog_ListProduceRequest, callback: grpc.requestCallback<_cropfresh_catalog_ListProduceResponse__Output>): grpc.ClientUnaryCall;
  
  UpdateInventory(argument: _cropfresh_catalog_UpdateInventoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_catalog_UpdateInventoryResponse__Output>): grpc.ClientUnaryCall;
  UpdateInventory(argument: _cropfresh_catalog_UpdateInventoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_catalog_UpdateInventoryResponse__Output>): grpc.ClientUnaryCall;
  UpdateInventory(argument: _cropfresh_catalog_UpdateInventoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_catalog_UpdateInventoryResponse__Output>): grpc.ClientUnaryCall;
  UpdateInventory(argument: _cropfresh_catalog_UpdateInventoryRequest, callback: grpc.requestCallback<_cropfresh_catalog_UpdateInventoryResponse__Output>): grpc.ClientUnaryCall;
  updateInventory(argument: _cropfresh_catalog_UpdateInventoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_catalog_UpdateInventoryResponse__Output>): grpc.ClientUnaryCall;
  updateInventory(argument: _cropfresh_catalog_UpdateInventoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_catalog_UpdateInventoryResponse__Output>): grpc.ClientUnaryCall;
  updateInventory(argument: _cropfresh_catalog_UpdateInventoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_catalog_UpdateInventoryResponse__Output>): grpc.ClientUnaryCall;
  updateInventory(argument: _cropfresh_catalog_UpdateInventoryRequest, callback: grpc.requestCallback<_cropfresh_catalog_UpdateInventoryResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface CatalogServiceHandlers extends grpc.UntypedServiceImplementation {
  GetProduceDetails: grpc.handleUnaryCall<_cropfresh_catalog_GetProduceDetailsRequest__Output, _cropfresh_catalog_GetProduceDetailsResponse>;
  
  ListProduce: grpc.handleUnaryCall<_cropfresh_catalog_ListProduceRequest__Output, _cropfresh_catalog_ListProduceResponse>;
  
  UpdateInventory: grpc.handleUnaryCall<_cropfresh_catalog_UpdateInventoryRequest__Output, _cropfresh_catalog_UpdateInventoryResponse>;
  
}

export interface CatalogServiceDefinition extends grpc.ServiceDefinition {
  GetProduceDetails: MethodDefinition<_cropfresh_catalog_GetProduceDetailsRequest, _cropfresh_catalog_GetProduceDetailsResponse, _cropfresh_catalog_GetProduceDetailsRequest__Output, _cropfresh_catalog_GetProduceDetailsResponse__Output>
  ListProduce: MethodDefinition<_cropfresh_catalog_ListProduceRequest, _cropfresh_catalog_ListProduceResponse, _cropfresh_catalog_ListProduceRequest__Output, _cropfresh_catalog_ListProduceResponse__Output>
  UpdateInventory: MethodDefinition<_cropfresh_catalog_UpdateInventoryRequest, _cropfresh_catalog_UpdateInventoryResponse, _cropfresh_catalog_UpdateInventoryRequest__Output, _cropfresh_catalog_UpdateInventoryResponse__Output>
}
