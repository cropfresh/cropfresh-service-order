/**
 * Order Status Types Unit Tests - Story 3.6
 * 
 * Tests for state machine validation and helper functions.
 */

import {
    OrderTrackingStatus,
    STATUS_STEP_MAP,
    VALID_TRANSITIONS,
    isValidTransition,
    getStatusStep,
    isActiveOrder,
    generateTimeline,
    formatStatusLabel
} from '../src/types/order-status.types';

describe('OrderTrackingStatus Enum', () => {
    it('should have 7 statuses', () => {
        expect(Object.keys(OrderTrackingStatus).length).toBe(7);
    });

    it('should have correct status values', () => {
        expect(OrderTrackingStatus.LISTED).toBe('LISTED');
        expect(OrderTrackingStatus.MATCHED).toBe('MATCHED');
        expect(OrderTrackingStatus.PICKUP_SCHEDULED).toBe('PICKUP_SCHEDULED');
        expect(OrderTrackingStatus.AT_DROP_POINT).toBe('AT_DROP_POINT');
        expect(OrderTrackingStatus.IN_TRANSIT).toBe('IN_TRANSIT');
        expect(OrderTrackingStatus.DELIVERED).toBe('DELIVERED');
        expect(OrderTrackingStatus.PAID).toBe('PAID');
    });
});

describe('STATUS_STEP_MAP', () => {
    it('should map each status to correct step number (1-7)', () => {
        expect(STATUS_STEP_MAP[OrderTrackingStatus.LISTED]).toBe(1);
        expect(STATUS_STEP_MAP[OrderTrackingStatus.MATCHED]).toBe(2);
        expect(STATUS_STEP_MAP[OrderTrackingStatus.PICKUP_SCHEDULED]).toBe(3);
        expect(STATUS_STEP_MAP[OrderTrackingStatus.AT_DROP_POINT]).toBe(4);
        expect(STATUS_STEP_MAP[OrderTrackingStatus.IN_TRANSIT]).toBe(5);
        expect(STATUS_STEP_MAP[OrderTrackingStatus.DELIVERED]).toBe(6);
        expect(STATUS_STEP_MAP[OrderTrackingStatus.PAID]).toBe(7);
    });
});

describe('isValidTransition', () => {
    it('should allow forward transitions', () => {
        expect(isValidTransition(OrderTrackingStatus.LISTED, OrderTrackingStatus.MATCHED)).toBe(true);
        expect(isValidTransition(OrderTrackingStatus.MATCHED, OrderTrackingStatus.PICKUP_SCHEDULED)).toBe(true);
        expect(isValidTransition(OrderTrackingStatus.PICKUP_SCHEDULED, OrderTrackingStatus.AT_DROP_POINT)).toBe(true);
        expect(isValidTransition(OrderTrackingStatus.AT_DROP_POINT, OrderTrackingStatus.IN_TRANSIT)).toBe(true);
        expect(isValidTransition(OrderTrackingStatus.IN_TRANSIT, OrderTrackingStatus.DELIVERED)).toBe(true);
        expect(isValidTransition(OrderTrackingStatus.DELIVERED, OrderTrackingStatus.PAID)).toBe(true);
    });

    it('should reject backward transitions', () => {
        expect(isValidTransition(OrderTrackingStatus.MATCHED, OrderTrackingStatus.LISTED)).toBe(false);
        expect(isValidTransition(OrderTrackingStatus.PAID, OrderTrackingStatus.DELIVERED)).toBe(false);
        expect(isValidTransition(OrderTrackingStatus.IN_TRANSIT, OrderTrackingStatus.MATCHED)).toBe(false);
    });

    it('should reject skipping steps', () => {
        expect(isValidTransition(OrderTrackingStatus.LISTED, OrderTrackingStatus.IN_TRANSIT)).toBe(false);
        expect(isValidTransition(OrderTrackingStatus.MATCHED, OrderTrackingStatus.DELIVERED)).toBe(false);
        expect(isValidTransition(OrderTrackingStatus.LISTED, OrderTrackingStatus.PAID)).toBe(false);
    });

    it('should reject same status transition', () => {
        expect(isValidTransition(OrderTrackingStatus.LISTED, OrderTrackingStatus.LISTED)).toBe(false);
        expect(isValidTransition(OrderTrackingStatus.PAID, OrderTrackingStatus.PAID)).toBe(false);
    });

    it('should reject transitions from terminal state PAID', () => {
        expect(VALID_TRANSITIONS[OrderTrackingStatus.PAID].length).toBe(0);
    });
});

describe('getStatusStep', () => {
    it('should return correct step number for each status', () => {
        expect(getStatusStep(OrderTrackingStatus.LISTED)).toBe(1);
        expect(getStatusStep(OrderTrackingStatus.PAID)).toBe(7);
    });
});

describe('isActiveOrder', () => {
    it('should return true for non-PAID statuses', () => {
        expect(isActiveOrder(OrderTrackingStatus.LISTED)).toBe(true);
        expect(isActiveOrder(OrderTrackingStatus.MATCHED)).toBe(true);
        expect(isActiveOrder(OrderTrackingStatus.IN_TRANSIT)).toBe(true);
        expect(isActiveOrder(OrderTrackingStatus.DELIVERED)).toBe(true);
    });

    it('should return false for PAID status', () => {
        expect(isActiveOrder(OrderTrackingStatus.PAID)).toBe(false);
    });
});

describe('generateTimeline', () => {
    it('should generate 7 timeline events', () => {
        const timeline = generateTimeline(OrderTrackingStatus.LISTED);
        expect(timeline.length).toBe(7);
    });

    it('should mark current status as active', () => {
        const timeline = generateTimeline(OrderTrackingStatus.MATCHED);
        const activeEvent = timeline.find(e => e.active);
        expect(activeEvent?.status).toBe(OrderTrackingStatus.MATCHED);
    });

    it('should mark previous statuses as completed', () => {
        const timeline = generateTimeline(OrderTrackingStatus.IN_TRANSIT);
        const completedEvents = timeline.filter(e => e.completed);
        expect(completedEvents.length).toBe(4); // LISTED, MATCHED, PICKUP_SCHEDULED, AT_DROP_POINT
    });

    it('should have correct step numbers', () => {
        const timeline = generateTimeline(OrderTrackingStatus.LISTED);
        expect(timeline[0].step).toBe(1);
        expect(timeline[6].step).toBe(7);
    });
});

describe('formatStatusLabel', () => {
    it('should format status to human-readable label', () => {
        expect(formatStatusLabel(OrderTrackingStatus.LISTED)).toBe('Listed');
        expect(formatStatusLabel(OrderTrackingStatus.PICKUP_SCHEDULED)).toBe('Pickup Scheduled');
        expect(formatStatusLabel(OrderTrackingStatus.AT_DROP_POINT)).toBe('At Drop Point');
        expect(formatStatusLabel(OrderTrackingStatus.IN_TRANSIT)).toBe('In Transit');
        expect(formatStatusLabel(OrderTrackingStatus.PAID)).toBe('Payment Received');
    });
});
