// Original file: protos/proto/ai.proto


export interface PredictShelfLifeResponse {
  'estimatedDays'?: (number);
  'confidenceScore'?: (number | string);
  'storageRecommendation'?: (string);
}

export interface PredictShelfLifeResponse__Output {
  'estimatedDays': (number);
  'confidenceScore': (number);
  'storageRecommendation': (string);
}
