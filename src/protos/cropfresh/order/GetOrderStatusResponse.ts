// Original file: protos/proto/order.proto


export interface GetOrderStatusResponse {
  'orderId'?: (string);
  'status'?: (string);
  'haulerId'?: (string);
  'currentLocation'?: (string);
  'estimatedDelivery'?: (string);
}

export interface GetOrderStatusResponse__Output {
  'orderId': (string);
  'status': (string);
  'haulerId': (string);
  'currentLocation': (string);
  'estimatedDelivery': (string);
}
