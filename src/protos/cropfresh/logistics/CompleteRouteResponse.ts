// Original file: protos/proto/logistics.proto


export interface CompleteRouteResponse {
  'success'?: (boolean);
  'earnings'?: (number | string);
  'paymentId'?: (string);
}

export interface CompleteRouteResponse__Output {
  'success': (boolean);
  'earnings': (number);
  'paymentId': (string);
}
