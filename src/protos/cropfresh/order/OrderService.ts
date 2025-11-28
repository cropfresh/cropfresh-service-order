// Original file: protos/proto/order.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CancelOrderRequest as _cropfresh_order_CancelOrderRequest, CancelOrderRequest__Output as _cropfresh_order_CancelOrderRequest__Output } from '../../cropfresh/order/CancelOrderRequest';
import type { CancelOrderResponse as _cropfresh_order_CancelOrderResponse, CancelOrderResponse__Output as _cropfresh_order_CancelOrderResponse__Output } from '../../cropfresh/order/CancelOrderResponse';
import type { CreateOrderRequest as _cropfresh_order_CreateOrderRequest, CreateOrderRequest__Output as _cropfresh_order_CreateOrderRequest__Output } from '../../cropfresh/order/CreateOrderRequest';
import type { CreateOrderResponse as _cropfresh_order_CreateOrderResponse, CreateOrderResponse__Output as _cropfresh_order_CreateOrderResponse__Output } from '../../cropfresh/order/CreateOrderResponse';
import type { GetOrderStatusRequest as _cropfresh_order_GetOrderStatusRequest, GetOrderStatusRequest__Output as _cropfresh_order_GetOrderStatusRequest__Output } from '../../cropfresh/order/GetOrderStatusRequest';
import type { GetOrderStatusResponse as _cropfresh_order_GetOrderStatusResponse, GetOrderStatusResponse__Output as _cropfresh_order_GetOrderStatusResponse__Output } from '../../cropfresh/order/GetOrderStatusResponse';
import type { UpdateOrderStatusRequest as _cropfresh_order_UpdateOrderStatusRequest, UpdateOrderStatusRequest__Output as _cropfresh_order_UpdateOrderStatusRequest__Output } from '../../cropfresh/order/UpdateOrderStatusRequest';
import type { UpdateOrderStatusResponse as _cropfresh_order_UpdateOrderStatusResponse, UpdateOrderStatusResponse__Output as _cropfresh_order_UpdateOrderStatusResponse__Output } from '../../cropfresh/order/UpdateOrderStatusResponse';

export interface OrderServiceClient extends grpc.Client {
  CancelOrder(argument: _cropfresh_order_CancelOrderRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  CancelOrder(argument: _cropfresh_order_CancelOrderRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_order_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  CancelOrder(argument: _cropfresh_order_CancelOrderRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  CancelOrder(argument: _cropfresh_order_CancelOrderRequest, callback: grpc.requestCallback<_cropfresh_order_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  cancelOrder(argument: _cropfresh_order_CancelOrderRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  cancelOrder(argument: _cropfresh_order_CancelOrderRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_order_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  cancelOrder(argument: _cropfresh_order_CancelOrderRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  cancelOrder(argument: _cropfresh_order_CancelOrderRequest, callback: grpc.requestCallback<_cropfresh_order_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  
  CreateOrder(argument: _cropfresh_order_CreateOrderRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  CreateOrder(argument: _cropfresh_order_CreateOrderRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_order_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  CreateOrder(argument: _cropfresh_order_CreateOrderRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  CreateOrder(argument: _cropfresh_order_CreateOrderRequest, callback: grpc.requestCallback<_cropfresh_order_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  createOrder(argument: _cropfresh_order_CreateOrderRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  createOrder(argument: _cropfresh_order_CreateOrderRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_order_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  createOrder(argument: _cropfresh_order_CreateOrderRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  createOrder(argument: _cropfresh_order_CreateOrderRequest, callback: grpc.requestCallback<_cropfresh_order_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  
  GetOrderStatus(argument: _cropfresh_order_GetOrderStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_GetOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  GetOrderStatus(argument: _cropfresh_order_GetOrderStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_order_GetOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  GetOrderStatus(argument: _cropfresh_order_GetOrderStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_GetOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  GetOrderStatus(argument: _cropfresh_order_GetOrderStatusRequest, callback: grpc.requestCallback<_cropfresh_order_GetOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  getOrderStatus(argument: _cropfresh_order_GetOrderStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_GetOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  getOrderStatus(argument: _cropfresh_order_GetOrderStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_order_GetOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  getOrderStatus(argument: _cropfresh_order_GetOrderStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_GetOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  getOrderStatus(argument: _cropfresh_order_GetOrderStatusRequest, callback: grpc.requestCallback<_cropfresh_order_GetOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  
  UpdateOrderStatus(argument: _cropfresh_order_UpdateOrderStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_UpdateOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  UpdateOrderStatus(argument: _cropfresh_order_UpdateOrderStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_order_UpdateOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  UpdateOrderStatus(argument: _cropfresh_order_UpdateOrderStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_UpdateOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  UpdateOrderStatus(argument: _cropfresh_order_UpdateOrderStatusRequest, callback: grpc.requestCallback<_cropfresh_order_UpdateOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  updateOrderStatus(argument: _cropfresh_order_UpdateOrderStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_UpdateOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  updateOrderStatus(argument: _cropfresh_order_UpdateOrderStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_order_UpdateOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  updateOrderStatus(argument: _cropfresh_order_UpdateOrderStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_order_UpdateOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  updateOrderStatus(argument: _cropfresh_order_UpdateOrderStatusRequest, callback: grpc.requestCallback<_cropfresh_order_UpdateOrderStatusResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface OrderServiceHandlers extends grpc.UntypedServiceImplementation {
  CancelOrder: grpc.handleUnaryCall<_cropfresh_order_CancelOrderRequest__Output, _cropfresh_order_CancelOrderResponse>;
  
  CreateOrder: grpc.handleUnaryCall<_cropfresh_order_CreateOrderRequest__Output, _cropfresh_order_CreateOrderResponse>;
  
  GetOrderStatus: grpc.handleUnaryCall<_cropfresh_order_GetOrderStatusRequest__Output, _cropfresh_order_GetOrderStatusResponse>;
  
  UpdateOrderStatus: grpc.handleUnaryCall<_cropfresh_order_UpdateOrderStatusRequest__Output, _cropfresh_order_UpdateOrderStatusResponse>;
  
}

export interface OrderServiceDefinition extends grpc.ServiceDefinition {
  CancelOrder: MethodDefinition<_cropfresh_order_CancelOrderRequest, _cropfresh_order_CancelOrderResponse, _cropfresh_order_CancelOrderRequest__Output, _cropfresh_order_CancelOrderResponse__Output>
  CreateOrder: MethodDefinition<_cropfresh_order_CreateOrderRequest, _cropfresh_order_CreateOrderResponse, _cropfresh_order_CreateOrderRequest__Output, _cropfresh_order_CreateOrderResponse__Output>
  GetOrderStatus: MethodDefinition<_cropfresh_order_GetOrderStatusRequest, _cropfresh_order_GetOrderStatusResponse, _cropfresh_order_GetOrderStatusRequest__Output, _cropfresh_order_GetOrderStatusResponse__Output>
  UpdateOrderStatus: MethodDefinition<_cropfresh_order_UpdateOrderStatusRequest, _cropfresh_order_UpdateOrderStatusResponse, _cropfresh_order_UpdateOrderStatusRequest__Output, _cropfresh_order_UpdateOrderStatusResponse__Output>
}
