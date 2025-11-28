import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { OrderServiceClient as _cropfresh_order_OrderServiceClient, OrderServiceDefinition as _cropfresh_order_OrderServiceDefinition } from './cropfresh/order/OrderService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  cropfresh: {
    order: {
      CancelOrderRequest: MessageTypeDefinition
      CancelOrderResponse: MessageTypeDefinition
      CreateOrderRequest: MessageTypeDefinition
      CreateOrderResponse: MessageTypeDefinition
      GetOrderStatusRequest: MessageTypeDefinition
      GetOrderStatusResponse: MessageTypeDefinition
      OrderService: SubtypeConstructor<typeof grpc.Client, _cropfresh_order_OrderServiceClient> & { service: _cropfresh_order_OrderServiceDefinition }
      UpdateOrderStatusRequest: MessageTypeDefinition
      UpdateOrderStatusResponse: MessageTypeDefinition
    }
  }
}

