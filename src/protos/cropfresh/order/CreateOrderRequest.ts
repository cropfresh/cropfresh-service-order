// Original file: protos/proto/order.proto


export interface CreateOrderRequest {
  'buyerId'?: (string);
  'produceId'?: (string);
  'quantityKg'?: (number | string);
  'deliveryAddress'?: (string);
  'deliveryDate'?: (string);
}

export interface CreateOrderRequest__Output {
  'buyerId': (string);
  'produceId': (string);
  'quantityKg': (number);
  'deliveryAddress': (string);
  'deliveryDate': (string);
}
