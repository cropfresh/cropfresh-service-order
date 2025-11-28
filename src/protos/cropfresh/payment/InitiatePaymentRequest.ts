// Original file: protos/proto/payment.proto


export interface InitiatePaymentRequest {
  'orderId'?: (string);
  'amount'?: (number | string);
  'buyerId'?: (string);
  'paymentMethod'?: (string);
}

export interface InitiatePaymentRequest__Output {
  'orderId': (string);
  'amount': (number);
  'buyerId': (string);
  'paymentMethod': (string);
}
