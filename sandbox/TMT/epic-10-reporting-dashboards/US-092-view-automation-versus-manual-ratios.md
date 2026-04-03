# User Story: View Automation Versus Manual Ratios

**Story ID:** US-092
**Epic/Feature:** Reporting Dashboards
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
**I want** to view automation versus manual ratios
**So that** teams can inspect the right project information without rebuilding it manually

---

## Context
This story adds the ability for test lead to view automation versus manual ratios in the Reporting Dashboards epic. Today, the relevant information is not yet exposed as a dedicated project view. With this change, test lead can view automation versus manual ratios inside the current project boundary, and teams can inspect the right project information without rebuilding it manually. It sits with the other Reporting Dashboards stories that surface, filter, or inspect project information and Across the product, it improves findability and trust in project information

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-092 (Reporting Dashboards)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Valid project-scoped View Automation Versus Manual Ratios
**Given** a test lead is working in a TMT project with the required automation versus manual ratios context
**When** they view automation versus manual ratios using valid project data
**Then** the relevant automation versus manual ratios is shown for the current project scope

### Scenario 2: Invalid input or insufficient permission
**Given** the automation versus manual ratios request is missing required data or the user lacks the needed permission
**When** they attempt to view automation versus manual ratios
**Then** the system blocks the change and explains what must be corrected before the workflow can continue

### Scenario 3: Project state remains traceable
**Given** the automation versus manual ratios action changes project data or workflow state
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
- Requires project-scoped retrieval of the data needed to support automation versus manual ratios.

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

