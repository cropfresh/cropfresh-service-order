// Original file: protos/proto/ai.proto


export interface GradeQualityRequest {
  'produceType'?: (string);
  'photoUrl'?: (string);
  'weightKg'?: (number | string);
}

export interface GradeQualityRequest__Output {
  'produceType': (string);
  'photoUrl': (string);
  'weightKg': (number);
}
