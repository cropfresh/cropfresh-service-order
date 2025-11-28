// Original file: protos/proto/ai.proto


export interface MatchBuyerRequest {
  'produceId'?: (string);
  'location'?: (string);
  'quantityKg'?: (number | string);
  'qualityGrade'?: (string);
}

export interface MatchBuyerRequest__Output {
  'produceId': (string);
  'location': (string);
  'quantityKg': (number);
  'qualityGrade': (string);
}
