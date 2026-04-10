# Backlog Story Generator

[![Version](https://img.shields.io/badge/version-5.2.0-blue.svg)](#)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-43853d.svg)](#requirements)
[![Validate Skills](https://github.com/jovd83/backlog-story-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/jovd83/backlog-story-generator/actions/workflows/ci.yml)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/jovd83)

`backlog-story-generator` is an AgentSkill repository for turning raw product inputs into structured epic-and-story packs that can be reviewed, validated, and exported into common backlog tools.

It is designed for AI-assisted backlog authoring where the output must be:
- grounded in evidence
- readable by product, engineering, and QA
- safe to extend incrementally
- ready for validation and downstream import

## What This Skill Does

The skill helps Codex:
- Decompose source material into epics shaped around business capabilities.
- Generate implementable user stories with **Observable ACs** (Gherkin scenarios).
- Define **Technical Contracts** (Data Models, API specs, UI flows).
- Implement **Comprehensive Testing Strategies** (Unit, Integration, E2E, Quality Gates).
- Preserve **Numbered Continuity** when extending existing packs.
- Validate story packs before export or delivery.
- Export to Jira, Azure DevOps, GitHub Issues, or Tulip CSV.
- Ground backlog work in an observed codebase without hallucinations.

## Capability Matrix

| Capability | What The Skill Can Do | Key Artifacts |
| :--- | :--- | :--- |
| Source ingestion and normalization | Turn messy notes, PRDs, workshop output, or scattered backlog text into a coherent epic-and-story structure. | [`SKILL.md`](./SKILL.md), [`references/story-drafting-playbook.md`](./references/story-drafting-playbook.md) |
| Epic and story-pack generation | Generate one markdown file per story plus a stable folder-oriented backlog pack structure. | [`references/user-story-template.md`](./references/user-story-template.md), [`references/story-pack-structure.md`](./references/story-pack-structure.md) |
| Existing-pack extension | Continue an existing numbered backlog safely without renumbering previously accepted stories. | [`references/naming-convention.md`](./references/naming-convention.md), [`scripts/story-pack-report.js`](./scripts/story-pack-report.js) |
| Structural validation | Verify that generated stories match the canonical contract, required sections, IDs, and filenames. | [`schemas/story.schema.json`](./schemas/story.schema.json), [`scripts/validate-stories.js`](./scripts/validate-stories.js) |
| Semantic quality linting | Detect generic `So that` clauses, boilerplate `Context`, weak acceptance criteria, and filler-heavy optional sections. | [`scripts/lint-story-quality.js`](./scripts/lint-story-quality.js), [`references/story-writing-quality.md`](./references/story-writing-quality.md) |
| Deterministic refinement | Improve structurally valid but generic packs by rewriting common weak patterns into clearer story-specific prose. | [`scripts/refine-generic-story-pack.js`](./scripts/refine-generic-story-pack.js), [`references/acceptance-criteria-patterns.md`](./references/acceptance-criteria-patterns.md) |
| Quality hotspot reporting | Summarize repeated weaknesses across large packs so reviewers can see the main issues quickly. | [`scripts/story-quality-report.js`](./scripts/story-quality-report.js), [`docs/story-pack-quality-workflow.md`](./docs/story-pack-quality-workflow.md) |
| One-command pack improvement | Run validation, quality reporting, optional refinement, and post-checks in a repeatable workflow. | [`scripts/improve-story-pack.js`](./scripts/improve-story-pack.js) |
| Backlog-tool export | Export validated packs to Jira, Azure DevOps, GitHub Issues, and Tulip CSV formats. | [`scripts/export-stories.js`](./scripts/export-stories.js), [`references/export-guide.md`](./references/export-guide.md) |
| Codebase-grounded backlog authoring | Inspect a real repository and propose backlog work without inventing frameworks, APIs, or tools that are not observed. | [`scripts/inspect-codebase-context.js`](./scripts/inspect-codebase-context.js), [`evals/evals.json`](./evals/evals.json) |
| Repository health and packaging | Keep skill metadata, governance files, eval reporting, and packaged artifacts aligned for GitHub-ready distribution. | [`scripts/check-repo-health.js`](./scripts/check-repo-health.js), [`scripts/package-skill.js`](./scripts/package-skill.js), [`scripts/generate-eval-report.js`](./scripts/generate-eval-report.js) |

## What This Repository Contains

| Path | Purpose |
| :--- | :--- |
| [`SKILL.md`](./SKILL.md) | The primary skill contract used by an agent |
| [`references/`](./references/) | Canonical templates, naming rules, and quality guidance |
| [`scripts/`](./scripts/) | Validation, export, packaging, reporting, and codebase-inspection tooling |
| [`examples/`](./examples/) | Example source inputs and generated story packs |
| [`schemas/`](./schemas/) | JSON Schema for story document validation |
| [`tests/`](./tests/) | Regression coverage for parsing, validation, export, packaging, and inspection |
| [`docs/`](./docs/) | Customization and architecture guidance |
| [`evals/`](./evals/) | Lightweight evaluation prompts and review criteria |
| [`memory/`](./memory/) | Optional project-local memory guidance, not shared-memory infrastructure |

## Scope Boundaries

This repository is responsible for backlog generation, validation, and export guidance.

It is not a shared-memory framework, a requirements management platform, or an autonomous product-planning system. If you need cross-agent memory, treat that as an external integration boundary rather than something embedded into this skill.

## Quick Start

```bash
npm install
npm run validate:examples
npm test
npm run package
```

Run the full repository verification flow:

```bash
npm run verify
```

GitHub pull requests run the same verification workflow in CI on Node 20 and Node 22.
Tagged releases publish the packaged `.skill` artifact through GitHub Actions.

## Governance

- Contribution guidance: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Security reporting: [`SECURITY.md`](./SECURITY.md)
- Support path: [`SUPPORT.md`](./SUPPORT.md)
- Maintainer ownership: [`.github/CODEOWNERS`](./.github/CODEOWNERS)

## Use The Skill

Typical requests that should trigger this skill:
- "Break down this PRD into epics and user stories."
- "Extend the existing backlog pack in `stories/` without renumbering current stories."
- "Generate a Jira-ready CSV from these validated stories."
- "Inspect this codebase and propose backlog work without inventing frameworks or APIs."

The operational workflow lives in [`SKILL.md`](./SKILL.md). The short version is:

1. Ingest source material and separate evidence from assumptions.
2. Inspect an existing story pack or codebase when relevant.
3. Draft epic folders and story files using the canonical template.
4. Validate the pack.
5. Export only from validated markdown when the user requests a downstream format.

## Story Contract

Each story file is expected to contain:
- story metadata such as ID, epic, priority, points, and status
- a user story statement with `As a`, `I want`, and `So that`
- **Technical Contracts**: Detailed Data Models, API specifications, and UI interaction flows
- Gherkin-style acceptance criteria covering Happy, Alternative, and Error paths
- **Comprehensive Testing**: Integrated strategy for Unit, Integration, and E2E validation
- a clear **Definition of Done** checklist
- optional supporting sections for rules, dependencies, notes, and traceability

Canonical references:
- [`references/user-story-template.md`](./references/user-story-template.md)
- [`references/naming-convention.md`](./references/naming-convention.md)
- [`references/story-pack-structure.md`](./references/story-pack-structure.md)
- [`references/backlog-quality-checklist.md`](./references/backlog-quality-checklist.md)
- [`references/story-writing-quality.md`](./references/story-writing-quality.md)
- [`references/story-drafting-playbook.md`](./references/story-drafting-playbook.md)
- [`references/acceptance-criteria-patterns.md`](./references/acceptance-criteria-patterns.md)

## Tooling

Validate a story pack:

```bash
node scripts/validate-stories.js <stories-dir>
```

Emit JSON validation output:

```bash
node scripts/validate-stories.js <stories-dir> --json
```

Lint for generic story boilerplate:

```bash
node scripts/lint-story-quality.js <stories-dir>
```

Summarize the main quality hotspots in a large pack:

```bash
node scripts/story-quality-report.js <stories-dir>
```

Refine a structurally valid but generic pack:

```bash
node scripts/refine-generic-story-pack.js <stories-dir>
```

Run the full quality-improvement loop in one command:

```bash
node scripts/improve-story-pack.js <stories-dir> --refine
```

Export a validated pack:

```bash
node scripts/export-stories.js <stories-dir> <output.csv> jira
```

Inspect a codebase for evidence-only grounding:

```bash
node scripts/inspect-codebase-context.js <repo-path>
```

Run repository-health checks for docs, governance, and metadata alignment:

```bash
node scripts/check-repo-health.js
```

Package the repository into a distributable skill directory:

```bash
node scripts/package-skill.js
```

## Story Pack Workflow

For the full improvement loop, use:

```bash
node scripts/improve-story-pack.js <stories-dir> --refine
```

That command wraps:
- structural validation
- semantic quality reporting
- deterministic refinement when appropriate
- post-refinement checks

See [`docs/story-pack-quality-workflow.md`](./docs/story-pack-quality-workflow.md) for the detailed workflow and decision path.

## Gotchas

- Passing structural validation does not guarantee good backlog prose. Use semantic quality linting when you care about story quality, not just file shape.
- Large blind runs from messy notes can preserve duplicated sections or source noise unless the generation step normalizes them deliberately.
- Blind runs and curated benchmark packs can differ in story count when trailing notes, duplicated sections, or field wishlists are normalized differently. Treat that as a modeling decision, not automatically as a defect.
- Sandbox packs are examples and benchmark surfaces, not the skill contract itself. The skill's real value is the end-to-end workflow around generation, validation, refinement, and export.
- Generic `So that`, `Context`, and acceptance criteria are the most common failure modes in raw generation output.
- Trailing requirement notes or partial schema ideas in the source can accidentally turn into stories if the generation workflow does not classify them intentionally.

## Memory Model

The repository uses a deliberately narrow memory model:
- runtime memory: temporary notes for the current request
- project-local memory: optional persistent conventions for one repo or backlog pack
- shared memory: intentionally out of scope for this repository

See [`docs/memory-model.md`](./docs/memory-model.md) for the full policy.

## Derived Artifacts

The following directories are considered generated or derived output rather than canonical source:
- `dist/`
- `tmp/`
- `exports/`

Treat markdown story files as the source of truth. Do not manually patch generated CSV as if it were authoritative.

## Customization

Organizations usually adapt:
- naming and numbering conventions
- required story sections
- export defaults
- example packs
- terminology for status, priority, or sizing

Start with [`docs/adapt-for-your-org.md`](./docs/adapt-for-your-org.md).
For the repeatable quality-improvement loop, also see [`docs/story-pack-quality-workflow.md`](./docs/story-pack-quality-workflow.md).

## Evaluation

Evaluation prompts and review criteria live under [`evals/`](./evals/). They are intended to test:
- feature decomposition quality
- preservation of non-functional requirements
- continuity when extending an existing pack
- export readiness
- evidence-grounded behavior when a codebase is involved

The repository also includes a semantic quality lint so structurally valid but generic story packs can be caught earlier.
For larger packs, use the quality report to see repeated weak fields and issue clusters without reading the full raw lint output.
If the pack is still too generic after generation, use the refiner to replace common boilerplate in `So that`, `Context`, acceptance criteria, and dependency notes before a final review pass.
If you want that workflow wrapped into one repeatable command, use `scripts/improve-story-pack.js`.
For a repository-grounded evaluation coverage snapshot, regenerate [`evals/latest-eval-report.md`](./evals/latest-eval-report.md) with:

```bash
npm run eval:report
```

To verify that the checked-in report is current:

```bash
npm run check:eval-report
```

## Requirements

- Node.js 20 or later

## Repository Status

This repository is ready to use as:
- a local skill
- a forkable baseline for internal backlog standards
- a GitHub-ready open-source skill repository with validation and regression coverage
- a repo with issue templates, CI, release automation, security reporting guidance, and maintainer ownership metadata for public maintenance

## License

MIT. See [`LICENSE`](./LICENSE).
