// Original file: protos/proto/logistics.proto


export interface UpdateLocationRequest {
  'haulerId'?: (string);
  'routeId'?: (string);
  'lat'?: (number | string);
  'lng'?: (number | string);
}

export interface UpdateLocationRequest__Output {
  'haulerId': (string);
  'routeId': (string);
  'lat': (number);
  'lng': (number);
}
