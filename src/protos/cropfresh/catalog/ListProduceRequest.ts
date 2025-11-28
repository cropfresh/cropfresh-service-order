// Original file: protos/proto/catalog.proto


export interface ListProduceRequest {
  'buyerId'?: (string);
  'categories'?: (string)[];
  'qualityGrade'?: (string);
  'page'?: (number);
  'limit'?: (number);
}

export interface ListProduceRequest__Output {
  'buyerId': (string);
  'categories': (string)[];
  'qualityGrade': (string);
  'page': (number);
  'limit': (number);
}
