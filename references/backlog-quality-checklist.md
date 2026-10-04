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

- [ ] **Grounding**: Does every field, endpoint, auth scheme, component, framework, and numeric target trace back to the source or to observed code? Is everything else `N/A` with the decision in `Open Questions`?
- [ ] **Data Model**: When present, are field types, mandatory flags, and business purposes clearly defined in a table?
- [ ] **UX**: When the source describes the UI, does the story give the navigation path, trigger, and feedback?
- [ ] **API Contract**: When an API is specified or observed, are endpoints, methods, and example payloads given? Is an unspecified API left as an open question rather than invented?
- [ ] **Diagrams**: If diagrams are included, do they use a fitting notation, clarify something the prose alone would not, and include a short explanation for each diagram?
- [ ] **Business Rules**: Are domain policies extracted from the requirements and explicitly listed?

## Acceptance Criteria & Testing

- [ ] Are scenarios observable and written in `Given / When / Then` form?
- [ ] Does the AC cover the main success path and the failure, permission, or edge paths the behavior actually has, without filler scenarios added to reach a count?
- [ ] Does the testing strategy follow from this story's acceptance criteria, and does it name tools, coverage targets, or release gates only when the project defines them?
- [ ] Is the **Definition of Done** tailored to the story, with team-wide gates only when the team's DoD was supplied?

## Traceability And Grounding

- [ ] Does `Source Traceability` point to specific source material, code evidence, or discovery notes?
- [ ] Are business rules extracted into the `Business Rules` section rather than buried in prose?
- [ ] Are assumptions and unresolved gaps made explicit instead of being hidden inside the story text?
- [ ] Are optional sections selectively meaningful rather than populated with generic cross-cutting filler?

Any "no" answer means the affected stories need rewriting before the pack is called ready.

For larger packs, run:

```bash
node scripts/story-quality-report.js <stories-dir>
```

Use the summary to identify which fields and stories need rewriting first.
