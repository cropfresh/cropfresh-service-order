// Original file: protos/proto/auth.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { LoginRequest as _cropfresh_auth_LoginRequest, LoginRequest__Output as _cropfresh_auth_LoginRequest__Output } from '../../cropfresh/auth/LoginRequest';
import type { LoginResponse as _cropfresh_auth_LoginResponse, LoginResponse__Output as _cropfresh_auth_LoginResponse__Output } from '../../cropfresh/auth/LoginResponse';
import type { LogoutRequest as _cropfresh_auth_LogoutRequest, LogoutRequest__Output as _cropfresh_auth_LogoutRequest__Output } from '../../cropfresh/auth/LogoutRequest';
import type { LogoutResponse as _cropfresh_auth_LogoutResponse, LogoutResponse__Output as _cropfresh_auth_LogoutResponse__Output } from '../../cropfresh/auth/LogoutResponse';
import type { RefreshTokenRequest as _cropfresh_auth_RefreshTokenRequest, RefreshTokenRequest__Output as _cropfresh_auth_RefreshTokenRequest__Output } from '../../cropfresh/auth/RefreshTokenRequest';
import type { RefreshTokenResponse as _cropfresh_auth_RefreshTokenResponse, RefreshTokenResponse__Output as _cropfresh_auth_RefreshTokenResponse__Output } from '../../cropfresh/auth/RefreshTokenResponse';
import type { VerifyTokenRequest as _cropfresh_auth_VerifyTokenRequest, VerifyTokenRequest__Output as _cropfresh_auth_VerifyTokenRequest__Output } from '../../cropfresh/auth/VerifyTokenRequest';
import type { VerifyTokenResponse as _cropfresh_auth_VerifyTokenResponse, VerifyTokenResponse__Output as _cropfresh_auth_VerifyTokenResponse__Output } from '../../cropfresh/auth/VerifyTokenResponse';

export interface AuthServiceClient extends grpc.Client {
  Login(argument: _cropfresh_auth_LoginRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  Login(argument: _cropfresh_auth_LoginRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  Login(argument: _cropfresh_auth_LoginRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  Login(argument: _cropfresh_auth_LoginRequest, callback: grpc.requestCallback<_cropfresh_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _cropfresh_auth_LoginRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _cropfresh_auth_LoginRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _cropfresh_auth_LoginRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _cropfresh_auth_LoginRequest, callback: grpc.requestCallback<_cropfresh_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  
  Logout(argument: _cropfresh_auth_LogoutRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_LogoutResponse__Output>): grpc.ClientUnaryCall;
  Logout(argument: _cropfresh_auth_LogoutRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_auth_LogoutResponse__Output>): grpc.ClientUnaryCall;
  Logout(argument: _cropfresh_auth_LogoutRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_LogoutResponse__Output>): grpc.ClientUnaryCall;
  Logout(argument: _cropfresh_auth_LogoutRequest, callback: grpc.requestCallback<_cropfresh_auth_LogoutResponse__Output>): grpc.ClientUnaryCall;
  logout(argument: _cropfresh_auth_LogoutRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_LogoutResponse__Output>): grpc.ClientUnaryCall;
  logout(argument: _cropfresh_auth_LogoutRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_auth_LogoutResponse__Output>): grpc.ClientUnaryCall;
  logout(argument: _cropfresh_auth_LogoutRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_LogoutResponse__Output>): grpc.ClientUnaryCall;
  logout(argument: _cropfresh_auth_LogoutRequest, callback: grpc.requestCallback<_cropfresh_auth_LogoutResponse__Output>): grpc.ClientUnaryCall;
  
  RefreshToken(argument: _cropfresh_auth_RefreshTokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_RefreshTokenResponse__Output>): grpc.ClientUnaryCall;
  RefreshToken(argument: _cropfresh_auth_RefreshTokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_auth_RefreshTokenResponse__Output>): grpc.ClientUnaryCall;
  RefreshToken(argument: _cropfresh_auth_RefreshTokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_RefreshTokenResponse__Output>): grpc.ClientUnaryCall;
  RefreshToken(argument: _cropfresh_auth_RefreshTokenRequest, callback: grpc.requestCallback<_cropfresh_auth_RefreshTokenResponse__Output>): grpc.ClientUnaryCall;
  refreshToken(argument: _cropfresh_auth_RefreshTokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_RefreshTokenResponse__Output>): grpc.ClientUnaryCall;
  refreshToken(argument: _cropfresh_auth_RefreshTokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_auth_RefreshTokenResponse__Output>): grpc.ClientUnaryCall;
  refreshToken(argument: _cropfresh_auth_RefreshTokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_RefreshTokenResponse__Output>): grpc.ClientUnaryCall;
  refreshToken(argument: _cropfresh_auth_RefreshTokenRequest, callback: grpc.requestCallback<_cropfresh_auth_RefreshTokenResponse__Output>): grpc.ClientUnaryCall;
  
  VerifyToken(argument: _cropfresh_auth_VerifyTokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _cropfresh_auth_VerifyTokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _cropfresh_auth_VerifyTokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _cropfresh_auth_VerifyTokenRequest, callback: grpc.requestCallback<_cropfresh_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _cropfresh_auth_VerifyTokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _cropfresh_auth_VerifyTokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _cropfresh_auth_VerifyTokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _cropfresh_auth_VerifyTokenRequest, callback: grpc.requestCallback<_cropfresh_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface AuthServiceHandlers extends grpc.UntypedServiceImplementation {
  Login: grpc.handleUnaryCall<_cropfresh_auth_LoginRequest__Output, _cropfresh_auth_LoginResponse>;
  
  Logout: grpc.handleUnaryCall<_cropfresh_auth_LogoutRequest__Output, _cropfresh_auth_LogoutResponse>;
  
  RefreshToken: grpc.handleUnaryCall<_cropfresh_auth_RefreshTokenRequest__Output, _cropfresh_auth_RefreshTokenResponse>;
  
  VerifyToken: grpc.handleUnaryCall<_cropfresh_auth_VerifyTokenRequest__Output, _cropfresh_auth_VerifyTokenResponse>;
  
}

export interface AuthServiceDefinition extends grpc.ServiceDefinition {
  Login: MethodDefinition<_cropfresh_auth_LoginRequest, _cropfresh_auth_LoginResponse, _cropfresh_auth_LoginRequest__Output, _cropfresh_auth_LoginResponse__Output>
  Logout: MethodDefinition<_cropfresh_auth_LogoutRequest, _cropfresh_auth_LogoutResponse, _cropfresh_auth_LogoutRequest__Output, _cropfresh_auth_LogoutResponse__Output>
  RefreshToken: MethodDefinition<_cropfresh_auth_RefreshTokenRequest, _cropfresh_auth_RefreshTokenResponse, _cropfresh_auth_RefreshTokenRequest__Output, _cropfresh_auth_RefreshTokenResponse__Output>
  VerifyToken: MethodDefinition<_cropfresh_auth_VerifyTokenRequest, _cropfresh_auth_VerifyTokenResponse, _cropfresh_auth_VerifyTokenRequest__Output, _cropfresh_auth_VerifyTokenResponse__Output>
}
