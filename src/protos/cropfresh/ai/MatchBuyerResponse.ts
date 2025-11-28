// Original file: protos/proto/ai.proto


export interface MatchBuyerResponse {
  'buyerIds'?: (string)[];
  'matchScores'?: (number | string)[];
  'recommendedPrice'?: (string);
}

export interface MatchBuyerResponse__Output {
  'buyerIds': (string)[];
  'matchScores': (number)[];
  'recommendedPrice': (string);
}
