# User Story Template

Use this as the canonical story-file template.

## Authoring Rules

- Keep the story title concise and action-oriented.
- Keep `Story ID`, filename, and title slug aligned.
- Mark optional sections `N/A` when they are intentionally not used.
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

## Functional / Business References
- [Source artifact and relevant section or note]

## Acceptance Criteria

### Scenario 1: [Primary success path]
**Given** [context]
**When** [action]
**Then** [expected outcome]

---

## Business Rules
- [Domain or policy rule]

## Scope Notes
- [Boundary, exclusion, sequencing note, or clarification]

## Dependencies
- [System, team, vendor, data, or story dependency]

## Non-Functional Notes
- [Performance, accessibility, security, reliability, compliance, or operability note]

## UX
- [Interaction, layout, accessibility, responsive, or content requirement]

## Testing Notes
- [Coverage focus, environments, fixtures, or validation strategy]

## Open Questions
- [Decision still required before implementation]

## Source Traceability
- [Referenced requirement, file path, workshop note, or observed code area]

## Implementation Notes
- [Only include when implementation context materially affects delivery planning]
```
