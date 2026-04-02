# Adapt This Skill For Your Organization

This repository is intentionally opinionated enough to be trustworthy and generic enough to customize safely.

## Start With The Contract

When you adapt this skill, keep these layers aligned:

1. [`SKILL.md`](../SKILL.md): agent behavior and guardrails
2. [`references/user-story-template.md`](../references/user-story-template.md): authoring contract
3. [`schemas/story.schema.json`](../schemas/story.schema.json): structural validation
4. [`scripts/story-utils.js`](../scripts/story-utils.js): parsing behavior
5. [`scripts/validate-stories.js`](../scripts/validate-stories.js): enforcement and reporting
6. [`scripts/export-stories.js`](../scripts/export-stories.js): downstream representation
7. examples and tests: proof that the contract still works

If one of these layers changes without the others, the repository will drift and become harder to trust.

## High-Value Customizations

Most organizations start by changing:
- story metadata fields
- required optional sections
- naming and numbering conventions
- export defaults or target-tool mappings
- example packs so they reflect the organization’s language and delivery model

## Safe Customization Workflow

1. Change the agent-facing instructions in [`SKILL.md`](../SKILL.md).
2. Update the canonical template in [`references/user-story-template.md`](../references/user-story-template.md).
3. Update the schema in [`schemas/story.schema.json`](../schemas/story.schema.json).
4. Update parsing and validation behavior in the relevant scripts.
5. Update exporters if the changed fields affect downstream tools.
6. Add or refresh examples and fixtures that demonstrate the new contract.
7. Run `npm run verify`.
8. Run `node scripts/improve-story-pack.js <stories-dir> --refine` on at least one representative pack so your customization still produces a clean review workflow instead of only a passing schema.

## Common Adaptation Patterns

### Change Metadata Fields

Examples:
- replace story points with T-shirt sizing
- add business owner or service area fields
- change priority or status vocabularies

Update:
- template
- schema
- parser
- validator
- exporter when relevant
- examples and tests

### Add New Optional Sections

Examples:
- `## Security Notes`
- `## Release Notes`
- `## Compliance Mapping`

Decide whether the section is:
- required
- optional
- optional but preferred when certain triggers are present

Then update the template, parser, validator, and at least one example story.

### Change Export Behavior

Examples:
- add a new CSV target
- change Jira field conventions
- add GitHub labels derived from custom metadata

Update:
- [`scripts/export-stories.js`](../scripts/export-stories.js)
- [`references/export-guide.md`](../references/export-guide.md)
- export fixtures under [`tests/fixtures/exports`](../tests/fixtures/exports)
- tests that prove the exported rows are stable

Remember that backlog-tool exports intentionally omit internal planning-only sections such as `Implementation Notes`.

## Keep Local Conventions Local

Do not hardcode the following into the core skill unless they are truly stable:
- one team’s current sprint rituals
- temporary internal jargon
- one product’s transient architecture
- a vendor integration you may replace soon

If a convention belongs to one project instead of every future consumer, keep it in project-local documentation or memory rather than forcing it into the shared skill contract.

## Memory Guidance During Customization

Use project-local memory only for conventions that are:
- stable
- valuable across multiple tasks
- appropriately scoped to this repository or one organization fork

Do not silently promote ephemeral working notes into persistent memory, and do not embed cross-agent shared-memory behavior directly into this repository.

See [`docs/memory-model.md`](./memory-model.md) for the boundary definitions.

## Release Checklist For A Customized Fork

- update version metadata
- update `README.md` so the published scope matches the actual implementation
- refresh examples so they reflect your domain
- refresh tests and fixtures
- run `npm run verify`
- run the quality workflow from [`docs/story-pack-quality-workflow.md`](./story-pack-quality-workflow.md) on a representative pack
- rebuild the packaged artifact with `npm run package`
