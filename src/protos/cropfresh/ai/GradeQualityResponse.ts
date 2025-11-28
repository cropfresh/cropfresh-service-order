// Original file: protos/proto/ai.proto


export interface GradeQualityResponse {
  'grade'?: (string);
  'confidenceScore'?: (number | string);
  'qualityIssues'?: (string)[];
  'suggestedPriceRange'?: (string);
}

export interface GradeQualityResponse__Output {
  'grade': (string);
  'confidenceScore': (number);
  'qualityIssues': (string)[];
  'suggestedPriceRange': (string);
}
