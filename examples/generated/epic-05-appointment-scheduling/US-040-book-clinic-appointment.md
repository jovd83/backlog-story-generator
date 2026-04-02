# User Story: Book Clinic Appointment

**Story ID:** US-040
**Epic/Feature:** Appointment Scheduling
**Priority:** High
**Story Points:** 5
**Status:** Proposed

---

## User Story

**As a** patient
**I want** to book an appointment from an available clinic slot
**So that** I can secure care at a suitable time and location

---

## Context
This story adds the booking flow for a clinic appointment. It matters because patients and staff need a reliable way to reserve an available slot without manual coordination.

---

## Functional / Business References
- examples/input-healthcare-appointment-scheduling.md: source requirement narrative for Book Clinic Appointment

## Acceptance Criteria

### Scenario 1: Book an available slot
**Given** a patient is viewing available slots for a specialty and location
**When** they select an available slot and confirm the booking
**Then** the appointment is created and the slot is no longer available to other users

### Scenario 2: Prevent double-booking
**Given** two users attempt to book the same slot at nearly the same time
**When** one booking is completed first
**Then** the second user is informed that the slot is no longer available

### Scenario 3: No matching slots
**Given** no open slots match the selected specialty and location
**When** the patient searches for appointments
**Then** the system shows a clear empty state instead of creating a placeholder booking

---

## Business Rules
- A time slot can only be confirmed for one appointment at a time.

## Scope Notes
- This story covers slot selection and appointment booking, not reminders or rescheduling.

## Dependencies
- Requires slot availability data by specialty and location.

## Non-Functional Notes
- Availability updates should be timely enough to reduce booking conflicts during active scheduling.

## Testing Notes
- Validate successful booking, race-condition handling, and no-availability behavior.

## Open Questions
- Confirm whether patients can book on behalf of dependents in the initial release.

## Source Traceability
- examples/input-healthcare-appointment-scheduling.md

## Implementation Notes
N/A
