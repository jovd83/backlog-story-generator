# User Story: Notify Customer When Order Ships

**Story ID:** US-101
**Epic/Feature:** Order Follow Up
**Priority:** High
**Story Points:** 3
**Status:** Proposed

---

## User Story

**As a** customer
**I want** to receive a shipment notification when my order leaves the warehouse
**So that** I know the order is on the way

---

## Acceptance Criteria

### Scenario 1: Send shipment notification
**Given** an order status changes to shipped
**When** shipment confirmation is recorded
**Then** the customer receives a shipping notification

### Scenario 2: Missing contact channel
**Given** the customer has no supported notification channel configured
**When** the order is marked as shipped
**Then** the system records that no shipment notification was sent

### Scenario 3: Duplicate shipment event
**Given** a duplicate shipment event arrives for the same order
**When** the system evaluates notification history
**Then** the customer is not sent a second duplicate notification

---

## Business Rules
- Customers should not receive duplicate shipment notifications for the same shipment event.

## Scope Notes
- This story covers shipment notification dispatch, not delivery confirmation.

## Dependencies
- Requires shipment status updates and customer contact preferences.

## Non-Functional Notes
- Notification processing should be reliable enough to avoid missed shipment communication.

## Testing Notes
- Validate successful send, missing-channel handling, and duplicate prevention.

## Open Questions
N/A

## Source Traceability
- tests/fixtures/existing-pack/README.md

## Implementation Notes
N/A
