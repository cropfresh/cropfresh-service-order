// Original file: protos/proto/order.proto


export interface UpdateOrderStatusRequest {
  'orderId'?: (string);
  'newStatus'?: (string);
  'location'?: (string);
  'notes'?: (string);
}

export interface UpdateOrderStatusRequest__Output {
  'orderId': (string);
  'newStatus': (string);
  'location': (string);
  'notes': (string);
}
