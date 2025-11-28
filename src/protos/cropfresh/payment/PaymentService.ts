// Original file: protos/proto/payment.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetTransactionHistoryRequest as _cropfresh_payment_GetTransactionHistoryRequest, GetTransactionHistoryRequest__Output as _cropfresh_payment_GetTransactionHistoryRequest__Output } from '../../cropfresh/payment/GetTransactionHistoryRequest';
import type { GetTransactionHistoryResponse as _cropfresh_payment_GetTransactionHistoryResponse, GetTransactionHistoryResponse__Output as _cropfresh_payment_GetTransactionHistoryResponse__Output } from '../../cropfresh/payment/GetTransactionHistoryResponse';
import type { InitiatePaymentRequest as _cropfresh_payment_InitiatePaymentRequest, InitiatePaymentRequest__Output as _cropfresh_payment_InitiatePaymentRequest__Output } from '../../cropfresh/payment/InitiatePaymentRequest';
import type { InitiatePaymentResponse as _cropfresh_payment_InitiatePaymentResponse, InitiatePaymentResponse__Output as _cropfresh_payment_InitiatePaymentResponse__Output } from '../../cropfresh/payment/InitiatePaymentResponse';
import type { ProcessRefundRequest as _cropfresh_payment_ProcessRefundRequest, ProcessRefundRequest__Output as _cropfresh_payment_ProcessRefundRequest__Output } from '../../cropfresh/payment/ProcessRefundRequest';
import type { ProcessRefundResponse as _cropfresh_payment_ProcessRefundResponse, ProcessRefundResponse__Output as _cropfresh_payment_ProcessRefundResponse__Output } from '../../cropfresh/payment/ProcessRefundResponse';
import type { VerifyPaymentRequest as _cropfresh_payment_VerifyPaymentRequest, VerifyPaymentRequest__Output as _cropfresh_payment_VerifyPaymentRequest__Output } from '../../cropfresh/payment/VerifyPaymentRequest';
import type { VerifyPaymentResponse as _cropfresh_payment_VerifyPaymentResponse, VerifyPaymentResponse__Output as _cropfresh_payment_VerifyPaymentResponse__Output } from '../../cropfresh/payment/VerifyPaymentResponse';

export interface PaymentServiceClient extends grpc.Client {
  GetTransactionHistory(argument: _cropfresh_payment_GetTransactionHistoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_GetTransactionHistoryResponse__Output>): grpc.ClientUnaryCall;
  GetTransactionHistory(argument: _cropfresh_payment_GetTransactionHistoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_payment_GetTransactionHistoryResponse__Output>): grpc.ClientUnaryCall;
  GetTransactionHistory(argument: _cropfresh_payment_GetTransactionHistoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_GetTransactionHistoryResponse__Output>): grpc.ClientUnaryCall;
  GetTransactionHistory(argument: _cropfresh_payment_GetTransactionHistoryRequest, callback: grpc.requestCallback<_cropfresh_payment_GetTransactionHistoryResponse__Output>): grpc.ClientUnaryCall;
  getTransactionHistory(argument: _cropfresh_payment_GetTransactionHistoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_GetTransactionHistoryResponse__Output>): grpc.ClientUnaryCall;
  getTransactionHistory(argument: _cropfresh_payment_GetTransactionHistoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_payment_GetTransactionHistoryResponse__Output>): grpc.ClientUnaryCall;
  getTransactionHistory(argument: _cropfresh_payment_GetTransactionHistoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_GetTransactionHistoryResponse__Output>): grpc.ClientUnaryCall;
  getTransactionHistory(argument: _cropfresh_payment_GetTransactionHistoryRequest, callback: grpc.requestCallback<_cropfresh_payment_GetTransactionHistoryResponse__Output>): grpc.ClientUnaryCall;
  
  InitiatePayment(argument: _cropfresh_payment_InitiatePaymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_InitiatePaymentResponse__Output>): grpc.ClientUnaryCall;
  InitiatePayment(argument: _cropfresh_payment_InitiatePaymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_payment_InitiatePaymentResponse__Output>): grpc.ClientUnaryCall;
  InitiatePayment(argument: _cropfresh_payment_InitiatePaymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_InitiatePaymentResponse__Output>): grpc.ClientUnaryCall;
  InitiatePayment(argument: _cropfresh_payment_InitiatePaymentRequest, callback: grpc.requestCallback<_cropfresh_payment_InitiatePaymentResponse__Output>): grpc.ClientUnaryCall;
  initiatePayment(argument: _cropfresh_payment_InitiatePaymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_InitiatePaymentResponse__Output>): grpc.ClientUnaryCall;
  initiatePayment(argument: _cropfresh_payment_InitiatePaymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_payment_InitiatePaymentResponse__Output>): grpc.ClientUnaryCall;
  initiatePayment(argument: _cropfresh_payment_InitiatePaymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_InitiatePaymentResponse__Output>): grpc.ClientUnaryCall;
  initiatePayment(argument: _cropfresh_payment_InitiatePaymentRequest, callback: grpc.requestCallback<_cropfresh_payment_InitiatePaymentResponse__Output>): grpc.ClientUnaryCall;
  
