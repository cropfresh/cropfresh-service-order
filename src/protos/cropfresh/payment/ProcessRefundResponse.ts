// Original file: protos/proto/payment.proto


export interface ProcessRefundResponse {
  'success'?: (boolean);
  'refundId'?: (string);
  'estimatedArrival'?: (string);
}

export interface ProcessRefundResponse__Output {
  'success': (boolean);
  'refundId': (string);
  'estimatedArrival': (string);
}
