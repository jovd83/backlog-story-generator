# User Story: Assign Technician By Territory and Skill

**Story ID:** US-050
**Epic/Feature:** Field Service Dispatch
**Priority:** High
**Story Points:** 5
**Status:** Proposed

---

## User Story

**As a** dispatch coordinator
**I want** to assign a technician based on territory and skill match
**So that** service jobs are routed to the most appropriate available technician

---

## Acceptance Criteria

### Scenario 1: Assign qualified technician
**Given** a new service job is ready for dispatch
**When** the coordinator selects a technician whose skills and territory match the job
**Then** the job is assigned to that technician

### Scenario 2: Prevent unsupported territory assignment
**Given** a technician does not support the job territory
**When** the coordinator attempts to assign that technician without an override
**Then** the system blocks the assignment and explains the territory mismatch

### Scenario 3: Show no qualified technician available
**Given** no available technician matches the required territory and skill
**When** the coordinator reviews assignment options
**Then** the system shows that no qualified technician is currently available

---

## Business Rules
- Territory and skill constraints must be checked before standard assignment is allowed.

## Scope Notes
- This story covers manual dispatch assignment logic, not route optimization.

## Dependencies
- Requires technician skill, availability, and territory data.

## Non-Functional Notes
- Assignment decisions should remain understandable to dispatchers during high job volume periods.

## Testing Notes
- Validate successful assignment, blocked mismatch behavior, and no-match visibility.

## Open Questions
- Confirm which users can apply territory overrides.

## Source Traceability
- examples/input-field-service-dispatch.md

## Implementation Notes
N/A
