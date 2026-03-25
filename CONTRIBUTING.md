# Contributing

Thanks for improving this skill.

## Contribution Principles

- Keep the skill grounded in real product-delivery workflows.
- Preserve one coherent contract across `SKILL.md`, references, schema, parser, validator, exporter, and examples.
- Prefer explicit behavior over prompt cleverness.
- Keep architecture boundaries clear: runtime execution belongs in the skill, local conventions belong in project files, and cross-agent infrastructure belongs outside this repository.
- Add only the abstractions that materially improve reliability, maintainability, or contributor experience.

## Before Opening Changes

Run:

```bash
npm run verify
```

If you change the story contract:
- update `references/user-story-template.md`
- update `schemas/story.schema.json`
- update `scripts/story-utils.js`
- update `scripts/validate-stories.js`
- update the affected examples
- add or update tests so the contract stays enforceable

## Style Guidance

- Use concise, professional language.
- Keep instructions auditable and action-oriented.
- Label assumptions instead of hiding them inside generated story prose.
- Avoid speculative integrations, placeholder frameworks, or memory mechanisms without a concrete need.
- Prefer backward-compatible parsing only when it protects real migration paths, not as an excuse to keep the contract vague.

## Pull Request Checklist

- The skill contract is clearer, not just longer.
- The examples reflect the current canonical format.
- Validation and export behavior are covered by tests.
- Packaging still produces a clean distributable directory.
- Documentation clearly distinguishes implemented behavior from optional or future concepts.
