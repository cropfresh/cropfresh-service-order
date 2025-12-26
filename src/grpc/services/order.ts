import { OrderServiceHandlers } from '../../protos/cropfresh/order/OrderService';
import { Logger } from 'pino';
import { RatingHandlers } from '../rating.handlers';
import { RatingService } from '../../services/rating.service';
import { RatingRepository } from '../../repositories/rating.repository';
import { prisma } from '../../lib/prisma';
import * as grpc from '@grpc/grpc-js';

export const orderServiceHandlers = (logger: Logger): OrderServiceHandlers => {
  // Initialize rating service and handlers
  const ratingRepository = new RatingRepository(prisma);
  const ratingService = new RatingService(ratingRepository);
  const ratingHandlers = new RatingHandlers(ratingService);

  return {
    // Existing order handlers
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
    },

    // Story 3.10: Rating handlers
    GetFarmerRatings: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
      ratingHandlers.getFarmerRatings(call, callback);
    },
    GetFarmerRatingSummary: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
      ratingHandlers.getFarmerRatingSummary(call, callback);
    },
    GetRatingDetails: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
      ratingHandlers.getRatingDetails(call, callback);
    },
    MarkRatingSeen: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
      ratingHandlers.markRatingSeen(call, callback);
    }
  };
};
