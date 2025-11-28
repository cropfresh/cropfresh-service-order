import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { PaymentServiceClient as _cropfresh_payment_PaymentServiceClient, PaymentServiceDefinition as _cropfresh_payment_PaymentServiceDefinition } from './cropfresh/payment/PaymentService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  cropfresh: {
    payment: {
      GetTransactionHistoryRequest: MessageTypeDefinition
      GetTransactionHistoryResponse: MessageTypeDefinition
      InitiatePaymentRequest: MessageTypeDefinition
      InitiatePaymentResponse: MessageTypeDefinition
      PaymentService: SubtypeConstructor<typeof grpc.Client, _cropfresh_payment_PaymentServiceClient> & { service: _cropfresh_payment_PaymentServiceDefinition }
      ProcessRefundRequest: MessageTypeDefinition
      ProcessRefundResponse: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      VerifyPaymentRequest: MessageTypeDefinition
      VerifyPaymentResponse: MessageTypeDefinition
    }
  }
}

