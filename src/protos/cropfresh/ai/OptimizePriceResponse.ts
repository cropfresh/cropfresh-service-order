// Original file: protos/proto/ai.proto


export interface OptimizePriceResponse {
  'suggestedPricePerKg'?: (number | string);
  'minPrice'?: (number | string);
  'maxPrice'?: (number | string);
  'marketTrend'?: (string);
}

export interface OptimizePriceResponse__Output {
  'suggestedPricePerKg': (number);
  'minPrice': (number);
  'maxPrice': (number);
  'marketTrend': (string);
}
