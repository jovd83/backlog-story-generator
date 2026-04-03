# Contributing

Thanks for contributing to `backlog-story-generator`.

## Development Workflow

1. Install dependencies with `npm install`.
2. Run `npm run verify` before opening a pull request.
3. Keep generated artifacts current when repository checks require them, including `evals/latest-eval-report.md`.

## Pull Requests

- Keep changes focused and explain the user-facing or maintainer-facing impact.
- Add or update tests when behavior changes.
- Update examples, docs, or generated artifacts when they are affected by the change.

## Repository Standards

- Treat markdown story files as canonical source over exported CSV artifacts.
- Prefer deterministic scripts and generated outputs over hand-maintained snapshots.
- Preserve evidence-grounded behavior when changing generation, linting, or export workflows.

## Governance

- Security reporting instructions live in [SECURITY.md](./SECURITY.md).
- Support and maintainer contact guidance lives in [SUPPORT.md](./SUPPORT.md).
- Ownership metadata lives in [.github/CODEOWNERS](./.github/CODEOWNERS).
