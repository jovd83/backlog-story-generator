# User Story: Store templates for my custom reports

**Story ID:** US-137
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
**I want** to store templates for my custom reports
**So that** stakeholders can understand quality status without assembling data manually

---

## Context
Store templates for my custom reports exists so stakeholders can understand quality status without assembling data manually. It belongs to the Custom Reporting backlog and should keep project scope, traceability, and operability clear while TMT grows.

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-137 (Custom Reporting)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Complete Store templates for my custom reports
**Given** a test lead is working inside the correct TMT project and is ready to store templates for my custom reports
**When** they store templates for my custom reports
**Then** the requested report, dashboard, query, or collaboration view reflects the selected scope clearly enough to act on

### Scenario 2: Block invalid or unauthorized changes
**Given** required input, mappings, or permissions for store templates for my custom reports are missing
**When** the test lead tries to store templates for my custom reports
**Then** TMT prevents the change and explains what must be corrected before work can continue

### Scenario 3: Filters and scope are respected
**Given** the user narrows the workflow to a specific project, cycle, period, or filter set
**When** they open the resulting view or output
**Then** the result reflects that selected scope instead of mixing unrelated data

---

## Business Rules
- Reporting and collaboration outputs should remain scoped and reviewable instead of opaque aggregates.
- Shared views must still respect project boundaries and audience permissions.

## Scope Notes
- This story focuses on visibility, reporting, search, or collaboration behavior.
- Raw execution ingestion and deeper metric design can be decomposed later when needed.

## Dependencies
- Stable execution, repository, and identity data to power the selected view or notification.

## Non-Functional Notes
- TMT implementation should stay compatible with the source stack direction: Java Spring Boot backend and Angular frontend.
- Project boundaries, authorization, and auditability should remain intact for this workflow.

## UX
- Make filters, current scope, and the meaning of the shown output obvious to the intended audience.

## Testing Notes
- Cover scoped output accuracy plus no-data, invalid-filter, or permission edge cases.
- Add UI coverage when the story changes dashboards, query results, or collaboration flows.

## Open Questions
N/A

## Source Traceability
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md

## Implementation Notes
N/A
