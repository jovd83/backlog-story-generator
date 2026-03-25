# User Story: Let Customer Track Shipment Status

**Story ID:** US-102
**Epic/Feature:** Order Follow Up
**Priority:** Medium
**Story Points:** 5
**Status:** Proposed

---

## User Story

**As a** customer
**I want** to view the current shipment status for my order
**So that** I can understand where the delivery stands without contacting support

---

## Acceptance Criteria

### Scenario 1: View current shipment status
**Given** a shipped order has tracking progress available
**When** the customer opens the tracking view
**Then** the latest shipment status is displayed

### Scenario 2: Tracking data unavailable
**Given** tracking data has not yet been received from the carrier
**When** the customer opens the tracking view
**Then** the system shows that tracking updates are not yet available

### Scenario 3: Invalid order access
**Given** a user tries to view tracking for an order they cannot access
**When** they open the tracking page
**Then** the system blocks access to the shipment details

---

## Business Rules
- Tracking visibility must respect order-access permissions.

## Scope Notes
- This story covers customer-visible tracking state, not carrier troubleshooting workflows.

## Dependencies
- Requires shipment tracking updates and authenticated order access.

## Non-Functional Notes
- Tracking information should remain readable on customer self-service pages.

## Testing Notes
- Validate tracking display, no-data behavior, and unauthorized access handling.

## Open Questions
N/A

## Source Traceability
- tests/fixtures/existing-pack/README.md

## Implementation Notes
N/A
