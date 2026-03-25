# Backlog Story Generator

An AgentSkill for turning raw product inputs into disciplined backlog artifacts: epics, markdown user stories, validation-ready story packs, and CSV exports for common delivery tools.

## Project Metadata

- Name: `backlog-story-generator`
- Author: `jovd83`
- Version: `3.4.0`
- License: `MIT`

This repository is intended to be:
- installable as a reusable AgentSkill
- readable by maintainers and contributors
- safe to extend without weakening the story contract
- practical for real product-delivery workflows

## What This Skill Does

The skill is responsible for:
- analyzing requirements, discovery notes, SOPs, process docs, workshops, or codebase context
- grouping work into coherent epics
- drafting backlog-ready user stories with observable Gherkin-style acceptance criteria
- validating story packs against a clear repository contract
- exporting story packs to Jira, Azure DevOps, GitHub Issues, or Tulip CSV formats

The skill is not responsible for:
- inventing unsupported product scope
- acting as cross-project shared memory
- pushing tickets to external systems by default

Direct API pushes are optional and intentionally outside the default workflow.

## Who It Is For

This skill is useful for:
- product managers turning source material into backlog structure
- engineering leads decomposing a feature area into implementable increments
- delivery managers normalizing inconsistent story files
- QA or test leads who need observable acceptance criteria instead of vague tickets
- AI agents that need a repeatable backlog-authoring contract instead of ad hoc prose

## Repository Layout

```text
.
|-- SKILL.md
|-- README.md
|-- CHANGELOG.md
|-- openai.yaml
|-- skill-manifest.example.json
|-- CONTRIBUTING.md
|-- docs/
|-- package.json
|-- evals/
|-- examples/
|-- references/
|-- schemas/
|-- scripts/
`-- tests/
```

## Skill Contract

The repository now uses one canonical story format across:
- [`SKILL.md`](./SKILL.md)
- [`references/user-story-template.md`](./references/user-story-template.md)
- [`schemas/story.schema.json`](./schemas/story.schema.json)
- [`scripts/story-utils.js`](./scripts/story-utils.js)
- [`scripts/validate-stories.js`](./scripts/validate-stories.js)
- [`scripts/export-stories.js`](./scripts/export-stories.js)
- [`scripts/story-pack-report.js`](./scripts/story-pack-report.js)
- [`scripts/inspect-codebase-context.js`](./scripts/inspect-codebase-context.js)

That consistency is deliberate. The examples, parser, schema, and exporter are meant to reinforce one durable contract rather than multiple loosely related drafts.

## Install

1. Copy this repository into your Agent Skills directory.
2. Ensure Node.js 18 or later is available for validation, export, testing, and packaging.
3. Invoke the skill when backlog decomposition, story normalization, validation, or export is needed.

## Quick Start

Validate the bundled example pack:

```bash
npm run validate:examples
```

Export the examples to Jira CSV:

```bash
npm run export:examples:jira
```

Run the full local verification workflow:

```bash
npm run verify
```

Build a distributable package:

```bash
npm run package
```

## Canonical Output Structure

The default story-pack layout is:

```text
stories/
|-- epic-01-checkout-experience/
|   |-- US-001-capture-shipping-address.md
|   `-- US-002-select-shipping-method.md
`-- epic-02-payment-processing/
    `-- US-003-submit-card-payment.md
```

See [`references/story-pack-structure.md`](./references/story-pack-structure.md) and [`references/naming-convention.md`](./references/naming-convention.md) for the naming and layout rules.

## Authoring Workflow

1. Read the source material and extract roles, goals, workflows, constraints, dependencies, and unresolved decisions.
2. Define epics around business capability or workflow boundaries.
3. Draft stories using [`references/user-story-template.md`](./references/user-story-template.md).
4. Follow the naming and numbering rules in [`references/naming-convention.md`](./references/naming-convention.md).
5. Validate the pack with `node scripts/validate-stories.js <stories-dir>`.
6. Export with `node scripts/export-stories.js <stories-dir> <output.csv> [format]` if needed.
7. Summarize assumptions, conflicts, and unresolved questions.

## Validation and Export Tooling

### Validator

`scripts/validate-stories.js` checks:
- required headings and metadata
- schema compliance
- duplicate story IDs
- filename and story ID alignment
- obvious leftover placeholders

Optional JSON output is available:

```bash
node scripts/validate-stories.js ./examples/generated --json
```

Preflight reporting for extending an existing pack is also available:

```bash
node scripts/story-pack-report.js ./tests/fixtures/existing-pack
```

### Exporter

`scripts/export-stories.js`:
- recursively scans story directories
- parses only valid story markdown files
- rejects malformed story files instead of silently exporting weak data
- writes tool-specific CSV for `jira`, `ado`, `github`, or `tulip`

