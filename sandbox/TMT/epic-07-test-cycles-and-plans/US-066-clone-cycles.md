# User Story: Clone Cycles

**Story ID:** US-066
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
**I want** to clone cycles
**So that** teams can reuse proven setup faster instead of recreating the same assets from scratch

---

## Context
This story adds the ability for tester to clone cycles in the Test Cycles and Plans epic. Today, users still need to rebuild or duplicate this work by hand. With this change, tester can clone cycles inside the current project boundary, and teams can reuse proven setup faster instead of recreating the same assets from scratch. It sits with the other Test Cycles and Plans stories that let teams duplicate or reuse existing work and Across the product, it reduces duplicate effort and keeps setup consistent

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-066 (Test Cycles and Plans)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Valid project-scoped Clone Cycles
**Given** a tester is working in a TMT project with the required cycles context
**When** they clone cycles using valid project data
**Then** the duplicated or reusable cycles is created from the selected source

### Scenario 2: Invalid input or insufficient permission
**Given** the cycles request is missing required data or the user lacks the needed permission
**When** they attempt to clone cycles
**Then** the system blocks the change and explains what must be corrected before the workflow can continue

### Scenario 3: Project state remains traceable
**Given** the cycles action changes project data or workflow state
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
- Requires project-scoped authorization and persistence support for cycles.

## Non-Functional Notes
- TMT implementation should stay compatible with the source stack direction: Java Spring Boot backend and Angular frontend.
- Project boundaries, authorization, and auditability should remain intact for this workflow.

## UX
N/A

## Testing Notes
N/A

## Open Questions
N/A

## Source Traceability
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md

## Implementation Notes
N/A

