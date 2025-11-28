import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { AuthServiceClient as _cropfresh_auth_AuthServiceClient, AuthServiceDefinition as _cropfresh_auth_AuthServiceDefinition } from './cropfresh/auth/AuthService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  cropfresh: {
    auth: {
      AuthService: SubtypeConstructor<typeof grpc.Client, _cropfresh_auth_AuthServiceClient> & { service: _cropfresh_auth_AuthServiceDefinition }
      LoginRequest: MessageTypeDefinition
      LoginResponse: MessageTypeDefinition
      LogoutRequest: MessageTypeDefinition
      LogoutResponse: MessageTypeDefinition
      RefreshTokenRequest: MessageTypeDefinition
      RefreshTokenResponse: MessageTypeDefinition
      VerifyTokenRequest: MessageTypeDefinition
      VerifyTokenResponse: MessageTypeDefinition
    }
  }
}