See [`references/export-guide.md`](./references/export-guide.md) for field mappings and usage guidance.

For codebase-grounded backlog work, the repository also includes an evidence-only inspection helper:

```bash
node scripts/inspect-codebase-context.js ./tests/fixtures/codebase/admin-role-app
```

## Memory Boundaries

This skill uses a scoped memory model:
- Runtime memory: temporary task context, assumptions, numbering choices, decomposition decisions
- Project-local memory: only stable local conventions or mapping files already maintained in the project
- Shared memory: intentionally out of scope for this repository; integrate through a dedicated shared-memory boundary if needed

The repository does not auto-promote temporary working context into persistent memory.

## Examples

See [`examples/README.md`](./examples/README.md) for the example catalog.

Included source inputs:
- [`examples/input-checkout-requirements.md`](./examples/input-checkout-requirements.md)
- [`examples/input-analytics-dashboard-widget.md`](./examples/input-analytics-dashboard-widget.md)
- [`examples/input-warehouse-operations.md`](./examples/input-warehouse-operations.md)
- [`examples/input-role-access-management.md`](./examples/input-role-access-management.md)
- [`examples/input-healthcare-appointment-scheduling.md`](./examples/input-healthcare-appointment-scheduling.md)
- [`examples/input-field-service-dispatch.md`](./examples/input-field-service-dispatch.md)

Representative generated stories:
- [`examples/generated/epic-01-checkout-experience/US-001-capture-shipping-address.md`](./examples/generated/epic-01-checkout-experience/US-001-capture-shipping-address.md)
- [`examples/generated/epic-02-analytics-dashboard/US-010-view-sales-trend-widget.md`](./examples/generated/epic-02-analytics-dashboard/US-010-view-sales-trend-widget.md)
- [`examples/generated/epic-03-warehouse-operations/US-020-print-shipping-label.md`](./examples/generated/epic-03-warehouse-operations/US-020-print-shipping-label.md)
- [`examples/generated/epic-04-role-access-management/US-031-assign-and-revoke-roles.md`](./examples/generated/epic-04-role-access-management/US-031-assign-and-revoke-roles.md)
- [`examples/generated/epic-05-appointment-scheduling/US-040-book-clinic-appointment.md`](./examples/generated/epic-05-appointment-scheduling/US-040-book-clinic-appointment.md)
- [`examples/generated/epic-06-field-service-dispatch/US-050-assign-technician-by-territory-and-skill.md`](./examples/generated/epic-06-field-service-dispatch/US-050-assign-technician-by-territory-and-skill.md)

The example catalog now spans commerce, analytics, warehouse operations, access management, healthcare scheduling, and field-service dispatch so contributors can regression-check the skill against more than one style of backlog decomposition.

## Evaluation Strategy

The repository includes realistic evaluation prompts in [`evals/evals.json`](./evals/evals.json).

The evaluation set is designed to exercise:
- greenfield feature decomposition
- preservation of non-functional constraints
- normalization of inconsistent or scattered input
- safe extension of an existing story pack without renumbering
- export readiness and validation discipline

The repo now also includes:
- an end-to-end existing-pack fixture under [`tests/fixtures/existing-pack`](./tests/fixtures/existing-pack)
- a codebase-grounded anti-hallucination fixture under [`tests/fixtures/codebase/admin-role-app`](./tests/fixtures/codebase/admin-role-app)

Use the evals as regression prompts when changing the skill contract, parser, exporter, or examples.

## Packaging

`npm run package` builds a local distributable directory at `dist/backlog-story-generator.skill/` and generates `skill-manifest.json`.

The packaging flow:
- does not publish automatically
- does not mutate source files
- excludes transient directories such as `dist/`, `tmp/`, and `node_modules/`

For public distribution or registry-style publishing, start from [`skill-manifest.example.json`](./skill-manifest.example.json) and adapt the metadata to your actual release target.

For OpenAI-facing repository metadata and command hints, see [`openai.yaml`](./openai.yaml).

## Extensibility

Safe extension points:
- add new export targets in [`scripts/export-stories.js`](./scripts/export-stories.js)
- extend the schema and parser together when introducing new story sections
- add new example packs for other domains
- add richer validation rules or reporting as long as the core story contract stays clear
- add or update target-specific export fixtures under [`tests/fixtures/exports`](./tests/fixtures/exports) when exporter behavior changes

For teams adopting or forking this repository, see [`docs/adapt-for-your-org.md`](./docs/adapt-for-your-org.md).

Out of scope for the current implementation:
- direct hosted integrations with ticketing platforms
- autonomous backlog-grooming loops
- cross-agent shared-memory infrastructure

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## License

This repository now includes the MIT license in [`LICENSE`](./LICENSE).
