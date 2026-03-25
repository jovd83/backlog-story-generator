# User Story: Capture Shipping Address

**Story ID:** US-001
**Epic/Feature:** Checkout Experience
**Priority:** High
**Story Points:** 3
**Status:** Proposed

---

## User Story

**As a** shopper
**I want** to enter a shipping address during checkout
**So that** my order can be delivered to the correct destination

---

## Acceptance Criteria

### Scenario 1: Valid address submission
**Given** a shopper is on the shipping step of checkout
**When** they enter a complete valid address and continue
**Then** the address is saved to the checkout session

### Scenario 2: Missing required field
**Given** a shopper is on the shipping step of checkout
**When** they leave a required address field blank and continue
**Then** the form shows a validation error for the missing field

### Scenario 3: Unsupported destination
**Given** a shopper enters a country the business does not ship to
**When** they attempt to continue checkout
**Then** the system blocks progression and explains the shipping restriction

---

## Business Rules
- Destination support is limited to countries the business currently serves.

## Scope Notes
- This story covers shipping-address capture and validation only.
- Payment and order-summary behavior are handled by separate stories.

## Dependencies
- Checkout session state must persist between steps.

## Non-Functional Notes
- Validation feedback should be accessible to keyboard and screen-reader users.

## Testing Notes
- Validate required-field errors, session persistence, and unsupported-country handling.

## Open Questions
N/A

## Source Traceability
- examples/input-checkout-requirements.md

## Implementation Notes
N/A
