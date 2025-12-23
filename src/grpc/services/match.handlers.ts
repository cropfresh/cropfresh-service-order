/**
 * Match gRPC Handlers - Story 3.5
 * 
 * gRPC Interface Layer for Match Service.
 * Maps incoming gRPC requests to MatchService calls.
 * Handles validation and error mapping.
 */

import { Logger } from 'pino';
import { MatchService } from '../../services/match.service';
import { MatchRepository } from '../../repositories/match.repository';
import { prisma } from '../../lib/prisma';
import * as grpc from '@grpc/grpc-js';

// TODO: These types should be generated from proto, but for now assuming we use `any` 
// or define loose interfaces matching the proto for the handler signatures.
// In a real setup, we would run `protoc` to generate TS types.

const matchRepo = new MatchRepository(prisma);
const matchService = new MatchService(matchRepo);

export const matchServiceHandlers = (logger: Logger) => ({
    GetPendingMatches: async (call: any, callback: any) => {
        try {
            const { farmer_id } = call.request;
            // In proto it's string, in our DB it's Int.
            const farmerIdInt = parseInt(farmer_id, 10);

            if (isNaN(farmerIdInt)) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'Invalid farmer_id'
                });
            }

            const matches = await matchService.getPendingMatches(farmerIdInt);

            callback(null, {
                matches: matches.map(m => ({
                    id: m.id,
                    listing_id: m.listingId,
                    quantity_matched: Number(m.quantityMatched),
                    price_per_kg: Number(m.pricePerKg),
                    total_amount: Number(m.totalAmount),
                    status: m.status, // Enum mapping might be needed if strings don't match int codes
                    expires_at: m.expiresAt.toISOString(),
                    created_at: m.createdAt.toISOString(),
                    buyer_id: m.buyerId,
                    buyer_business_type: m.buyerBusinessType,
                    buyer_city: m.buyerCity,
                    buyer_area: m.buyerArea,
                    delivery_date: m.deliveryDate
                })),
                total_count: matches.length
            });
        } catch (err: any) {
            logger.error(err, 'GetPendingMatches failed');
            callback({
                code: grpc.status.INTERNAL,
                message: err.message
            });
        }
    },

    AcceptMatch: async (call: any, callback: any) => {
        try {
            const { match_id, is_partial, accepted_quantity } = call.request;

            const match = await matchService.acceptMatch(match_id, is_partial, accepted_quantity);

            callback(null, {
                success: true,
                order_id: match.orderId,
                message: 'Match accepted successfully'
            });
        } catch (err: any) {
            logger.error(err, 'AcceptMatch failed');
            // Map domain errors to grpc codes
            let code = grpc.status.INTERNAL;
            if (err.message === 'Match not found') code = grpc.status.NOT_FOUND;
            if (err.message.includes('expired')) code = grpc.status.FAILED_PRECONDITION;

            callback({
                code,
                message: err.message
            });
        }
    },

    RejectMatch: async (call: any, callback: any) => {
        try {
            const { match_id, reason_code, other_reason_text } = call.request;

            const reason = reason_code === 'OTHER' && other_reason_text
                ? other_reason_text
                : reason_code;

            await matchService.rejectMatch(match_id, reason);

            callback(null, { success: true });
        } catch (err: any) {
            logger.error(err, 'RejectMatch failed');
            let code = grpc.status.INTERNAL;
            if (err.message === 'Match not found') code = grpc.status.NOT_FOUND;

            callback({
                code,
                message: err.message
            });
        }
    },

    ExpireMatches: async (call: any, callback: any) => {
        try {
            const count = await matchService.expireMatches();
            callback(null, { expired_count: count });
        } catch (err: any) {
            logger.error(err, 'ExpireMatches failed');
            callback({
                code: grpc.status.INTERNAL,
                message: err.message
            });
        }
    }
});
