# Contributing

Thanks for contributing to `backlog-story-generator`.

## Before You Open A Pull Request

- Run `npm install` if needed.
- Run `npm run verify`.
- Keep generated exports and temporary directories out of the commit unless they are the explicit subject of the change.
- Update docs, examples, tests, or eval artifacts when the skill contract changes.

## Contribution Expectations

- Keep `SKILL.md`, `README.md`, and references aligned.
- Prefer changing the smallest set of files that materially improves the skill.
- Preserve the markdown story contract unless the change is deliberate and documented.
- Add or update regression tests for parser, validator, lint, export, packaging, or repo-health behavior when relevant.
- Regenerate `evals/latest-eval-report.md` with `npm run eval:report` when evaluation coverage changes.

## Pull Request Guidance

- Explain the user-facing or maintainer-facing impact clearly.
- Call out any contract changes to story shape, validation, or export behavior.
- Mention any follow-up work that was intentionally left out of scope.

## Local Workflow

```bash
npm run verify
```

Useful targeted commands:

```bash
npm test
npm run check:repo-health
npm run check:eval-report
node scripts/improve-story-pack.js <stories-dir> --refine
```

## Scope Boundary

This repository is for the skill, its references, tooling, examples, and publishable GitHub surface.
Do not add unrelated product code, speculative frameworks, or large generated artifacts unless they are necessary to demonstrate or verify the skill.
