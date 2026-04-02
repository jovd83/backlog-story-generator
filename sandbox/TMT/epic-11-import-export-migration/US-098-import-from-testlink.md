# User Story: Import from TestLink

**Story ID:** US-098
**Epic/Feature:** Import Export Migration
**Priority:** Medium
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

**As a** integrator
**I want** to import from TestLink
**So that** teams can exchange or publish test information without losing control of the data

---

## Context
Import from TestLink exists so teams can exchange or publish test information without losing control of the data. It belongs to the Import Export Migration backlog and should keep project scope, traceability, and operability clear while TMT grows.

---

## Functional / Business References
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md: normalized TMT backlog source for US-098 (Import Export Migration)
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md: architecture, deployment, and quality constraints for TMT implementation

## Acceptance Criteria

### Scenario 1: Complete Import from TestLink
**Given** a integrator is working inside the correct TMT project and is ready to import from TestLink
**When** they import from TestLink
**Then** the TMT record and the external, imported, or documented reference stay aligned for the selected scope

### Scenario 2: Block invalid or unauthorized changes
**Given** required input, mappings, or permissions for import from TestLink are missing
**When** the integrator tries to import from TestLink
**Then** TMT prevents the change and explains what must be corrected before work can continue

### Scenario 3: References remain consistent
**Given** the workflow exchanges identifiers, links, or packages with another system or format
**When** the operation succeeds
**Then** the resulting identifiers, links, or packages can still be followed during troubleshooting or audit review

---

## Business Rules
- Integration-facing workflows should preserve stable identifiers and explicit scope.
- External-system failures must not silently corrupt the TMT project state.

## Scope Notes
- This story covers a specific integration, import/export, or API-facing behavior.
- Vendor-specific implementation choices can remain open at backlog stage unless the source requires them.

## Dependencies
- Connector configuration, published contracts, import/export mappings, or external platform access as relevant.

## Non-Functional Notes
- TMT implementation should stay compatible with the source stack direction: Java Spring Boot backend and Angular frontend.
- Project boundaries, authorization, and auditability should remain intact for this workflow.

## UX
- Make the selected scope, current mapping, and resulting external reference understandable to the user.

## Testing Notes
- Cover the happy path, auth or validation failures, and consistency of stored references or exported artifacts.
- Add integration checks when another system contributes part of the workflow.

## Open Questions
- Which source-field mappings are mandatory for the first migration-ready release?

## Source Traceability
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_func.md
- C:/projects/VS_prj/TMT_codex/starting_point/starting_point_tech.md

## Implementation Notes
- Keep connector-specific logic isolated so later vendors or formats can be added without rewriting the core platform workflow.
