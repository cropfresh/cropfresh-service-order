// Original file: protos/proto/logistics.proto

import type { Waypoint as _cropfresh_logistics_Waypoint, Waypoint__Output as _cropfresh_logistics_Waypoint__Output } from '../../cropfresh/logistics/Waypoint';

export interface AssignRouteResponse {
  'routeId'?: (string);
  'waypoints'?: (_cropfresh_logistics_Waypoint)[];
  'estimatedDistanceKm'?: (number | string);
  'estimatedDurationHours'?: (number | string);
  'earnings'?: (number | string);
}

export interface AssignRouteResponse__Output {
  'routeId': (string);
  'waypoints': (_cropfresh_logistics_Waypoint__Output)[];
  'estimatedDistanceKm': (number);
  'estimatedDurationHours': (number);
  'earnings': (number);
}
