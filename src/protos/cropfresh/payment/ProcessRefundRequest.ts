// Original file: protos/proto/payment.proto


export interface ProcessRefundRequest {
  'paymentId'?: (string);
  'amount'?: (number | string);
  'reason'?: (string);
}

export interface ProcessRefundRequest__Output {
  'paymentId': (string);
  'amount': (number);
  'reason': (string);
}
