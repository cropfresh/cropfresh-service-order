// Original file: protos/proto/logistics.proto


export interface Waypoint {
  'location'?: (string);
  'type'?: (string);
  'address'?: (string);
  'lat'?: (number | string);
  'lng'?: (number | string);
}

export interface Waypoint__Output {
  'location': (string);
  'type': (string);
  'address': (string);
  'lat': (number);
  'lng': (number);
}
