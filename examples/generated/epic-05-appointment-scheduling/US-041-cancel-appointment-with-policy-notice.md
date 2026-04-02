# User Story: Cancel Appointment With Policy Notice

**Story ID:** US-041
**Epic/Feature:** Appointment Scheduling
**Priority:** Medium
**Story Points:** 3
**Status:** Proposed

---

## User Story

**As a** patient
**I want** to cancel an upcoming appointment after reviewing the clinic policy
**So that** I understand the consequences before confirming the cancellation

---

## Context
This story adds appointment cancellation with explicit policy messaging. It matters because users need to understand the operational and business consequences before completing a cancellation.

---

## Functional / Business References
- examples/input-healthcare-appointment-scheduling.md: source requirement narrative for Cancel Appointment With Policy Notice

## Acceptance Criteria

### Scenario 1: Show policy before cancellation
**Given** a patient chooses to cancel an upcoming appointment
**When** they open the cancellation flow
**Then** the system shows the applicable cancellation policy before confirmation

### Scenario 2: Confirm cancellation
**Given** the patient has reviewed the policy notice
**When** they confirm the cancellation
**Then** the appointment status changes to canceled and the slot becomes available again if clinic rules allow it

### Scenario 3: Keep appointment when user backs out
**Given** a patient opens the cancellation flow
**When** they close the flow without confirming
**Then** the appointment remains scheduled

---

## Business Rules
- Policy messaging must be shown before the cancellation is finalized.

## Scope Notes
- This story covers cancellation notice and confirmation behavior only.

## Dependencies
- Requires an appointment record and clinic policy content.

## Non-Functional Notes
- Policy messaging should be easy to read on both desktop and mobile appointment flows.

## Testing Notes
- Validate policy visibility, confirmed cancellation, and cancellation abandonment behavior.

## Open Questions
- Confirm whether same-day cancellations require different wording.

## Source Traceability
- examples/input-healthcare-appointment-scheduling.md

## Implementation Notes
N/A
