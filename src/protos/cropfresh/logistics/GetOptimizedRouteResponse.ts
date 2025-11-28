// Original file: protos/proto/logistics.proto

import type { Waypoint as _cropfresh_logistics_Waypoint, Waypoint__Output as _cropfresh_logistics_Waypoint__Output } from '../../cropfresh/logistics/Waypoint';

export interface GetOptimizedRouteResponse {
  'optimizedWaypoints'?: (_cropfresh_logistics_Waypoint)[];
  'totalDistanceKm'?: (number | string);
}

export interface GetOptimizedRouteResponse__Output {
  'optimizedWaypoints': (_cropfresh_logistics_Waypoint__Output)[];
  'totalDistanceKm': (number);
}
