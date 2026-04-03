# User Story: Assign Test Cases to Cycles

**Story ID:** US-064
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
**I want** to assign test cases to cycles
**So that** related requirements, tests, and execution records stay connected across the project lifecycle

---

## Context
This story adds the ability for tester to assign test cases to cycles in the Test Cycles and Plans epic. Today, the capability is handled through a less direct or less consistent workflow. With this change, tester can assign test cases to cycles inside the current project boundary, and related requirements, tests, and execution records stay connected across the project lifecycle. It sits with the other Test Cycles and Plans stories that connect requirements, tests, and results and Across the product, it keeps traceability intact from requirement to result

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-064 (Test Cycles and Plans)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Valid project-scoped Assign Test Cases to Cycles
**Given** a tester is working in a TMT project with the required test cases to cycles context
**When** they assign test cases to cycles using valid project data
**Then** the new relationship is saved and visible from the affected project records

### Scenario 2: Invalid input or insufficient permission
**Given** the test cases to cycles request is missing required data or the user lacks the needed permission
**When** they attempt to assign test cases to cycles
**Then** the system blocks the change and explains what must be corrected before the workflow can continue

### Scenario 3: Project state remains traceable
**Given** the test cases to cycles action changes project data or workflow state
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
- Requires project-scoped authorization and persistence support for test cases to cycles.

## Non-Functional Notes
- TMT implementation should stay compatible with the source stack direction: Java Spring Boot backend and Angular frontend.
- Project boundaries, authorization, and auditability should remain intact for this workflow.

## UX
- Provide clear validation, success, and failure feedback at the point where the user performs the action.

## Testing Notes
- Cover the primary success path, validation or permission failures, and persistence of the resulting project state.

## Open Questions
N/A

## Source Traceability
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md

## Implementation Notes
N/A

