// Original file: protos/proto/auth.proto


export interface LoginResponse {
  'token'?: (string);
  'refreshToken'?: (string);
  'userId'?: (string);
  'userType'?: (string);
}

export interface LoginResponse__Output {
  'token': (string);
  'refreshToken': (string);
  'userId': (string);
  'userType': (string);
}
