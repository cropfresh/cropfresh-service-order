/**
 * Buyer Order Repository - Story 4.3
 *
 * Data Access Layer for Buyer Order Placement.
 * Handles Prisma queries for order creation and status updates.
 *
 * STAR: Situation - Buyers need to create orders with delivery preferences.
 *       Task: Provide CRUD operations for buyer orders.
 *       Action: Implement Prisma queries with proper typing.
 *       Result: Type-safe database access for order placement flow.
 */

import { prisma } from '../lib/prisma';
import {
    Order,
    DeliveryTimePref,
    PaymentStatus,
    Prisma,
} from '../generated/prisma';
import { logger } from '../utils/logger';

// ============================================
// Input/Output Types
// ============================================

export interface CreateBuyerOrderInput {
    buyerId: number;
    farmerId: number;
    listingId: string;
    orderNumber: string;
    quantityKg: number;
    totalAmount: number;
    pricePerKg: number;
    cropType: string;
    cropEmoji?: string;
    qualityGrade?: string;
    farmerZone?: string;
    deliveryAddressId: string;
    deliveryTimePref: DeliveryTimePref;
}

export interface UpdatePaymentStatusInput {
    orderId: number;
    paymentStatus: PaymentStatus;
    escrowTransactionId?: string;
    upiTransactionId?: string;
}

export type BuyerOrder = Order;

// ============================================
// Buyer Order Repository Class
// ============================================

export class BuyerOrderRepository {
    /**
     * STAR: Create new buyer order.
     * Situation: Buyer confirmed order placement.
     * Action: Insert order with PENDING payment status.
     */
    async create(input: CreateBuyerOrderInput): Promise<BuyerOrder> {
        const correlationId = `repo-${Date.now()}`;
        logger.info({ correlationId, input: { orderNumber: input.orderNumber } }, 'Creating buyer order');

        const order = await prisma.order.create({
            data: {
                orderNumber: input.orderNumber,
                buyerId: input.buyerId,
                farmerId: input.farmerId,
                listingId: input.listingId,
                quantityKg: new Prisma.Decimal(input.quantityKg),
                totalAmount: new Prisma.Decimal(input.totalAmount),
                pricePerKg: new Prisma.Decimal(input.pricePerKg),
                cropType: input.cropType,
                cropEmoji: input.cropEmoji,
                qualityGrade: input.qualityGrade,
                farmerZone: input.farmerZone,
                deliveryAddressId: input.deliveryAddressId,
                deliveryTimePref: input.deliveryTimePref,
                paymentStatus: PaymentStatus.PENDING,
                status: 'PENDING',
                trackingStatus: 'LISTED',
                statusHistory: JSON.stringify([
                    {
                        status: 'LISTED',
                        timestamp: new Date().toISOString(),
                        actor: 'BUYER',
                        note: 'Order created by buyer',
                    },
                ]),
            },
        });

        logger.info({ correlationId, orderId: order.id }, 'Buyer order created');
        return order;
    }

    /**
     * STAR: Find order by ID.
     */
    async findById(orderId: number): Promise<BuyerOrder | null> {
        return prisma.order.findUnique({
            where: { id: orderId, deletedAt: null },
        });
    }

    /**
     * STAR: Find order by order number.
     */
    async findByOrderNumber(orderNumber: string): Promise<BuyerOrder | null> {
        return prisma.order.findUnique({
            where: { orderNumber, deletedAt: null },
        });
    }

    /**
     * STAR: Update payment status.
     * Situation: Payment completed or failed.
     * Action: Update paymentStatus and escrowTransactionId.
     */
    async updatePaymentStatus(input: UpdatePaymentStatusInput): Promise<BuyerOrder> {
        const correlationId = `repo-${Date.now()}`;
        logger.info(
            { correlationId, orderId: input.orderId, status: input.paymentStatus },
            'Updating payment status'
        );

        const order = await prisma.order.update({
            where: { id: input.orderId },
            data: {
                paymentStatus: input.paymentStatus,
                escrowTransactionId: input.escrowTransactionId,
                upiTransactionId: input.upiTransactionId,
                paidAt: input.paymentStatus === PaymentStatus.SECURED ? new Date() : undefined,
                trackingStatus: input.paymentStatus === PaymentStatus.SECURED ? 'MATCHED' : undefined,
            },
        });

        logger.info({ correlationId, orderId: order.id }, 'Payment status updated');
        return order;
    }

    /**
     * STAR: Cancel order.
     * Situation: Buyer cancelled before payment.
     * Action: Soft delete order.
     */
    async cancelOrder(orderId: number, reason: string): Promise<BuyerOrder> {
        const correlationId = `repo-${Date.now()}`;
        logger.info({ correlationId, orderId, reason }, 'Cancelling order');

        const currentHistory = await prisma.order.findUnique({
            where: { id: orderId },
            select: { statusHistory: true },
        });

        const history = currentHistory?.statusHistory
            ? JSON.parse(currentHistory.statusHistory as string)
            : [];

        history.push({
            status: 'CANCELLED',
            timestamp: new Date().toISOString(),
            actor: 'BUYER',
            note: reason,
        });

        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'CANCELLED',
                paymentStatus: PaymentStatus.REFUNDED,
                statusHistory: JSON.stringify(history),
                deletedAt: new Date(),
            },
        });

        logger.info({ correlationId, orderId }, 'Order cancelled');
        return order;
    }

    /**
     * STAR: Get buyer's orders.
     */
    async findByBuyerId(buyerId: number, limit = 20): Promise<BuyerOrder[]> {
        return prisma.order.findMany({
            where: { buyerId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
}
