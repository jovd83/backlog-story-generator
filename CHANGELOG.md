# Changelog

All notable changes to this repository are documented in this file.

The format follows a simple Keep a Changelog style.

## [3.4.0] - 2026-03-25

### Added
- Added `scripts/story-pack-report.js` for preflight reporting on existing numbered packs.
- Added `scripts/inspect-codebase-context.js` for evidence-only codebase stack inspection.
- Added an end-to-end existing-pack fixture for numbering continuity evals.
- Added a codebase-backed fixture repo for anti-hallucination evals.
- Added automated tests for both new eval harnesses.

### Changed
- Updated `README.md` and eval reporting to reflect the new harness coverage.

## [3.3.0] - 2026-03-25

### Added
- Added `skill-manifest.example.json` for smoother public distribution and publishing adaptation.
- Added `docs/adapt-for-your-org.md` with guidance for forks and internal customization.
- Added mixed-domain export fixture coverage using the full example story pack.

### Changed
- Expanded `README.md` packaging and adaptation guidance.

## [3.2.0] - 2026-03-25

### Added
- Added `CHANGELOG.md`.
- Added two new example domains:
  - healthcare appointment scheduling
  - field service dispatch
- Added four new generated example stories covering the new domains.

### Changed
- Expanded example documentation in `README.md` and `examples/README.md`.
- Updated validation tests to cover the larger example corpus.

## [3.1.0] - 2026-03-25

### Added
- Added MIT `LICENSE`.
- Added author metadata for `jovd83`.
- Added target-specific export fixtures for Jira, Azure DevOps, GitHub, and Tulip.

### Changed
- Renamed the skill to `backlog-story-generator`.
- Bumped package and skill metadata to `3.1.0`.
- Improved packaging metadata and cleanup behavior.
- Tightened export regression coverage.

## [3.0.0] - 2026-03-25

### Added
- Rebuilt the skill contract across docs, schema, parser, validator, exporter, tests, and examples.
- Added `references/story-pack-structure.md`.
- Added JSON output mode to the validator.
- Added stronger validation and export tests.

### Changed
- Normalized the canonical story template and generated examples.
- Strengthened validation, export, packaging, and repository documentation.
