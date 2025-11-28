// Original file: protos/proto/order.proto


export interface CreateOrderResponse {
  'orderId'?: (string);
  'totalAmount'?: (number | string);
  'estimatedDelivery'?: (string);
}

export interface CreateOrderResponse__Output {
  'orderId': (string);
  'totalAmount': (number);
  'estimatedDelivery': (string);
}
