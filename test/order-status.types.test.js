"use strict";
/**
 * Order Status Types Unit Tests - Story 3.6
 *
 * Tests for state machine validation and helper functions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const order_status_types_1 = require("../src/types/order-status.types");
describe('OrderTrackingStatus Enum', () => {
    it('should have 7 statuses', () => {
        expect(Object.keys(order_status_types_1.OrderTrackingStatus).length).toBe(7);
    });
    it('should have correct status values', () => {
        expect(order_status_types_1.OrderTrackingStatus.LISTED).toBe('LISTED');
        expect(order_status_types_1.OrderTrackingStatus.MATCHED).toBe('MATCHED');
        expect(order_status_types_1.OrderTrackingStatus.PICKUP_SCHEDULED).toBe('PICKUP_SCHEDULED');
        expect(order_status_types_1.OrderTrackingStatus.AT_DROP_POINT).toBe('AT_DROP_POINT');
        expect(order_status_types_1.OrderTrackingStatus.IN_TRANSIT).toBe('IN_TRANSIT');
        expect(order_status_types_1.OrderTrackingStatus.DELIVERED).toBe('DELIVERED');
        expect(order_status_types_1.OrderTrackingStatus.PAID).toBe('PAID');
    });
});
describe('STATUS_STEP_MAP', () => {
    it('should map each status to correct step number (1-7)', () => {
        expect(order_status_types_1.STATUS_STEP_MAP[order_status_types_1.OrderTrackingStatus.LISTED]).toBe(1);
        expect(order_status_types_1.STATUS_STEP_MAP[order_status_types_1.OrderTrackingStatus.MATCHED]).toBe(2);
        expect(order_status_types_1.STATUS_STEP_MAP[order_status_types_1.OrderTrackingStatus.PICKUP_SCHEDULED]).toBe(3);
        expect(order_status_types_1.STATUS_STEP_MAP[order_status_types_1.OrderTrackingStatus.AT_DROP_POINT]).toBe(4);
        expect(order_status_types_1.STATUS_STEP_MAP[order_status_types_1.OrderTrackingStatus.IN_TRANSIT]).toBe(5);
        expect(order_status_types_1.STATUS_STEP_MAP[order_status_types_1.OrderTrackingStatus.DELIVERED]).toBe(6);
        expect(order_status_types_1.STATUS_STEP_MAP[order_status_types_1.OrderTrackingStatus.PAID]).toBe(7);
    });
});
describe('isValidTransition', () => {
    it('should allow forward transitions', () => {
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.LISTED, order_status_types_1.OrderTrackingStatus.MATCHED)).toBe(true);
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.MATCHED, order_status_types_1.OrderTrackingStatus.PICKUP_SCHEDULED)).toBe(true);
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.PICKUP_SCHEDULED, order_status_types_1.OrderTrackingStatus.AT_DROP_POINT)).toBe(true);
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.AT_DROP_POINT, order_status_types_1.OrderTrackingStatus.IN_TRANSIT)).toBe(true);
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.IN_TRANSIT, order_status_types_1.OrderTrackingStatus.DELIVERED)).toBe(true);
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.DELIVERED, order_status_types_1.OrderTrackingStatus.PAID)).toBe(true);
    });
    it('should reject backward transitions', () => {
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.MATCHED, order_status_types_1.OrderTrackingStatus.LISTED)).toBe(false);
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.PAID, order_status_types_1.OrderTrackingStatus.DELIVERED)).toBe(false);
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.IN_TRANSIT, order_status_types_1.OrderTrackingStatus.MATCHED)).toBe(false);
    });
    it('should reject skipping steps', () => {
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.LISTED, order_status_types_1.OrderTrackingStatus.IN_TRANSIT)).toBe(false);
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.MATCHED, order_status_types_1.OrderTrackingStatus.DELIVERED)).toBe(false);
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.LISTED, order_status_types_1.OrderTrackingStatus.PAID)).toBe(false);
    });
    it('should reject same status transition', () => {
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.LISTED, order_status_types_1.OrderTrackingStatus.LISTED)).toBe(false);
        expect((0, order_status_types_1.isValidTransition)(order_status_types_1.OrderTrackingStatus.PAID, order_status_types_1.OrderTrackingStatus.PAID)).toBe(false);
    });
    it('should reject transitions from terminal state PAID', () => {
        expect(order_status_types_1.VALID_TRANSITIONS[order_status_types_1.OrderTrackingStatus.PAID].length).toBe(0);
    });
});
describe('getStatusStep', () => {
    it('should return correct step number for each status', () => {
        expect((0, order_status_types_1.getStatusStep)(order_status_types_1.OrderTrackingStatus.LISTED)).toBe(1);
        expect((0, order_status_types_1.getStatusStep)(order_status_types_1.OrderTrackingStatus.PAID)).toBe(7);
    });
});
describe('isActiveOrder', () => {
    it('should return true for non-PAID statuses', () => {
        expect((0, order_status_types_1.isActiveOrder)(order_status_types_1.OrderTrackingStatus.LISTED)).toBe(true);
        expect((0, order_status_types_1.isActiveOrder)(order_status_types_1.OrderTrackingStatus.MATCHED)).toBe(true);
        expect((0, order_status_types_1.isActiveOrder)(order_status_types_1.OrderTrackingStatus.IN_TRANSIT)).toBe(true);
        expect((0, order_status_types_1.isActiveOrder)(order_status_types_1.OrderTrackingStatus.DELIVERED)).toBe(true);
    });
    it('should return false for PAID status', () => {
        expect((0, order_status_types_1.isActiveOrder)(order_status_types_1.OrderTrackingStatus.PAID)).toBe(false);
    });
});
describe('generateTimeline', () => {
    it('should generate 7 timeline events', () => {
        const timeline = (0, order_status_types_1.generateTimeline)(order_status_types_1.OrderTrackingStatus.LISTED);
        expect(timeline.length).toBe(7);
    });
    it('should mark current status as active', () => {
        const timeline = (0, order_status_types_1.generateTimeline)(order_status_types_1.OrderTrackingStatus.MATCHED);
        const activeEvent = timeline.find(e => e.active);
        expect(activeEvent?.status).toBe(order_status_types_1.OrderTrackingStatus.MATCHED);
    });
    it('should mark previous statuses as completed', () => {
        const timeline = (0, order_status_types_1.generateTimeline)(order_status_types_1.OrderTrackingStatus.IN_TRANSIT);
        const completedEvents = timeline.filter(e => e.completed);
        expect(completedEvents.length).toBe(4); // LISTED, MATCHED, PICKUP_SCHEDULED, AT_DROP_POINT
    });
    it('should have correct step numbers', () => {
        const timeline = (0, order_status_types_1.generateTimeline)(order_status_types_1.OrderTrackingStatus.LISTED);
        expect(timeline[0].step).toBe(1);
        expect(timeline[6].step).toBe(7);
    });
});
describe('formatStatusLabel', () => {
    it('should format status to human-readable label', () => {
        expect((0, order_status_types_1.formatStatusLabel)(order_status_types_1.OrderTrackingStatus.LISTED)).toBe('Listed');
        expect((0, order_status_types_1.formatStatusLabel)(order_status_types_1.OrderTrackingStatus.PICKUP_SCHEDULED)).toBe('Pickup Scheduled');
        expect((0, order_status_types_1.formatStatusLabel)(order_status_types_1.OrderTrackingStatus.AT_DROP_POINT)).toBe('At Drop Point');
        expect((0, order_status_types_1.formatStatusLabel)(order_status_types_1.OrderTrackingStatus.IN_TRANSIT)).toBe('In Transit');
        expect((0, order_status_types_1.formatStatusLabel)(order_status_types_1.OrderTrackingStatus.PAID)).toBe('Payment Received');
    });
});
