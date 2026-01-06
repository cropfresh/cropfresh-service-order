/**
 * Buyer Order Service - Story 4.3
 *
 * Business Logic Layer for Buyer Order Placement.
 * Orchestrates order creation, validation, and payment flow.
 *
 * STAR: Situation - Buyers place orders specifying delivery preferences.
 *       Task: Validate listing, create order, initiate payment.
 *       Action: Coordinate repository, generate order number, emit events.
 *       Result: Type-safe order placement with escrow payment integration.
 */

import { BuyerOrderRepository, CreateBuyerOrderInput } from '../repositories/buyer-order.repository';
import { DeliveryTimePref, PaymentStatus } from '../generated/prisma';
import { logger } from '../utils/logger';

// ============================================
// Error Codes
// ============================================

export enum BuyerOrderErrorCode {
    LISTING_NOT_FOUND = 'LISTING_NOT_FOUND',
    LISTING_INACTIVE = 'LISTING_INACTIVE',
    QUANTITY_EXCEEDED = 'QUANTITY_EXCEEDED',
    INVALID_QUANTITY = 'INVALID_QUANTITY',
    ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
    INVALID_PAYMENT_TRANSITION = 'INVALID_PAYMENT_TRANSITION',
    ALREADY_CANCELLED = 'ALREADY_CANCELLED',
}

export class BuyerOrderError extends Error {
    code: BuyerOrderErrorCode;
    metadata?: Record<string, unknown>;

    constructor(code: BuyerOrderErrorCode, message: string, metadata?: Record<string, unknown>) {
        super(message);
        this.code = code;
        this.metadata = metadata;
        this.name = 'BuyerOrderError';
    }
}

// ============================================
// Input/Output DTOs
// ============================================

export interface CreateOrderDTO {
    buyerId: number;
    listingId: number;
    quantityKg: number;
    deliveryAddressId: string;
    deliveryTimePref: 'MORNING' | 'AFTERNOON' | 'EVENING';
}

export interface ListingData {
    id: number;
    farmerId: number;
    cropType: string;
    cropEmoji?: string;
    quantityKg: number;
    pricePerKg: number;
    qualityGrade?: string;
    farmerZone?: string;
    status: string;
}

export interface CreateOrderResult {
    orderId: number;
    orderNumber: string;
    status: string;
    totalAmount: number;
    upiPaymentLink: string;
    estimatedDelivery: string;
}

export interface PaymentCallbackDTO {
    orderId: number;
    success: boolean;
    transactionId?: string;
    errorMessage?: string;
}

// ============================================
// Buyer Order Service Class
// ============================================

export class BuyerOrderService {
    private repo: BuyerOrderRepository;

    constructor(repo: BuyerOrderRepository) {
        this.repo = repo;
    }

    /**
     * STAR: Create buyer order with validation.
     * Situation: Buyer confirmed order on produce detail screen.
     * Task: Validate listing, calculate total, create order.
     * Action: Generate order number, store in DB, return payment link.
     */
    async createOrder(dto: CreateOrderDTO, listingData: ListingData): Promise<CreateOrderResult> {
        const correlationId = `svc-${Date.now()}`;
        logger.info({ correlationId, dto }, 'Creating buyer order');

        // Validation: Check listing is active
        if (listingData.status !== 'ACTIVE') {
            throw new BuyerOrderError(
                BuyerOrderErrorCode.LISTING_INACTIVE,
                'Listing is no longer available',
                { listingId: dto.listingId, status: listingData.status }
            );
        }

        // Validation: Check quantity > 0
        if (dto.quantityKg <= 0) {
            throw new BuyerOrderError(
                BuyerOrderErrorCode.INVALID_QUANTITY,
                'Quantity must be greater than 0',
                { requested: dto.quantityKg }
            );
        }

        // Validation: Check quantity <= available
        if (dto.quantityKg > listingData.quantityKg) {
            throw new BuyerOrderError(
                BuyerOrderErrorCode.QUANTITY_EXCEEDED,
                'Requested quantity exceeds available stock',
                { requested: dto.quantityKg, available: listingData.quantityKg }
            );
        }

        // Generate unique order number
        const orderNumber = this.generateOrderNumber();

        // Calculate total
        const totalAmount = dto.quantityKg * listingData.pricePerKg;

        // Map delivery time pref
        const deliveryTimePref = this.mapDeliveryTimePref(dto.deliveryTimePref);

        // Create order
        const input: CreateBuyerOrderInput = {
            buyerId: dto.buyerId,
            farmerId: listingData.farmerId,
            listingId: dto.listingId.toString(),
            orderNumber,
            quantityKg: dto.quantityKg,
            totalAmount,
            pricePerKg: listingData.pricePerKg,
            cropType: listingData.cropType,
            cropEmoji: listingData.cropEmoji,
            qualityGrade: listingData.qualityGrade,
            farmerZone: listingData.farmerZone,
            deliveryAddressId: dto.deliveryAddressId,
            deliveryTimePref,
        };

        const order = await this.repo.create(input);

        // Generate UPI payment link (placeholder - real implementation would call payment service)
        const upiPaymentLink = this.generateUpiLink(order.id, totalAmount);

        // Calculate estimated delivery
        const estimatedDelivery = this.calculateEstimatedDelivery(dto.deliveryTimePref);

        logger.info(
            { correlationId, orderId: order.id, orderNumber },
            'Buyer order created successfully'
        );

        return {
            orderId: order.id,
            orderNumber: order.orderNumber,
            status: 'PENDING_PAYMENT',
            totalAmount,
            upiPaymentLink,
            estimatedDelivery,
        };
    }

