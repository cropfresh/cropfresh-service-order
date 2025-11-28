// Original file: protos/proto/catalog.proto


export interface ProduceItem {
  'id'?: (string);
  'farmerId'?: (string);
  'name'?: (string);
  'category'?: (string);
  'quantityKg'?: (number | string);
  'pricePerKg'?: (number | string);
  'qualityGrade'?: (string);
  'location'?: (string);
  'photoUrl'?: (string);
}

export interface ProduceItem__Output {
  'id': (string);
  'farmerId': (string);
  'name': (string);
  'category': (string);
  'quantityKg': (number);
  'pricePerKg': (number);
  'qualityGrade': (string);
  'location': (string);
  'photoUrl': (string);
}
