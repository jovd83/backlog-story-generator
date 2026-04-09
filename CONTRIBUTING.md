# Contributing

Thank you for your interest in contributing to the Backlog Story Generator!

## How to Contribute

1.  **Fork the repository.**
2.  **Create a branch** for your feature or bug fix.
3.  **Ensure tests pass.** Run `npm test` and `npm run verify` to ensure repository health and functionality.
4.  **Submit a Pull Request** with a clear description of your changes.

## Development Workflow

1.  **Setup**: Run `npm install` and `npm run setup`.
2.  **Verify**: Run `npm run verify` to check alignment between metadata, documentation, and tests.
3.  **Testing**: Unit tests live in `tests/`. Run them using `npm test`.

## Governance Alignment

When adding new scripts or modifying documentation, ensure that:
- `openai.yaml` version matches `package.json` and `skill-manifest.example.json`.
- `README.md` is updated if new capabilities are added.
- New scripts are added to `package.json` and `scripts/check-repo-health.js` if they are critical to repo health.

## Code of Conduct

Please be respectful and professional in all interactions.
