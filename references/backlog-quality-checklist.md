# Backlog Quality Checklist

Use this as the ready-for-review checklist for generated stories.

## Contract Integrity

- [ ] Does the markdown filename match the `Story ID` and title slug?
- [ ] Are `# User Story:` and `## User Story` present and correctly formatted?
- [ ] Are empty optional sections marked `N/A` instead of left as placeholders?

## Product Rigor

- [ ] Does the `As a` clause name a concrete actor instead of a generic "user" when the source material supports specificity?
- [ ] Does the `So that` clause express material business value or operational outcome?
- [ ] Does the `Context` explain what the capability is and why it matters, instead of how the story was generated?
- [ ] Is the story small enough to review and deliver as a coherent increment?

## Technical Contract Integrity

- [ ] **Data Model**: Are field types, mandatory flags, and business purposes clearly defined in a table?
- [ ] **UI Interaction**: Does the story describe the navigation path and user trigger for this capability?
- [ ] **API Contract**: Are endpoints, methods, and example request/response payloads provided (if applicable)?
- [ ] **Business Rules**: Are domain policies extracted from the requirements and explicitly listed?

## Acceptance Criteria & Testing

- [ ] Are scenarios observable and written in `Given / When / Then` form?
- [ ] Does the AC cover the Happy Path, Alternative Flow, and at least one Error case?
- [ ] Does the testing strategy define unit, integration, and E2E requirements?
- [ ] Is there a clear **Definition of Done** checklist tailored to the story?

## Traceability And Grounding

- [ ] Does `Source Traceability` point to specific source material, code evidence, or discovery notes?
- [ ] Are business rules extracted into the `Business Rules` section rather than buried in prose?
- [ ] Are assumptions and unresolved gaps made explicit instead of being hidden inside the story text?
- [ ] Are optional sections selectively meaningful rather than populated with generic cross-cutting filler?

Any "no" answer should trigger a refinement pass before the pack is called ready.

For larger packs, run:

```bash
node scripts/story-quality-report.js <stories-dir>
```

Use the summary to identify which fields and stories need the first refinement pass.
