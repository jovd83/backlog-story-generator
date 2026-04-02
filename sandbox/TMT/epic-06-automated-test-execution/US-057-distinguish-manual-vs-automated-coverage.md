# User Story: Distinguish manual vs automated coverage

**Story ID:** US-057
**Epic/Feature:** Automated Test Execution
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
**I want** to distinguish manual vs automated coverage
**So that** release and coverage decisions can rely on current execution evidence

---

## Context
Distinguish manual vs automated coverage exists so release and coverage decisions can rely on current execution evidence. It belongs to the Automated Test Execution backlog and should keep project scope, traceability, and operability clear while TMT grows.

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-057 (Automated Test Execution)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Complete Distinguish manual vs automated coverage
**Given** a tester is working inside the correct TMT project and is ready to distinguish manual vs automated coverage
**When** they distinguish manual vs automated coverage
**Then** the execution, planning, or traceability state is updated on the correct project artifacts and remains visible afterward

### Scenario 2: Block invalid or unauthorized changes
**Given** required input, mappings, or permissions for distinguish manual vs automated coverage are missing
**When** the tester tries to distinguish manual vs automated coverage
**Then** TMT prevents the change and explains what must be corrected before work can continue

### Scenario 3: State stays reviewable
**Given** the story changes data, structure, or workflow state in TMT
**When** the operation completes
**Then** the resulting state can still be reviewed later through normal project views and audit trails

---

## Business Rules
- Execution and traceability data must remain attributable to the correct project, artifact, and run context.
- Latest-result and planning views must not hide the underlying history that explains the state.

## Scope Notes
- This story covers execution, planning, or traceability behavior for TMT testing work.
- Wider analytics and vendor-specific rollout concerns belong in linked epics when needed.

## Dependencies
- Planned test assets, execution state, evidence storage, and traceability identifiers.

## Non-Functional Notes
- TMT implementation should stay compatible with the source stack direction: Java Spring Boot backend and Angular frontend.
- Project boundaries, authorization, and auditability should remain intact for this workflow.

## UX
- Make current status, scope, and next action obvious to the tester or lead using the workflow.

## Testing Notes
- Cover the main workflow plus permission, validation, or missing-scope failures.
- Add end-to-end checks when the story changes a user-facing execution path.

## Open Questions
N/A

## Source Traceability
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md

## Implementation Notes
N/A
