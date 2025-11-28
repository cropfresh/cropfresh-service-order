// Original file: protos/proto/catalog.proto

import type { ProduceItem as _cropfresh_catalog_ProduceItem, ProduceItem__Output as _cropfresh_catalog_ProduceItem__Output } from '../../cropfresh/catalog/ProduceItem';

export interface GetProduceDetailsResponse {
  'item'?: (_cropfresh_catalog_ProduceItem | null);
  'digitalTwinId'?: (string);
}

export interface GetProduceDetailsResponse__Output {
  'item': (_cropfresh_catalog_ProduceItem__Output | null);
  'digitalTwinId': (string);
}
