# Changelog

All notable changes to this repository are documented here.

## [6.0.0] - 2026-10-04

The skill is now project-neutral. Everything that was specific to one test-management product backlog ("TMT") is gone.

### Added
- SKILL.md has a "Specialist skills come first" section. When the environment has a dedicated skill for acceptance criteria (`acceptance-criteria-designer`), diagrams (`diagram-generator`), codebase grounding (`codebase-context`), or a readiness review (`test-analysis-skill`), the agent invokes it for that part and translates the result into the story format. The bundled references are the fallback. Skills are matched by capability, not by exact name. Delegation is skipped when the surrounding workflow already has its own step for that part, such as the new-feature SDLC chain's acceptance-criteria phase.
- Section choice. Before drafting, the skill offers the optional story sections as four presets (Lean, Standard, Technical, Full) or a custom mix, and asks the user to pick. It recommends Technical when a codebase or API description is part of the input and Standard otherwise. It skips the question when the user already named the sections, when extending a pack (it follows the sections the existing stories use), or when nobody can answer, in which case it uses the recommended preset and names it in the closeout. Unchosen sections are left out of the files rather than written as `N/A`. The Full preset brings back the heavier delivery sections (progress checklist, Functional Requirements, Technical Considerations, and the separate test sections) as an opt-in, with bracketed guidance instead of default values.
- The closeout names which specialist skills were used, for which parts and which stories.

### Removed
- `scripts/refine-generic-story-pack.js` and its test. It rewrote stories from fixed templates built for that one backlog. On any other pack it injected product-specific wording, placeholder data models, JWT auth, endpoints, and NFRs, and it fired on stories as ordinary as "As a user".
- The `--refine` and `--force-refine` options, which called that script.
- Lint patterns that only ever matched text the refiner produced: TMT wording, Angular, Playwright, multi-project, and execution data.
- `WebApp (UI) Interaction` from the story template. The parser still reads it.
- The heavier delivery sections as part of every story: the progress checklist; the separate unit, integration, end-to-end, regression, and test-execution-plan sections; Functional Requirements; and Technical Considerations. They come back only through the opt-in Full preset (see Added). The parser still reads all of these headings, and the old long forms such as `Data Model (Fields)` and `Definition of Done (DoD)`, so existing packs keep validating. `docs/adapt-for-your-org.md` explains how to change the presets.
- Default values in the template that read like content: page load under 2 s, 500 ms API budget, 80% unit coverage, 100% API coverage, WCAG 2.1, mobile responsive, RBAC, the CI trigger table, and the generic DoD.

### Changed
- `scripts/improve-story-pack.js` is renamed to `scripts/check-story-pack.js`. It runs validation and the quality summary and never changes files. The npm script `improve:examples` is now `check:examples`, and the `openai.yaml` command `improve_examples` is now `check_examples`. The module export is `checkStoryPack` (was `improveStoryPack`). Its `--json` output is one flat result: the `before`, `after`, `refined`, and `refinedCount` fields are gone, and `storiesFound`, `validationValid`, `qualityValid`, and the issue counts sit at the top level.
- `SKILL.md` is rewritten for the agent that runs it:
  - scripts are called from the skill directory, and the pack is written into the user's project (`./stories/` by default)
  - technical and testing sections are filled only from the source or observed code
  - the scenario count follows the behaviour instead of a fixed three
  - a new section covers extending a pack written to an older template
  - a fixed closeout format
  - repository-only notes and the long memory policy were moved out
- The story template is project-neutral and uses the section names of the example packs (`Non-Functional Notes`, `Testing Notes`) plus `UX`, plus optional `Data Model`, `API Contract`, and `Definition of Done` sections that require evidence.
- Reference examples now come from several domains instead of test management.
- `references/backlog-quality-checklist.md` asks whether technical details are grounded in the source or code.
- `evals/evals.json`: evals 4 and 5 now attach their fixtures and make concrete requests, so they can be run.

### Fixed
- `validate-stories.js` never applied the schema rules to individual acceptance-criteria scenarios. A scenario with no `Given`, `When`, or `Then` passed validation and exported as empty clauses. Each scenario is now checked, with a regression test.
- Acceptance-criteria parsing kept only the first `Given`, `When`, and `Then` line of each scenario, so exports silently dropped every `And` / `But` line. Those lines now stay with their clause in all four CSV formats.
- The lint pattern for generic "valid project context exists" scenarios matched only when an extra word, such as a product name, sat in the middle.

## [5.3.2] - 2026-10-01

### Changed
- `metadata` carries `author` and `version`, as the other skills in this library do.
- Every version marker says 5.3.2. They disagreed before (README badge 5.3.0, package.json 5.3.0); this release continues from the highest.
- The eval-report and packaging tests read the version from `package.json` instead of a hard-coded value; the eval report is regenerated for 5.3.2.

### Removed
- The `dispatcher-*` routing keys from the SKILL.md metadata. Nothing reads them since skill-dispatcher 5.0.0, which builds its registry from names and descriptions.

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
