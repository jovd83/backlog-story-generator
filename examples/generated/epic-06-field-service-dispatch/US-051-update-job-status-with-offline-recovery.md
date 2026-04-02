# User Story: Update Job Status With Offline Recovery

**Story ID:** US-051
**Epic/Feature:** Field Service Dispatch
**Priority:** High
**Story Points:** 5
**Status:** Proposed

---

## User Story

**As a** field technician
**I want** to update my job status even when connectivity is unstable
**So that** dispatch and customer support can receive the latest service progress when the device reconnects

---

## Context
This story adds job-status updates that can recover from offline conditions. It matters because field technicians cannot rely on uninterrupted connectivity while still needing accurate work-state tracking.

---

## Functional / Business References
- examples/input-field-service-dispatch.md: source requirement narrative for Update Job Status With Offline Recovery

## Acceptance Criteria

### Scenario 1: Update status while connected
**Given** a technician is viewing an assigned job with network connectivity
**When** they change the status to en route, on site, or completed
**Then** the updated status is saved and visible to dispatch

### Scenario 2: Queue status while offline
**Given** a technician loses connectivity during a service visit
**When** they update the job status
**Then** the device keeps the update locally and marks it for later synchronization

### Scenario 3: Sync queued status after reconnect
**Given** one or more job status updates were queued offline
**When** the device reconnects successfully
**Then** the queued updates are synchronized and become visible to dispatch and customer support

---

## Business Rules
- Job progress updates must preserve technician intent even when connectivity is intermittent.

## Scope Notes
- This story covers status update capture and recovery behavior, not full offline job editing.

## Dependencies
- Requires mobile technician job access and status synchronization support.

## Non-Functional Notes
- Offline recovery should minimize technician confusion about whether an update is pending or sent.

## Testing Notes
- Validate online updates, offline queuing, and synchronization after reconnect.

## Open Questions
- Confirm whether timestamp conflict rules are needed when multiple updates are queued.

## Source Traceability
- examples/input-field-service-dispatch.md

## Implementation Notes
N/A
