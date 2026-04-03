# User Story: Choose Between at Least 20 Reports

**Story ID:** US-135
**Epic/Feature:** Custom Reporting
**Priority:** Medium
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

**As a** test lead
**I want** to choose between at least 20 reports
**So that** stakeholders can monitor quality status without relying on manual reporting

---

## Context
This story adds the ability for test lead to choose between at least 20 reports in the Custom Reporting epic. Today, the needed information is still spread across separate records, so teams have to assemble it manually before they can act. With this change, test lead can choose between at least 20 reports inside the current project boundary, and stakeholders can monitor quality status without relying on manual reporting. It sits with the other Custom Reporting stories that turn execution data into visible status and trends and Across the product, it supports decision-making without forcing manual reporting work

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-135 (Custom Reporting)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Valid project-scoped Choose Between at Least 20 Reports
**Given** a test lead is working in a TMT project with the required between at least 20 reports context
**When** they choose between at least 20 reports using valid project data
**Then** the relevant between at least 20 reports is shown for the current project scope

### Scenario 2: Invalid input or insufficient permission
**Given** the between at least 20 reports request is missing required data or the user lacks the needed permission
**When** they attempt to choose between at least 20 reports
**Then** the system blocks the change and explains what must be corrected before the workflow can continue

### Scenario 3: Project state remains traceable
**Given** the between at least 20 reports action changes project data or workflow state
**When** the action succeeds
**Then** the resulting state remains visible and traceable in the relevant TMT area

---

## Business Rules
- Reporting and collaboration outputs should remain scoped and reviewable instead of opaque aggregates.
- Shared views must still respect project boundaries and audience permissions.

## Scope Notes
- This story focuses on visibility, reporting, search, or collaboration behavior.
- Raw execution ingestion and deeper metric design can be decomposed later when needed.

## Dependencies
- Requires project-scoped retrieval of the data needed to support between at least 20 reports.

## Non-Functional Notes
- TMT implementation should stay compatible with the source stack direction: Java Spring Boot backend and Angular frontend.
- Project boundaries, authorization, and auditability should remain intact for this workflow.

## UX
- Make scoped data easy to scan and filter without forcing the user into multiple navigation steps.

## Testing Notes
- Cover scoped retrieval, empty-state behavior, and permission-limited visibility for the displayed data.

## Open Questions
N/A

## Source Traceability
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md

## Implementation Notes
N/A

