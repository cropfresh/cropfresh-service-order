// Original file: protos/proto/catalog.proto

import type { ProduceItem as _cropfresh_catalog_ProduceItem, ProduceItem__Output as _cropfresh_catalog_ProduceItem__Output } from '../../cropfresh/catalog/ProduceItem';

export interface ListProduceResponse {
  'items'?: (_cropfresh_catalog_ProduceItem)[];
  'total'?: (number);
  'page'?: (number);
}

export interface ListProduceResponse__Output {
  'items': (_cropfresh_catalog_ProduceItem__Output)[];
  'total': (number);
  'page': (number);
}
