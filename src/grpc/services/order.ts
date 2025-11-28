import * as grpc from '@grpc/grpc-js';
import { OrderServiceHandlers } from '../../protos/cropfresh/order/OrderService';
import { Logger } from 'pino';

export const orderServiceHandlers = (logger: Logger): OrderServiceHandlers => ({
  CreateOrder: (call, callback) => {
    logger.info('CreateOrder called');
    callback(null, { id: 'order-1', status: 'PENDING', totalAmount: 100 });
  },
  GetOrder: (call, callback) => {
    logger.info('GetOrder called');
    callback(null, { id: call.request.id, status: 'PENDING', totalAmount: 100, items: [] });
  },
  UpdateOrderStatus: (call, callback) => {
    logger.info('UpdateOrderStatus called');
    callback(null, { id: call.request.id, status: call.request.status });
  },
  ListOrders: (call, callback) => {
    logger.info('ListOrders called');
    callback(null, { orders: [], total: 0 });
  }
});
