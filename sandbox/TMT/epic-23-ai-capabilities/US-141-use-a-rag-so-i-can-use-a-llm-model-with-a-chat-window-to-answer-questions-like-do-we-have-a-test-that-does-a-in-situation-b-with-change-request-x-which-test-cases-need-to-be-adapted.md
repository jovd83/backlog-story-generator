# User Story: Use a RAG So I Can Use a LLM Model with a Chat Window to Answer Questions Like Do We Have a Test That Does a in Situation B with Change Request X Which Test Cases Need to Be Adapted

**Story ID:** US-141
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
**I want** to use a RAG so i can use a LLM model with a chat window to answer questions like do we have a test that does a in situation b with change request x which test cases need to be adapted
**So that** teams can answer repository questions faster without manually searching across project artifacts

---

## Context
This story adds the ability for tester to use a RAG so i can use a LLM model with a chat window to answer questions like do we have a test that does a in situation b with change request x which test cases need to be adapted in the AI Capabilities epic. Today, the capability is not yet a dedicated project-scoped workflow. With this change, tester can use a RAG so i can use a LLM model with a chat window to answer questions like do we have a test that does a in situation b with change request x which test cases need to be adapted inside the current project boundary, and teams can answer repository questions faster without manually searching across project artifacts. It sits with the other AI Capabilities stories that use project knowledge to accelerate analysis and Across the product, it supports faster analysis while staying grounded in project knowledge

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-141 (AI Capabilities)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Valid project-scoped Use a RAG So I Can Use a LLM Model with a Chat Window to Answer Questions Like Do We Have a Test That Does a in Situation B with Change Request X Which Test Cases Need to Be Adapted
**Given** a tester is working in a TMT project with the required repository-grounded AI answers context
**When** they use a RAG so i can use a LLM model with a chat window to answer questions like do we have a test that does a in situation b with change request x which test cases need to be adapted using valid project data
**Then** the response is returned from project-scoped repository knowledge with relevant supporting context

### Scenario 2: Invalid input or insufficient permission
**Given** the repository-grounded AI answers request is missing required data or the user lacks the needed permission
**When** they attempt to use a RAG so i can use a LLM model with a chat window to answer questions like do we have a test that does a in situation b with change request x which test cases need to be adapted
**Then** the system blocks the change and explains what must be corrected before the workflow can continue

### Scenario 3: Responses stay grounded in project knowledge
**Given** the project contains indexed repository artifacts relevant to the question
**When** the user requests an answer or generated output from the AI capability
**Then** the response stays grounded in project-scoped source material instead of unsupported invention

---

## Business Rules
- AI-assisted behavior must stay reviewable and project-scoped.
- Generated output should support human decision-making rather than silently replace it.

## Scope Notes
- This story covers one AI-assisted outcome at a time and does not assume autonomous project changes.
- Retrieval, prompting, and human review can be decomposed later if implementation needs it.

## Dependencies
- Requires project-scoped repository content, indexing, and retrieval support for grounded AI responses.

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

