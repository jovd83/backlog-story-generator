# User Story Template

Use this as the canonical story-file template. It is project-neutral. Stories include the required sections plus the optional sections chosen for the pack (see [Section sets](#section-sets)). Sections that were not chosen are left out, not written as `N/A`.

## Section Sets

Five sections are always included, because the validator and exporter depend on them: the metadata block, `User Story`, `Context`, `Functional / Business References`, and `Acceptance Criteria`.

The optional sections come in four presets. Each preset adds to the one above it:

| Preset | Adds these sections | Fits |
| --- | --- | --- |
| **Lean** | Business Rules, Scope Notes, Open Questions, Source Traceability | quick backlog refinement, early discovery |
| **Standard** | + Dependencies, Non-Functional Notes, UX, Testing Notes | most product backlogs |
| **Technical** | + Data Model, API Contract, Diagrams, Implementation Notes, Definition of Done | engineering-ready stories, codebase-grounded work |
| **Full** | + Progress checklist, Functional Requirements, Technical Considerations, QA & Testing Strategy, Unit Tests, Integration Tests, End-to-End Tests, Regression & Sanity Tests, Test Execution Plan & Quality Gates | teams that track delivery stages and per-story test plans inside the story |

A custom set is any mix of these sections. Keep `Open Questions` and `Source Traceability` in every set if you can. The evidence rules send unresolved decisions to `Open Questions`, so without it those decisions have to go into the pack overview and the closeout instead.

## Authoring Rules

- Keep the story title concise and action-oriented.
- Keep `Story ID`, filename, and title slug aligned.
- Include the required sections and the chosen optional sections, in the order shown in the template below. Inside a chosen section, write `N/A` when it has nothing grounded to say.
- Put only evidence-backed material into the story. Put unresolved decisions into `Open Questions`.
- Bracketed text is guidance, not content. Replace it with grounded detail or write `N/A`. The validator fails on any bracket left behind.
- The technical sections (`Data Model`, `API Contract`, `Implementation Notes`) and `Testing Notes` use only what the source or the observed code supports. Never copy a target, threshold, tool, or endpoint into a story because it looks typical.
- `Diagrams` is optional. Add one only when it clarifies the story, pick a fitting notation, and explain what it shows.
- Acceptance criteria use `### Scenario N: <title>` with bold `**Given**` / `**When**` / `**Then**` lines. Extra `**And**` lines are fine. The validator and exporter parse this exact shape.

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

**As a** [specific actor]
**I want** [capability or task]
**So that** [business value or operational outcome]

---

## Context
[What the story adds, what changes from AS-IS to TO-BE and what users gain, and how it fits with the rest of the epic]

---

## Functional / Business References
- [Source artifact and relevant section or note]

## Acceptance Criteria

### Scenario 1: [Primary success path]
**Given** [context]
**When** [action]
**Then** [expected outcome]

### Scenario 2: [Validation, permission, or failure path]
**Given** [context]
**When** [action]
**Then** [outcome]

### Scenario 3: [Rule, edge, audit, or recovery path, only if the behavior has one]
**Given** [context]
**When** [trigger]
**Then** [outcome]

---

## Business Rules
- [Domain or policy rule from the source]

## Scope Notes
- [Boundary, exclusion, sequencing note, or clarification]

## Dependencies
- [System, team, vendor, data, or story dependency]

## Non-Functional Notes
- [Only targets the source states, such as "chart loads in under 1 second". Do not add generic ones]

## UX
- [Interaction, navigation, feedback, accessibility, or layout requirement the source describes]

## Data Model
[Only fields stated in the source or observed in code]

| Field | Type / Constraints | Business Purpose |
| :--- | :--- | :--- |
| [Field name] | [Type, mandatory or optional] | [What it is used for] |

## API Contract
[Only endpoints stated in the source or observed in code. If the story needs an API nobody has specified, write `N/A` and record the decision in Open Questions]

- **Endpoint**: [Method and path]
- **Authentication**: [Auth scheme, only if stated or observed]
- **Request**: [Payload summary]
- **Response**: [Status code and payload summary]
- **Errors**: [Status code and condition]

## Diagrams
[Optional. Use only when a diagram clarifies the story; otherwise write `N/A`.]

### Diagram 1: [Concise diagram title]
- **Type**: [Mermaid | PlantUML | BPMN | Sequence | Flowchart | State | Other]
- **Why this is useful**: [What ambiguity, workflow, or structure the diagram clarifies]

```text
[Diagram content or fenced Mermaid/PlantUML/BPMN definition]
```

- **Explanation**: [How to read the diagram and what story behavior it highlights]

## Testing Notes
- [What this story's tests must prove, derived from its acceptance criteria. Name frameworks, coverage targets, or pipeline gates only when the project defines them]

## Definition of Done
- [ ] Acceptance criteria verified
- [ ] [Story-specific completion item, or team-wide gates only if the team's own DoD was supplied]

## Open Questions
- [Decision still required before implementation]

## Source Traceability
- [Referenced requirement, file path, workshop note, or observed code area]

## Implementation Notes
- [Components, services, or files observed in the codebase or named in the source, when they affect delivery planning]
```

## Full-Set Sections

Use these only when the chosen set includes them. They go where the notes below say. Their bracketed text is guidance like everything above. None of them has default values: fill them from the source, the repository, or the team's own process, or write `N/A`.

Progress checklist, directly under the metadata block. Keep only the stages the team actually tracks:

```md
**Detailed Progress:**
- [ ] Functional / Business Analysis
- [ ] UX / UI Design
- [ ] Architectural Work
- [ ] Backend Development
- [ ] Frontend Development
- [ ] Unit Testing
- [ ] Service / E2E Testing
- [ ] Technical Review
- [ ] Functional Review
- [ ] Product Owner Review
- [ ] Documentation
```

After `API Contract`:

```md
## Functional Requirements
1. **[Requirement name]**: [Behavior the source requires that the acceptance criteria do not already state]
```

After `Implementation Notes`:

```md
## Technical Considerations
- [Frontend, backend, or data concern observed in the codebase or named in the source]
```

After `Testing Notes`. `Testing Notes` stays as the short summary that reaches the CSV export. These sections hold the detail:

```md
## QA & Testing Strategy
[What the tests for this story must prove as a whole. Coverage targets only if the project defines them]

## Unit Tests
- [Story-specific unit to test; framework only if observed or stated]

## Integration Tests
- [ ] [Story-specific integration check]

## End-to-End Tests
- [ ] [User journey this story adds or changes]

## Regression & Sanity Tests
- [ ] [Existing behavior this story could break]

## Test Execution Plan & Quality Gates
[The team's real pipeline triggers and release gates for these tests, from the source or the repository]
```
