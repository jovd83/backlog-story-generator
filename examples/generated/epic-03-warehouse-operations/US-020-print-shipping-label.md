# User Story: Print Shipping Label

**Story ID:** US-020
**Epic/Feature:** Warehouse Operations
**Priority:** Critical
**Story Points:** 3
**Status:** Proposed

---

## User Story

**As a** warehouse associate
**I want** to print a shipping label for a packed order
**So that** the package can be handed off for shipment

---

## Context
This story adds the operational ability to print a shipping label for an order. It matters because warehouse fulfillment depends on a reliable way to move packed orders into the shipment process.

---

## Functional / Business References
- examples/input-warehouse-operations.md: source requirement narrative for Print Shipping Label

## Acceptance Criteria

### Scenario 1: Print label for packed order
**Given** an order is ready for shipment at the packing station
**When** the associate requests a shipping label
**Then** the system sends the label to the configured printer and confirms the print action

### Scenario 2: User lacks warehouse permission
**Given** a user without warehouse shipping permission is signed in
**When** they attempt to print a shipping label
**Then** the system blocks the action and explains that they are not authorized

### Scenario 3: Printer unavailable
**Given** the packing station printer is temporarily disconnected
**When** the associate requests a shipping label
**Then** the system shows a recoverable printer error instead of falsely marking the label as printed

---

## Business Rules
- This story covers first-time label printing only.

## Scope Notes
- Reprinting and audit-specific behavior are handled by a separate story.

## Dependencies
- Requires order readiness status and printer integration.

## Non-Functional Notes
- Packing station actions should remain resilient to brief device interruptions.

## Testing Notes
- Validate authorization, successful printing, and printer-unavailable recovery behavior.

## Open Questions
N/A

## Source Traceability
- examples/input-warehouse-operations.md

## Implementation Notes
- Printing requires integration with the physical printer or its service layer.
