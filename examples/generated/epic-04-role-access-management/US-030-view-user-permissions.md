# User Story: View User Permissions

**Story ID:** US-030
**Epic/Feature:** Role Access Management
**Priority:** High
**Story Points:** 2
**Status:** Proposed

---

## User Story

**As a** system administrator
**I want** to view the roles assigned to a user account
**So that** I can understand that user's current access before making changes

---

## Context
This story adds a way to inspect the permissions currently assigned to a user. It matters because administrators need visibility before they can safely review or adjust access.

---

## Functional / Business References
- examples/input-role-access-management.md: source requirement narrative for View User Permissions

## Acceptance Criteria

### Scenario 1: View assigned roles
**Given** an administrator opens a user's access details
**When** the page finishes loading
**Then** the system shows the roles currently assigned to that user

### Scenario 2: View audit-relevant context
**Given** an administrator is reviewing a user's access
**When** the role details are displayed
**Then** the system shows enough context to distinguish elevated roles from standard roles

### Scenario 3: User record unavailable
**Given** the requested user record cannot be retrieved
**When** the administrator opens the access details view
**Then** the system shows a clear error state instead of stale access data

---

## Business Rules
- Administrators need clear visibility before changing access.

## Scope Notes
- This story covers view-only permissions context, not role assignment changes.

## Dependencies
- Requires access to the user profile and role-assignment data source.

## Non-Functional Notes
- Permission details should load fast enough to support administrative triage workflows.

## Testing Notes
- Validate role display, elevated-role context, and unavailable-user handling.

## Open Questions
N/A

## Source Traceability
- examples/input-role-access-management.md

## Implementation Notes
- Keep backend and UI naming consistent so role meaning is not lost in translation.
