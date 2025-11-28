import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { CatalogServiceClient as _cropfresh_catalog_CatalogServiceClient, CatalogServiceDefinition as _cropfresh_catalog_CatalogServiceDefinition } from './cropfresh/catalog/CatalogService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  cropfresh: {
    catalog: {
      CatalogService: SubtypeConstructor<typeof grpc.Client, _cropfresh_catalog_CatalogServiceClient> & { service: _cropfresh_catalog_CatalogServiceDefinition }
      GetProduceDetailsRequest: MessageTypeDefinition
      GetProduceDetailsResponse: MessageTypeDefinition
      ListProduceRequest: MessageTypeDefinition
      ListProduceResponse: MessageTypeDefinition
      ProduceItem: MessageTypeDefinition
      UpdateInventoryRequest: MessageTypeDefinition
      UpdateInventoryResponse: MessageTypeDefinition
    }
  }
}

