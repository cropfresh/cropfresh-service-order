// Original file: protos/proto/payment.proto


export interface Transaction {
  'transactionId'?: (string);
  'amount'?: (number | string);
  'type'?: (string);
  'status'?: (string);
  'timestamp'?: (string);
}

export interface Transaction__Output {
  'transactionId': (string);
  'amount': (number);
  'type': (string);
  'status': (string);
  'timestamp': (string);
}