    /**
     * STAR: Handle payment callback.
     * Situation: Payment gateway sends callback with result.
     * Task: Update order status based on payment result.
     */
    async handlePaymentCallback(dto: PaymentCallbackDTO): Promise<void> {
        const correlationId = `svc-${Date.now()}`;
        logger.info({ correlationId, dto }, 'Processing payment callback');

        const order = await this.repo.findById(dto.orderId);
        if (!order) {
            throw new BuyerOrderError(
                BuyerOrderErrorCode.ORDER_NOT_FOUND,
                'Order not found',
                { orderId: dto.orderId }
            );
        }

        if (dto.success) {
            await this.repo.updatePaymentStatus({
                orderId: dto.orderId,
                paymentStatus: PaymentStatus.SECURED,
                escrowTransactionId: dto.transactionId,
                upiTransactionId: dto.transactionId,
            });

            // TODO: Emit order.payment_secured event to RabbitMQ
            // TODO: Call notification-service to alert farmer
            logger.info({ correlationId, orderId: dto.orderId }, 'Payment secured');
        } else {
            await this.repo.updatePaymentStatus({
                orderId: dto.orderId,
                paymentStatus: PaymentStatus.FAILED,
            });

            // TODO: Emit order.payment_failed event
            logger.warn(
                { correlationId, orderId: dto.orderId, error: dto.errorMessage },
                'Payment failed'
            );
        }
    }

    /**
     * STAR: Cancel order before payment.
     * Situation: Buyer cancels order before completing payment.
     * Task: Mark order cancelled, release reserved quantity.
     */
    async cancelOrder(orderId: number, buyerId: number): Promise<void> {
        const correlationId = `svc-${Date.now()}`;
        logger.info({ correlationId, orderId, buyerId }, 'Cancelling order');

        const order = await this.repo.findById(orderId);
        if (!order) {
            throw new BuyerOrderError(
                BuyerOrderErrorCode.ORDER_NOT_FOUND,
                'Order not found',
                { orderId }
            );
        }

        if (order.buyerId !== buyerId) {
            throw new BuyerOrderError(
                BuyerOrderErrorCode.ORDER_NOT_FOUND,
                'Order not found',
                { orderId }
            );
        }

        if (order.deletedAt) {
            throw new BuyerOrderError(
                BuyerOrderErrorCode.ALREADY_CANCELLED,
                'Order is already cancelled',
                { orderId }
            );
        }

        await this.repo.cancelOrder(orderId, 'BUYER_CANCELLED');

        // TODO: Emit order.cancelled event for quantity restoration
        // TODO: Call catalog service to release reserved quantity
        logger.info({ correlationId, orderId }, 'Order cancelled');
    }

    /**
     * Generate unique order number.
     * Format: ORD-{timestamp}-{random}
     */
    private generateOrderNumber(): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    }

    /**
     * Map string to DeliveryTimePref enum.
     */
    private mapDeliveryTimePref(pref: string): DeliveryTimePref {
        switch (pref) {
            case 'MORNING':
                return DeliveryTimePref.MORNING;
            case 'AFTERNOON':
                return DeliveryTimePref.AFTERNOON;
            case 'EVENING':
                return DeliveryTimePref.EVENING;
            default:
                return DeliveryTimePref.MORNING;
        }
    }

    /**
     * Generate UPI payment link (placeholder).
     * TODO: Integrate with actual payment gateway (Razorpay/Paytm).
     */
    private generateUpiLink(orderId: number, amount: number): string {
        const amountInRupees = amount.toFixed(2);
        return `upi://pay?pa=cropfresh@ybl&pn=CropFresh&am=${amountInRupees}&cu=INR&tn=Order-${orderId}`;
    }

    /**
     * Calculate estimated delivery date.
     */
    private calculateEstimatedDelivery(timePref: string): string {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        switch (timePref) {
            case 'MORNING':
                return `${dateStr}, 6AM - 12PM`;
            case 'AFTERNOON':
                return `${dateStr}, 12PM - 5PM`;
            case 'EVENING':
                return `${dateStr}, 5PM - 9PM`;
            default:
                return `${dateStr}, 6AM - 12PM`;
        }
    }
}
