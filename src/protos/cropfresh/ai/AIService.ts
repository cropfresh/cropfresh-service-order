// Original file: protos/proto/ai.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GradeQualityRequest as _cropfresh_ai_GradeQualityRequest, GradeQualityRequest__Output as _cropfresh_ai_GradeQualityRequest__Output } from '../../cropfresh/ai/GradeQualityRequest';
import type { GradeQualityResponse as _cropfresh_ai_GradeQualityResponse, GradeQualityResponse__Output as _cropfresh_ai_GradeQualityResponse__Output } from '../../cropfresh/ai/GradeQualityResponse';
import type { MatchBuyerRequest as _cropfresh_ai_MatchBuyerRequest, MatchBuyerRequest__Output as _cropfresh_ai_MatchBuyerRequest__Output } from '../../cropfresh/ai/MatchBuyerRequest';
import type { MatchBuyerResponse as _cropfresh_ai_MatchBuyerResponse, MatchBuyerResponse__Output as _cropfresh_ai_MatchBuyerResponse__Output } from '../../cropfresh/ai/MatchBuyerResponse';
import type { OptimizePriceRequest as _cropfresh_ai_OptimizePriceRequest, OptimizePriceRequest__Output as _cropfresh_ai_OptimizePriceRequest__Output } from '../../cropfresh/ai/OptimizePriceRequest';
import type { OptimizePriceResponse as _cropfresh_ai_OptimizePriceResponse, OptimizePriceResponse__Output as _cropfresh_ai_OptimizePriceResponse__Output } from '../../cropfresh/ai/OptimizePriceResponse';
import type { PredictShelfLifeRequest as _cropfresh_ai_PredictShelfLifeRequest, PredictShelfLifeRequest__Output as _cropfresh_ai_PredictShelfLifeRequest__Output } from '../../cropfresh/ai/PredictShelfLifeRequest';
import type { PredictShelfLifeResponse as _cropfresh_ai_PredictShelfLifeResponse, PredictShelfLifeResponse__Output as _cropfresh_ai_PredictShelfLifeResponse__Output } from '../../cropfresh/ai/PredictShelfLifeResponse';

export interface AIServiceClient extends grpc.Client {
  GradeQuality(argument: _cropfresh_ai_GradeQualityRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_GradeQualityResponse__Output>): grpc.ClientUnaryCall;
  GradeQuality(argument: _cropfresh_ai_GradeQualityRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_ai_GradeQualityResponse__Output>): grpc.ClientUnaryCall;
  GradeQuality(argument: _cropfresh_ai_GradeQualityRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_GradeQualityResponse__Output>): grpc.ClientUnaryCall;
  GradeQuality(argument: _cropfresh_ai_GradeQualityRequest, callback: grpc.requestCallback<_cropfresh_ai_GradeQualityResponse__Output>): grpc.ClientUnaryCall;
  gradeQuality(argument: _cropfresh_ai_GradeQualityRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_GradeQualityResponse__Output>): grpc.ClientUnaryCall;
  gradeQuality(argument: _cropfresh_ai_GradeQualityRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_ai_GradeQualityResponse__Output>): grpc.ClientUnaryCall;
  gradeQuality(argument: _cropfresh_ai_GradeQualityRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_GradeQualityResponse__Output>): grpc.ClientUnaryCall;
  gradeQuality(argument: _cropfresh_ai_GradeQualityRequest, callback: grpc.requestCallback<_cropfresh_ai_GradeQualityResponse__Output>): grpc.ClientUnaryCall;
  
  MatchBuyer(argument: _cropfresh_ai_MatchBuyerRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_MatchBuyerResponse__Output>): grpc.ClientUnaryCall;
  MatchBuyer(argument: _cropfresh_ai_MatchBuyerRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_ai_MatchBuyerResponse__Output>): grpc.ClientUnaryCall;
  MatchBuyer(argument: _cropfresh_ai_MatchBuyerRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_MatchBuyerResponse__Output>): grpc.ClientUnaryCall;
  MatchBuyer(argument: _cropfresh_ai_MatchBuyerRequest, callback: grpc.requestCallback<_cropfresh_ai_MatchBuyerResponse__Output>): grpc.ClientUnaryCall;
  matchBuyer(argument: _cropfresh_ai_MatchBuyerRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_MatchBuyerResponse__Output>): grpc.ClientUnaryCall;
  matchBuyer(argument: _cropfresh_ai_MatchBuyerRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_ai_MatchBuyerResponse__Output>): grpc.ClientUnaryCall;
  matchBuyer(argument: _cropfresh_ai_MatchBuyerRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_MatchBuyerResponse__Output>): grpc.ClientUnaryCall;
  matchBuyer(argument: _cropfresh_ai_MatchBuyerRequest, callback: grpc.requestCallback<_cropfresh_ai_MatchBuyerResponse__Output>): grpc.ClientUnaryCall;
  
