# Changelog

All notable changes to this repository are documented here.

## [5.3.1] - 2026-04-30

### Changed
- Trim `SKILL.md` frontmatter to fit the 1000-character dispatcher limit (description trim, migrate non-dispatcher fields to body).

## [5.3.0] - 2026-04-17

### Added
- Added an optional `Diagrams` section to the canonical user story template so stories can include Mermaid, UML, BPMN, and similar visuals when they materially clarify behavior or structure.
- Added parser, schema, validation, and export support for the optional `Diagrams` section.
- Added regression coverage to ensure diagrams are parsed, placeholder-checked, and preserved in exports.

### Changed
- Updated skill instructions, README guidance, and quality references to make `Diagrams` an explicitly optional section that the AI should include only when useful and explain when present.

## [5.2.0] - 2026-04-10

### Added
- Upgraded the canonical user story template to the modern, technical TMT standard.
- Added structured sections for **Data Models (Fields)**, **WebApp (UI) Interaction**, and **API (REST) Contracts**.
- Added categorized **Non-Functional Requirements** and **Technical Considerations**.
- Added a comprehensive **QA & Testing Strategy** (Unit, Integration, E2E) and a **Definition of Done (DoD)** checklist to every story.
- Updated `scripts/refine-generic-story-pack.js` to automatically infer technical details and contracts for Java/Spring and Angular stacks.

### Changed
- Refined the structural validation regex in `scripts/validate-stories.js` to avoid flagging valid Markdown links as placeholders.
- Batch-migrated all 150 stories in `sandbox/TMT` to the new high-fidelity technical template.

## [5.1.0] - 2026-04-09

### Added
- Added `scripts/improve-story-pack.js` as a single-command validation, reporting, and refinement workflow for story packs.
- Added `scripts/check-repo-health.js` to verify public-repo governance files and metadata alignment.
- Added `scripts/generate-eval-report.js` to generate a repository-grounded evaluation coverage report from the current repo state.
- Added `tests/check-repo-health.test.js`.
- Added `tests/generate-eval-report.test.js`.
- Added `tests/improve-story-pack.test.js`.
- Added `docs/story-pack-quality-workflow.md` to document the end-to-end quality loop.
- Added GitHub Actions CI in `.github/workflows/ci.yml`.
- Added `.github/pull_request_template.md`.
- Added GitHub issue templates under `.github/ISSUE_TEMPLATE/`.
- Added tag-driven release automation in `.github/workflows/release.yml`.
- Added `.github/CODEOWNERS` for maintainer ownership metadata.

### Changed
- Expanded the parser and schema to recognize the `UX` section explicitly.
- Extended semantic quality checks and deterministic refinement to cover `UX`, `Testing Notes`, `Open Questions`, and `Implementation Notes`.
- Kept backlog-tool CSV exports focused by omitting `Implementation Notes` from exported descriptions.
- Aligned the README, customization guide, examples guide, export guide, and packaging metadata with the current quality-improvement workflow.
- Aligned contributor guidance and the README with the new CI-backed verification workflow.
- Extended GitHub-facing maintenance guidance to cover issue intake and packaged release publication.
- Extended the public repository surface to include governance, support, and security policy links.
- Extended packaging metadata and repository verification to include governance files and repo-health checks.
- Replaced stale hand-maintained evaluation reporting with a deterministic generated coverage report workflow.
- Added eval-report freshness checks so verification fails when `evals/latest-eval-report.md` drifts from the live repo state.

## [5.0.0] - 2026-04-01

### Changed
- Renamed the primary skill identity to `backlog-story-generator` across skill metadata, packaging, and repository documentation.
- Rewrote `SKILL.md` into a stronger operational contract with explicit workflow, output expectations, evidence guardrails, validation discipline, and memory boundaries.
- Rebuilt `README.md` for public GitHub readiness with clearer scope, architecture, usage, and repository responsibilities.
- Reworked key reference files to make the story contract more precise and less prototype-like.
- Simplified `scripts/setup.js` into a deterministic preflight instead of a mixed setup-and-install routine.
- Expanded packaging metadata so the packaged skill advertises the actual repository contents more accurately.

### Added
- Added `CONTRIBUTING.md`.
- Added `docs/memory-model.md`.
- Added `memory/README.md` to make project-local persistence explicit and auditable.

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
