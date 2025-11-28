// Original file: protos/proto/payment.proto

import type { Transaction as _cropfresh_payment_Transaction, Transaction__Output as _cropfresh_payment_Transaction__Output } from '../../cropfresh/payment/Transaction';

export interface GetTransactionHistoryResponse {
  'transactions'?: (_cropfresh_payment_Transaction)[];
  'total'?: (number);
}

export interface GetTransactionHistoryResponse__Output {
  'transactions': (_cropfresh_payment_Transaction__Output)[];
  'total': (number);
}
