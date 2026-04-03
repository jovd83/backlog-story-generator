# User Story: Perform Exploratory Testing From a High Level Test Case

**Story ID:** US-144
**Epic/Feature:** AI Capabilities
**Priority:** Medium
**Story Points:** 8
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
**I want** to perform exploratory testing from a high level test case
**So that** teams can accelerate analysis while keeping answers grounded in project knowledge

---

## Context
This story adds the ability for tester to perform exploratory testing from a high level test case in the AI Capabilities epic. Today, the capability is not yet a dedicated project-scoped workflow. With this change, tester can perform exploratory testing from a high level test case inside the current project boundary, and teams can accelerate analysis while keeping answers grounded in project knowledge. It sits with the other AI Capabilities stories that use project knowledge to accelerate analysis and Across the product, it supports faster analysis while staying grounded in project knowledge

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-144 (AI Capabilities)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Valid project-scoped Perform Exploratory Testing From a High Level Test Case
**Given** a tester is working in a TMT project with the required exploratory testing from a high level test case context
**When** they perform exploratory testing from a high level test case using valid project data
**Then** the response is returned from project-scoped repository knowledge with relevant supporting context

### Scenario 2: Invalid input or insufficient permission
**Given** the exploratory testing from a high level test case request is missing required data or the user lacks the needed permission
**When** they attempt to perform exploratory testing from a high level test case
**Then** the system blocks the change and explains what must be corrected before the workflow can continue

### Scenario 3: Project state remains traceable
**Given** the exploratory testing from a high level test case action changes project data or workflow state
**When** the action succeeds
**Then** the resulting state remains visible and traceable in the relevant TMT area

---

## Business Rules
- AI-assisted behavior must stay reviewable and project-scoped.
- Generated output should support human decision-making rather than silently replace it.

## Scope Notes
- This story covers one AI-assisted outcome at a time and does not assume autonomous project changes.
- Retrieval, prompting, and human review can be decomposed later if implementation needs it.

## Dependencies
- Requires project-scoped repository content and retrieval support for exploratory testing from a high level test case.

## Non-Functional Notes
- TMT implementation should stay compatible with the source stack direction: Java Spring Boot backend and Angular frontend.
- Project boundaries, authorization, and auditability should remain intact for this workflow.

## UX
N/A

## Testing Notes
- Cover grounded responses, missing-source handling, and traceability of generated answers back to project knowledge.

## Open Questions
- Which repository artifacts should be considered authoritative sources for grounded answers in this project?

## Source Traceability
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md

## Implementation Notes
- Keep retrieval and answer-generation components project-scoped so repository content does not leak across projects.

