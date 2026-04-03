# User Story: Use a Roster Which Assign Actions to User Roles E G Create Test Case Can Be Done by a Tester a Senior Tester a Test Coordinator and a Project Lead

**Story ID:** US-134
**Epic/Feature:** User Management
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

**As a** system administrator
**I want** to use a roster which assign actions to user roles e g create test case can be done by a tester a senior tester a test coordinator and a project lead
**So that** access and audit evidence remain controlled and reviewable

---

## Context
This story adds the ability for system administrator to use a roster which assign actions to user roles e g create test case can be done by a tester a senior tester a test coordinator and a project lead in the User Management epic. Today, access and control are handled more broadly than this project-scoped need requires. With this change, system administrator can use a roster which assign actions to user roles e g create test case can be done by a tester a senior tester a test coordinator and a project lead inside the current project boundary, and access and audit evidence remain controlled and reviewable. It sits with the other User Management stories that control access, auditability, and compliance and Across the product, it protects project boundaries and audit evidence

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-134 (User Management)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Valid project-scoped Use a Roster Which Assign Actions to User Roles E G Create Test Case Can Be Done by a Tester a Senior Tester a Test Coordinator and a Project Lead
**Given** a system administrator is working in a TMT project with the required a roster which assign actions to user roles e g create test case can be done by a tester a senior tester a test coordinator and a project lead context
**When** they use a roster which assign actions to user roles e g create test case can be done by a tester a senior tester a test coordinator and a project lead using valid project data
**Then** the a roster which assign actions to user roles e g create test case can be done by a tester a senior tester a test coordinator and a project lead change is applied only within the permitted project scope

### Scenario 2: Invalid input or insufficient permission
**Given** the a roster which assign actions to user roles e g create test case can be done by a tester a senior tester a test coordinator and a project lead request is missing required data or the user lacks the needed permission
**When** they attempt to use a roster which assign actions to user roles e g create test case can be done by a tester a senior tester a test coordinator and a project lead
**Then** the system blocks the change and explains what must be corrected before the workflow can continue

### Scenario 3: Project scope boundaries are preserved
**Given** another project contains similar a roster which assign actions to user roles e g create test case can be done by a tester a senior tester a test coordinator and a project lead
**When** the user works with a roster which assign actions to user roles e g create test case can be done by a tester a senior tester a test coordinator and a project lead in the current project
**Then** data from other projects is not exposed or changed unless the story explicitly allows it

---

## Business Rules
- Keep the behavior compatible with the deployment, scaling, and project-isolation constraints from the TMT technical notes.
- Administrative or cross-cutting changes must remain auditable when they affect project data or runtime behavior.

## Scope Notes
- Treat this story as platform capability work, not just a single-screen change.
- Detailed service, module, or infrastructure decomposition can follow during implementation planning.

## Dependencies
- Requires project-scoped authorization and audit storage for a roster which assign actions to user roles e g create test case can be done by a tester a senior tester a test coordinator and a project lead.

## Non-Functional Notes
- TMT implementation should stay compatible with the source stack direction: Java Spring Boot backend and Angular frontend.
- Project boundaries, authorization, and auditability should remain intact for this workflow.

## UX
- Provide clear validation, success, and failure feedback at the point where the user performs the action.

## Testing Notes
- Cover permission enforcement, blocked unauthorized changes, and the resulting audit evidence.

## Open Questions
N/A

## Source Traceability
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md

## Implementation Notes
- Implement permission enforcement and audit capture together so privileged actions cannot bypass traceability.

