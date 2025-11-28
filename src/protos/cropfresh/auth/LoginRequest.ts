// Original file: protos/proto/auth.proto


export interface LoginRequest {
  'phone'?: (string);
  'otp'?: (string);
  'userType'?: (string);
}

export interface LoginRequest__Output {
  'phone': (string);
  'otp': (string);
  'userType': (string);
}
