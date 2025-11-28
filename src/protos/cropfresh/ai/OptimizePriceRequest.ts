// Original file: protos/proto/ai.proto


export interface OptimizePriceRequest {
  'produceType'?: (string);
  'qualityGrade'?: (string);
  'location'?: (string);
  'quantityKg'?: (number | string);
}

export interface OptimizePriceRequest__Output {
  'produceType': (string);
  'qualityGrade': (string);
  'location': (string);
  'quantityKg': (number);
}
