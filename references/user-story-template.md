# User Story Template

Use this as the canonical story-file template.

## Authoring Rules

- Keep the story title concise and action-oriented.
- Keep `Story ID`, filename, and title slug aligned.
- Mark optional sections `N/A` when they are intentionally not used.
- Treat `Diagrams` as optional. Add them only when a diagram materially clarifies the story, choose a notation that fits the need, and explain what each diagram shows.
- Put only evidence-backed material into the story. Put unresolved decisions into `Open Questions`.

## Canonical Template

```md
# User Story: [Concise Story Title]

**Story ID:** US-###
**Epic/Feature:** [Epic name]
**Priority:** [Critical | High | Medium | Low]
**Story Points:** [1 | 2 | 3 | 5 | 8 | 13]
**Status:** [Proposed | Ready | In Progress | Done]

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

**As a** [specific actor]
**I want** [capability or task]
**So that** [business value or operational outcome]

---

## Context
[Why this story exists and what it must accomplish]

---

## Data Model (Fields)

| Field | Technical Specs | Business Purpose & Functional Use Case |
| :--- | :--- | :--- |
| [Field Name] | [Type, Mandatory/Optional] | [Functional explanation] |

---

## WebApp (UI) Interaction

1. **Navigation**: [Navbar > Feature Route]
2. **Access**: [Breadcrumb or Link location]
3. **Trigger**: [Button/Link label]
4. **Action**: [User input steps]
5. **Result**: [Expected feedback/Navigation]

---

## API (REST) Contract

- **Endpoint**: `[HTTP_METHOD] /api/v1/[PATH]`
- **Method**: `[METHOD]`
- **Authentication**: [AUTH_TYPE]
- **Request Body**:
```json
{
  "example": "payload"
}
```
- **Response**: `201 Created` / `200 OK`
- **Error Codes**:
    - `400 Bad Request`: [Condition]
    - `403 Forbidden`: [Condition]

---

## Diagrams
[Optional. Use only when a diagram materially clarifies the story; otherwise write `N/A`.]

### Diagram 1: [Concise diagram title]
- **Type**: [Mermaid | UML | BPMN | Sequence | Flowchart | Class | State | Other]
- **Why this is useful**: [What ambiguity, workflow, or structure the diagram clarifies]

```text
[Diagram content or fenced Mermaid/UML/BPMN definition]
```

- **Explanation**: [How to read the diagram and what story behavior or structure it highlights]

---

## Functional Requirements

1. **[Requirement 1]**: [Description]
2. **[Requirement 2]**: [Description]

---

## Acceptance Criteria

### Scenario 1: [Primary success path]
**Given** [context]
**When** [action]
**Then** [expected outcome]

### Scenario 2: [Alternative Flow]
**Given** [context]
**When** [action]
**Then** [outcome]

### Scenario 3: [Error/Edge Case]
**Given** [edge case]
**When** [trigger]
**Then** [error handling]

---

## Business Rules
- [Domain or policy rule]

---

## Non-Functional Requirements

### Performance
- Page load: < 2s
- API response: < 500ms
### Usability
- Mobile responsive
- Accessibility (WCAG 2.1)
### Security
- Role-Based Access Control (RBAC) enforced
- Input sanitization

---

## Technical Considerations

### Frontend
- Component: [Component Name]
- State: [State Implementation]
### Backend
- Service: [Service Name]
- Logic Location: [Details]
### Database
- Tables: [Table Names]
- Indexes: [Required Indexes]

---

## Dependencies

### Blocked By
- [ ] [DEPENDENCY_UID]
### Blocks
- [ ] [BLOCKED_UID]
### Related Stories
- [RELATED_UID]

---

## QA & Testing Strategy

### Test Coverage Requirements
- **Unit Tests:** 80% Min
- **Integration Tests:** 100% API coverage
- **E2E Tests:** Critical paths

---

## Unit Tests
[Framework and location details]

### Backend Unit Tests
1. **Model Layer**: Validation, Business rules.
2. **Service Layer**: CRUD operations, Authorization checks.

### Frontend Unit Tests
1. **Component Rendering**: Initial state, loading states.
2. **User Interactions**: Clicks, form validation.

---

## Integration Tests
- [ ] CRUD Operations (Happy path)
- [ ] Authentication & Role-based access
- [ ] Schema validation
- [ ] Error status codes (400, 401, 403)

---

## End-to-End Tests
- [ ] Critical user journey: [Workflow Description]
- [ ] File Upload/Download (if applicable)

---

## Regression & Sanity Tests
- [ ] Core feature verification
- [ ] App availability (loads in under 2s)

---

## Test Execution Plan & Quality Gates

| Test Type | Trigger | Blocks Release |
| :--- | :--- | :---: |
| Unit | Every Commit | No |
| Integration | Every PR | Yes |
| E2E | Nightly | Yes |
| Sanity | Post-deploy | Yes |

---

## Definition of Done (DoD)
- [ ] Code reviewed & approved
- [ ] Unit tests passing (>80%)
- [ ] API contract verified
- [ ] AC verified manually & via E2E
- [ ] Documentation updated

---

## Functional / Business References
- [Source artifact and relevant section or note]

## Scope Notes
- [Boundary, exclusion, sequencing note, or clarification]

## Open Questions
- [Decision still required before implementation]

## Source Traceability
- [Referenced requirement, file path, workshop note, or observed code area]

## Implementation Notes
- [Only include when implementation context materially affects delivery planning]
```
