# User Story: Use a RAG so I can use a LLM-model with a chat-window to answer questions like Do we have a test that does A in situation B With change request X which test cases need to be adapted

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
**I want** to use a RAG so I can use a LLM-model with a chat-window to answer questions like Do we have a test that does A in situation B With change request X which test cases need to be adapted
**So that** teams can move faster while still grounding decisions in project evidence

---

## Context
Use a RAG so I can use a LLM-model with a chat-window to answer questions like Do we have a test that does A in situation B With change request X which test cases need to be adapted exists so teams can move faster while still grounding decisions in project evidence. It belongs to the AI Capabilities backlog and should keep project scope, traceability, and operability clear while TMT grows.

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-141 (AI Capabilities)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Complete Use a RAG so I can use a LLM-model with a chat-window to answer questions like Do we have a test that does A in situation B With change request X which test cases need to be adapted
**Given** a tester is working inside the correct TMT project and is ready to use a RAG so I can use a LLM-model with a chat-window to answer questions like Do we have a test that does A in situation B With change request X which test cases need to be adapted
**When** they use a RAG so I can use a LLM-model with a chat-window to answer questions like Do we have a test that does A in situation B With change request X which test cases need to be adapted
**Then** the AI-assisted output is returned from project-scoped source material and can be reviewed by the team before action is taken

### Scenario 2: Block invalid or unauthorized changes
**Given** required input, mappings, or permissions for use a RAG so I can use a LLM-model with a chat-window to answer questions like Do we have a test that does A in situation B With change request X which test cases need to be adapted are missing
**When** the tester tries to use a RAG so I can use a LLM-model with a chat-window to answer questions like Do we have a test that does A in situation B With change request X which test cases need to be adapted
**Then** TMT prevents the change and explains what must be corrected before work can continue

### Scenario 3: Outputs stay grounded
**Given** the project contains the source material needed for the AI-assisted workflow
**When** the user requests an answer or generated artifact
**Then** the result stays tied to project-scoped source content rather than unsupported invention

---

## Business Rules
- AI-assisted behavior must stay reviewable and project-scoped.
- Generated output should support human decision-making rather than silently replace it.

## Scope Notes
- This story covers one AI-assisted outcome at a time and does not assume autonomous project changes.
- Retrieval, prompting, and human review can be decomposed later if implementation needs it.

## Dependencies
- Project-scoped source content, retrieval/indexing support, and permission-aware access to AI features.

## Non-Functional Notes
- TMT implementation should stay compatible with the source stack direction: Java Spring Boot backend and Angular frontend.
- Project boundaries, authorization, and auditability should remain intact for this workflow.

## UX
- Clearly separate user input, supporting source context, and generated output so trust can be evaluated.

## Testing Notes
- Cover grounded-output behavior, insufficient-source handling, and permission-aware access to project content.
- Add checks that prove generated results remain reviewable before downstream use.

## Open Questions
- Which project artifacts should be treated as authoritative sources for this AI-assisted workflow?

## Source Traceability
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md

## Implementation Notes
- Keep retrieval, generation, and stored AI context project-scoped so information cannot leak across projects.
