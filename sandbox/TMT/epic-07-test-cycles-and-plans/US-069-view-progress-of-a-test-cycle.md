# User Story: View Progress of a Test Cycle

**Story ID:** US-069
**Epic/Feature:** Test Cycles and Plans
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
**I want** to view progress of a test cycle
**So that** teams can inspect the right project information without rebuilding it manually

---

## Context
This story adds the ability for tester to view progress of a test cycle in the Test Cycles and Plans epic. Today, the relevant information is not yet exposed as a dedicated project view. With this change, tester can view progress of a test cycle inside the current project boundary, and teams can inspect the right project information without rebuilding it manually. It sits with the other Test Cycles and Plans stories that surface, filter, or inspect project information and Across the product, it improves findability and trust in project information

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-069 (Test Cycles and Plans)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Valid project-scoped View Progress of a Test Cycle
**Given** a tester is working in a TMT project with the required progress of a test cycle context
**When** they view progress of a test cycle using valid project data
**Then** the relevant progress of a test cycle is shown for the current project scope

### Scenario 2: Invalid input or insufficient permission
**Given** the progress of a test cycle request is missing required data or the user lacks the needed permission
**When** they attempt to view progress of a test cycle
**Then** the system blocks the change and explains what must be corrected before the workflow can continue

### Scenario 3: Project state remains traceable
**Given** the progress of a test cycle action changes project data or workflow state
**When** the action succeeds
**Then** the resulting state remains visible and traceable in the relevant TMT area

---

## Business Rules
- Execution and traceability data must remain attributable to the correct project, artifact, and run context.
- Latest-result and planning views must not hide the underlying history that explains the state.

## Scope Notes
- This story covers execution, planning, or traceability behavior for TMT testing work.
- Wider analytics and vendor-specific rollout concerns belong in linked epics when needed.

## Dependencies
- Requires project-scoped retrieval of the data needed to support progress of a test cycle.

## Non-Functional Notes
- TMT implementation should stay compatible with the source stack direction: Java Spring Boot backend and Angular frontend.
- Project boundaries, authorization, and auditability should remain intact for this workflow.

## UX
- Keep the result view readable so users can confirm scope and outcome without extra interpretation work.

## Testing Notes
- Cover scoped retrieval, empty-state behavior, and permission-limited visibility for the displayed data.

## Open Questions
N/A

## Source Traceability
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md

## Implementation Notes
N/A

