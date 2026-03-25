# Adapt This Skill For Your Organization

This repository is intentionally generic enough to publish, but structured enough to customize safely.

## What To Customize First

The highest-value organization-specific changes are usually:
- story naming and ID conventions
- required optional sections
- export target defaults
- wording for priorities, status values, or story sizing
- example packs that reflect your domain and delivery language

Avoid changing everything at once. Keep the parser, schema, template, and examples aligned as one contract.

## Safe Customization Workflow

1. Update the user-facing instructions in `SKILL.md`.
2. Update the canonical structure in `references/user-story-template.md`.
3. Update the schema in `schemas/story.schema.json`.
4. Update parsing and validation in `scripts/story-utils.js` and `scripts/validate-stories.js`.
5. Update exports in `scripts/export-stories.js` if field behavior changed.
6. Update examples and fixtures so they prove the new contract.
7. Run `npm run verify`.

If you skip one of these layers, the repository will drift and become harder to trust.

## Common Adaptation Patterns

### 1. Change Story Metadata

Examples:
- replacing story points with t-shirt sizes
- adding a business owner field
- changing status values

What to change:
- template
- schema
- parser
- validator
- exporter if the new field matters downstream

### 2. Add Organization-Specific Sections

Examples:
- `## Security Notes`
- `## Release Notes`
- `## Compliance Mapping`

What to change:
- add the section to the template
- decide whether it is required or optional
- extend the schema and parser
- include at least one example story that uses it

### 3. Change Export Behavior

Examples:
- adding a new CSV target
- changing label conventions for GitHub Issues
- changing ADO tags or Jira field formatting

What to change:
- `scripts/export-stories.js`
- `references/export-guide.md`
- add new fixtures under `tests/fixtures/exports`
- add or update export tests

### 4. Rebrand The Skill

Examples:
- internal platform naming
- department-specific backlog conventions

What to change:
- `SKILL.md` frontmatter
- `README.md`
- `package.json`
- `skill-manifest.example.json`
- release notes in `CHANGELOG.md`

## What Not To Hardcode Too Early

Try not to bake these into the core contract unless they are genuinely stable:
- one team’s current sprint process
- a specific vendor integration you may replace later
- transient organizational jargon
- assumptions that should remain per-project rather than per-skill

If a convention is local to one repo, keep it local. Do not force every consumer of the skill to inherit it.

## Suggested Forking Strategy

If your org needs a strongly opinionated version:
- fork the repository
- rename the skill clearly
- add your own domain examples
- document which parts are canonical versus local

If your org just needs light adaptation:
- preserve the core contract
- keep your changes mostly in examples, docs, and export defaults

## Release Checklist For A Customized Variant

- version bumped in `package.json`
- README updated with your org-specific scope
- examples reflect your domain
- fixtures updated for changed exports
- `npm run verify` passes
- packaged artifact rebuilt with `npm run package`
