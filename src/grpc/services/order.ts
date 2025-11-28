import * as grpc from '@grpc/grpc-js';
import { OrderServiceHandlers } from '../../protos/cropfresh/order/OrderService';
import { Logger } from 'pino';

export const orderServiceHandlers = (logger: Logger): OrderServiceHandlers => ({
  CreateOrder: (call, callback) => {
    logger.info('CreateOrder called');
    callback(null, { orderId: 'order-1', totalAmount: 100.0, estimatedDelivery: '2023-10-27' });
  },
  GetOrderStatus: (call, callback) => {
    logger.info('GetOrderStatus called');
    callback(null, { orderId: call.request.orderId, status: 'pending', haulerId: 'hauler-1', currentLocation: 'Farm', estimatedDelivery: '2023-10-27' });
  },
  UpdateOrderStatus: (call, callback) => {
    logger.info('UpdateOrderStatus called');
    callback(null, { success: true, timestamp: new Date().toISOString() });
  },
  CancelOrder: (call, callback) => {
    logger.info('CancelOrder called');
    callback(null, { success: true, refundId: 'refund-1' });
  }
});