  ProcessRefund(argument: _cropfresh_payment_ProcessRefundRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_ProcessRefundResponse__Output>): grpc.ClientUnaryCall;
  ProcessRefund(argument: _cropfresh_payment_ProcessRefundRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_payment_ProcessRefundResponse__Output>): grpc.ClientUnaryCall;
  ProcessRefund(argument: _cropfresh_payment_ProcessRefundRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_ProcessRefundResponse__Output>): grpc.ClientUnaryCall;
  ProcessRefund(argument: _cropfresh_payment_ProcessRefundRequest, callback: grpc.requestCallback<_cropfresh_payment_ProcessRefundResponse__Output>): grpc.ClientUnaryCall;
  processRefund(argument: _cropfresh_payment_ProcessRefundRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_ProcessRefundResponse__Output>): grpc.ClientUnaryCall;
  processRefund(argument: _cropfresh_payment_ProcessRefundRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_payment_ProcessRefundResponse__Output>): grpc.ClientUnaryCall;
  processRefund(argument: _cropfresh_payment_ProcessRefundRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_ProcessRefundResponse__Output>): grpc.ClientUnaryCall;
  processRefund(argument: _cropfresh_payment_ProcessRefundRequest, callback: grpc.requestCallback<_cropfresh_payment_ProcessRefundResponse__Output>): grpc.ClientUnaryCall;
  
  VerifyPayment(argument: _cropfresh_payment_VerifyPaymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_VerifyPaymentResponse__Output>): grpc.ClientUnaryCall;
  VerifyPayment(argument: _cropfresh_payment_VerifyPaymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_payment_VerifyPaymentResponse__Output>): grpc.ClientUnaryCall;
  VerifyPayment(argument: _cropfresh_payment_VerifyPaymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_VerifyPaymentResponse__Output>): grpc.ClientUnaryCall;
  VerifyPayment(argument: _cropfresh_payment_VerifyPaymentRequest, callback: grpc.requestCallback<_cropfresh_payment_VerifyPaymentResponse__Output>): grpc.ClientUnaryCall;
  verifyPayment(argument: _cropfresh_payment_VerifyPaymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_VerifyPaymentResponse__Output>): grpc.ClientUnaryCall;
  verifyPayment(argument: _cropfresh_payment_VerifyPaymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_cropfresh_payment_VerifyPaymentResponse__Output>): grpc.ClientUnaryCall;
  verifyPayment(argument: _cropfresh_payment_VerifyPaymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_cropfresh_payment_VerifyPaymentResponse__Output>): grpc.ClientUnaryCall;
  verifyPayment(argument: _cropfresh_payment_VerifyPaymentRequest, callback: grpc.requestCallback<_cropfresh_payment_VerifyPaymentResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface PaymentServiceHandlers extends grpc.UntypedServiceImplementation {
  GetTransactionHistory: grpc.handleUnaryCall<_cropfresh_payment_GetTransactionHistoryRequest__Output, _cropfresh_payment_GetTransactionHistoryResponse>;
  
  InitiatePayment: grpc.handleUnaryCall<_cropfresh_payment_InitiatePaymentRequest__Output, _cropfresh_payment_InitiatePaymentResponse>;
  
  ProcessRefund: grpc.handleUnaryCall<_cropfresh_payment_ProcessRefundRequest__Output, _cropfresh_payment_ProcessRefundResponse>;
  
  VerifyPayment: grpc.handleUnaryCall<_cropfresh_payment_VerifyPaymentRequest__Output, _cropfresh_payment_VerifyPaymentResponse>;
  
}

export interface PaymentServiceDefinition extends grpc.ServiceDefinition {
  GetTransactionHistory: MethodDefinition<_cropfresh_payment_GetTransactionHistoryRequest, _cropfresh_payment_GetTransactionHistoryResponse, _cropfresh_payment_GetTransactionHistoryRequest__Output, _cropfresh_payment_GetTransactionHistoryResponse__Output>
  InitiatePayment: MethodDefinition<_cropfresh_payment_InitiatePaymentRequest, _cropfresh_payment_InitiatePaymentResponse, _cropfresh_payment_InitiatePaymentRequest__Output, _cropfresh_payment_InitiatePaymentResponse__Output>
  ProcessRefund: MethodDefinition<_cropfresh_payment_ProcessRefundRequest, _cropfresh_payment_ProcessRefundResponse, _cropfresh_payment_ProcessRefundRequest__Output, _cropfresh_payment_ProcessRefundResponse__Output>
  VerifyPayment: MethodDefinition<_cropfresh_payment_VerifyPaymentRequest, _cropfresh_payment_VerifyPaymentResponse, _cropfresh_payment_VerifyPaymentRequest__Output, _cropfresh_payment_VerifyPaymentResponse__Output>
}
