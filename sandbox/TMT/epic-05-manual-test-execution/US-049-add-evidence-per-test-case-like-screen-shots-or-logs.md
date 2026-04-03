# User Story: Add Evidence Per Test Case Like Screen Shots or Logs

**Story ID:** US-049
**Epic/Feature:** Manual Test Execution
**Priority:** High
**Story Points:** 5
**Status:** Proposed

**Detailed Progress:**
- [ ] Functional / Business Analysis
- [ ] UX / UI Design
- [ ] Architectural Work
- [ ] Backend Development
- [ ] Frontend Development
- [ ] Plugin / Integration Development (N/A)
- [ ] Unit Testing
- [ ] Service Testing / E2E Testing
- [ ] Frontend Testing
- [ ] Technical Review
- [ ] Technical Refactoring
- [ ] Functional Review
- [ ] Product Owner Review
- [ ] Documentation

---

## User Story

**As a** tester
**I want** to add evidence per test case like screen shots or logs
**So that** project work can be maintained consistently inside the managed test repository

---

## Context
This story adds the ability for tester to add evidence per test case like screen shots or logs in the Manual Test Execution epic. Today, the capability is handled through a less direct or less consistent workflow. With this change, tester can add evidence per test case like screen shots or logs inside the current project boundary, and project work can be maintained consistently inside the managed test repository. It sits with the other Manual Test Execution stories that create, update, or maintain core project data and Across the product, it keeps core project records consistent and usable

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-049 (Manual Test Execution)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Valid project-scoped Add Evidence Per Test Case Like Screen Shots or Logs
**Given** a tester is working in a TMT project with the required evidence per test case like screen shots or logs context
**When** they add evidence per test case like screen shots or logs using valid project data
**Then** the new or updated evidence per test case like screen shots or logs is saved inside the current project

### Scenario 2: Invalid input or insufficient permission
**Given** the evidence per test case like screen shots or logs request is missing required data or the user lacks the needed permission
**When** they attempt to add evidence per test case like screen shots or logs
**Then** the system blocks the change and explains what must be corrected before the workflow can continue

### Scenario 3: Traceability and audit evidence
**Given** the evidence per test case like screen shots or logs activity affects stored project records
**When** the evidence per test case like screen shots or logs action completes
**Then** the resulting change remains traceable with the affected records and timestamps

---

## Business Rules
- Execution and traceability data must remain attributable to the correct project, artifact, and run context.
- Latest-result and planning views must not hide the underlying history that explains the state.

## Scope Notes
- This story covers execution, planning, or traceability behavior for TMT testing work.
- Wider analytics and vendor-specific rollout concerns belong in linked epics when needed.

## Dependencies
- Requires project-scoped authorization and persistence support for evidence per test case like screen shots or logs.

## Non-Functional Notes
- TMT implementation should stay compatible with the source stack direction: Java Spring Boot backend and Angular frontend.
- Project boundaries, authorization, and auditability should remain intact for this workflow.

## UX
N/A

## Testing Notes
- Cover the primary success path, validation or permission failures, and persistence of the resulting project state.

## Open Questions
N/A

## Source Traceability
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md

## Implementation Notes
N/A