  OptimizePrice(argument: _cropfresh_ai_OptimizePriceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_OptimizePriceResponse__Output>): grpc.ClientUnaryCall;
  OptimizePrice(argument: _cropfresh_ai_OptimizePriceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_ai_OptimizePriceResponse__Output>): grpc.ClientUnaryCall;
  OptimizePrice(argument: _cropfresh_ai_OptimizePriceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_OptimizePriceResponse__Output>): grpc.ClientUnaryCall;
  OptimizePrice(argument: _cropfresh_ai_OptimizePriceRequest, callback: grpc.requestCallback<_cropfresh_ai_OptimizePriceResponse__Output>): grpc.ClientUnaryCall;
  optimizePrice(argument: _cropfresh_ai_OptimizePriceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_OptimizePriceResponse__Output>): grpc.ClientUnaryCall;
  optimizePrice(argument: _cropfresh_ai_OptimizePriceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_ai_OptimizePriceResponse__Output>): grpc.ClientUnaryCall;
  optimizePrice(argument: _cropfresh_ai_OptimizePriceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_OptimizePriceResponse__Output>): grpc.ClientUnaryCall;
  optimizePrice(argument: _cropfresh_ai_OptimizePriceRequest, callback: grpc.requestCallback<_cropfresh_ai_OptimizePriceResponse__Output>): grpc.ClientUnaryCall;
  
  PredictShelfLife(argument: _cropfresh_ai_PredictShelfLifeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_PredictShelfLifeResponse__Output>): grpc.ClientUnaryCall;
  PredictShelfLife(argument: _cropfresh_ai_PredictShelfLifeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_ai_PredictShelfLifeResponse__Output>): grpc.ClientUnaryCall;
  PredictShelfLife(argument: _cropfresh_ai_PredictShelfLifeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_PredictShelfLifeResponse__Output>): grpc.ClientUnaryCall;
  PredictShelfLife(argument: _cropfresh_ai_PredictShelfLifeRequest, callback: grpc.requestCallback<_cropfresh_ai_PredictShelfLifeResponse__Output>): grpc.ClientUnaryCall;
  predictShelfLife(argument: _cropfresh_ai_PredictShelfLifeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_PredictShelfLifeResponse__Output>): grpc.ClientUnaryCall;
  predictShelfLife(argument: _cropfresh_ai_PredictShelfLifeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_ai_PredictShelfLifeResponse__Output>): grpc.ClientUnaryCall;
  predictShelfLife(argument: _cropfresh_ai_PredictShelfLifeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_ai_PredictShelfLifeResponse__Output>): grpc.ClientUnaryCall;
  predictShelfLife(argument: _cropfresh_ai_PredictShelfLifeRequest, callback: grpc.requestCallback<_cropfresh_ai_PredictShelfLifeResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface AIServiceHandlers extends grpc.UntypedServiceImplementation {
  GradeQuality: grpc.handleUnaryCall<_cropfresh_ai_GradeQualityRequest__Output, _cropfresh_ai_GradeQualityResponse>;
  
  MatchBuyer: grpc.handleUnaryCall<_cropfresh_ai_MatchBuyerRequest__Output, _cropfresh_ai_MatchBuyerResponse>;
  
  OptimizePrice: grpc.handleUnaryCall<_cropfresh_ai_OptimizePriceRequest__Output, _cropfresh_ai_OptimizePriceResponse>;
  
  PredictShelfLife: grpc.handleUnaryCall<_cropfresh_ai_PredictShelfLifeRequest__Output, _cropfresh_ai_PredictShelfLifeResponse>;
  
}

export interface AIServiceDefinition extends grpc.ServiceDefinition {
  GradeQuality: MethodDefinition<_cropfresh_ai_GradeQualityRequest, _cropfresh_ai_GradeQualityResponse, _cropfresh_ai_GradeQualityRequest__Output, _cropfresh_ai_GradeQualityResponse__Output>
  MatchBuyer: MethodDefinition<_cropfresh_ai_MatchBuyerRequest, _cropfresh_ai_MatchBuyerResponse, _cropfresh_ai_MatchBuyerRequest__Output, _cropfresh_ai_MatchBuyerResponse__Output>
  OptimizePrice: MethodDefinition<_cropfresh_ai_OptimizePriceRequest, _cropfresh_ai_OptimizePriceResponse, _cropfresh_ai_OptimizePriceRequest__Output, _cropfresh_ai_OptimizePriceResponse__Output>
  PredictShelfLife: MethodDefinition<_cropfresh_ai_PredictShelfLifeRequest, _cropfresh_ai_PredictShelfLifeResponse, _cropfresh_ai_PredictShelfLifeRequest__Output, _cropfresh_ai_PredictShelfLifeResponse__Output>
}
