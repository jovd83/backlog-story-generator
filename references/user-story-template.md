# User Story Template

Use this as the canonical story-file template for this repository.

## Authoring Intent

This template is designed to produce story files that are:
- readable by product, engineering, QA, and delivery teams
- parseable by the repository tooling
- strict enough for validation and export
- flexible enough to capture material context without bloating every story

## Required Sections

Every story file must include:
- title heading
- story metadata
- `## User Story`
- `## Acceptance Criteria`

## Optional Sections

Include these when they materially improve delivery clarity:
- `## Business Rules`
- `## Scope Notes`
- `## Dependencies`
- `## Non-Functional Notes`
- `## Testing Notes`
- `## Open Questions`
- `## Source Traceability`
- `## Implementation Notes`

If you keep an optional section but do not yet have meaningful content, write `N/A` on one short line.

## Canonical Template

```md
# User Story: [Concise Story Title]

**Story ID:** US-###
**Epic/Feature:** [Epic name]
**Priority:** [Critical | High | Medium | Low]
**Story Points:** [1 | 2 | 3 | 5 | 8 | 13]
**Status:** [Proposed | Ready | In Progress | Done]

---

## User Story

**As a** [user or system actor]
**I want** [capability or task]
**So that** [business value or outcome]

---

## Acceptance Criteria

### Scenario 1: [Primary success path]
**Given** [context]
**When** [action]
**Then** [expected outcome]

### Scenario 2: [Alternate path]
**Given** [context]
**When** [action]
**Then** [expected outcome]

### Scenario 3: [Validation, failure, or edge case]
**Given** [context]
**When** [action]
**Then** [expected outcome]

---

## Business Rules
- [Domain or policy rule]

## Scope Notes
- [Implementation boundary, exclusion, sequencing note, or workflow clarification]

## Dependencies
- [System, team, vendor, data, or story dependency]

## Non-Functional Notes
- [Performance, accessibility, security, reliability, compliance, or operability note]

## Testing Notes
- [Key validation strategy, environments, or important coverage focus]

## Open Questions
- [Decision still required before implementation]

## Source Traceability
- [Referenced document, file path, workshop note, or observed code area]

## Implementation Notes
- [Only include when implementation context materially affects delivery planning]
```

## Authoring Rules

- Prefer one primary user outcome per story.
- Split stories when acceptance criteria represent independently releasable behavior.
- Keep acceptance criteria observable and testable.
- Put implementation constraints in optional sections, not inside the user story statement.
- Carry forward supported non-functional requirements instead of dropping them for brevity.
- Never leave literal placeholders like `[Epic name]` or `[capability or task]` in final output.
- Do not name frameworks, services, or tools unless the user or inspected codebase supports them.

## File Naming

Use:

```text
US-###-short-kebab-case-title.md
```

Example:

```text
US-031-assign-and-revoke-roles.md
```
