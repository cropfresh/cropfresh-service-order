import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { AIServiceClient as _cropfresh_ai_AIServiceClient, AIServiceDefinition as _cropfresh_ai_AIServiceDefinition } from './cropfresh/ai/AIService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  cropfresh: {
    ai: {
      AIService: SubtypeConstructor<typeof grpc.Client, _cropfresh_ai_AIServiceClient> & { service: _cropfresh_ai_AIServiceDefinition }
      GradeQualityRequest: MessageTypeDefinition
      GradeQualityResponse: MessageTypeDefinition
      MatchBuyerRequest: MessageTypeDefinition
      MatchBuyerResponse: MessageTypeDefinition
      OptimizePriceRequest: MessageTypeDefinition
      OptimizePriceResponse: MessageTypeDefinition
      PredictShelfLifeRequest: MessageTypeDefinition
      PredictShelfLifeResponse: MessageTypeDefinition
    }
  }
}

