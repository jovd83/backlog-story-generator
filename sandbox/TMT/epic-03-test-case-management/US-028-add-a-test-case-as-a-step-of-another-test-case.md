# User Story: Add a Test Case as a Step of Another Test Case

**Story ID:** US-028
**Epic/Feature:** Test Case Management
**Priority:** High
**Story Points:** 3
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
**I want** to add a test case as a step of another test case
**So that** project work can be maintained consistently inside the managed test repository

---

## Context
This story adds the ability for tester to add a test case as a step of another test case in the Test Case Management epic. Today, the capability is handled through a less direct or less consistent workflow. With this change, tester can add a test case as a step of another test case inside the current project boundary, and project work can be maintained consistently inside the managed test repository. It sits with the other Test Case Management stories that create, update, or maintain core project data and Across the product, it keeps core project records consistent and usable

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-028 (Test Case Management)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Valid project-scoped Add a Test Case as a Step of Another Test Case
**Given** a tester is working in a TMT project with the required a test case as a step of another test case context
**When** they add a test case as a step of another test case using valid project data
**Then** the new or updated a test case as a step of another test case is saved inside the current project

### Scenario 2: Invalid input or insufficient permission
**Given** the a test case as a step of another test case request is missing required data or the user lacks the needed permission
**When** they attempt to add a test case as a step of another test case
**Then** the system blocks the change and explains what must be corrected before the workflow can continue

### Scenario 3: Project state remains traceable
**Given** the a test case as a step of another test case action changes project data or workflow state
**When** the action succeeds
**Then** the resulting state remains visible and traceable in the relevant TMT area

---

## Business Rules
- Test assets must stay project-scoped unless the story explicitly enables cross-project reuse.
- Authoring behavior should preserve traceability and version awareness where applicable.

## Scope Notes
- This story covers artifact creation or maintenance behavior, not downstream reporting.
- UI and API design details can evolve as long as the authoring contract stays clear.

## Dependencies
- Requires project-scoped authorization and persistence support for a test case as a step of another test case.

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

