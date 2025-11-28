// Original file: protos/proto/ai.proto


export interface PredictShelfLifeRequest {
  'produceType'?: (string);
  'qualityGrade'?: (string);
  'temperatureCelsius'?: (number | string);
}

export interface PredictShelfLifeRequest__Output {
  'produceType': (string);
  'qualityGrade': (string);
  'temperatureCelsius': (number);
}
