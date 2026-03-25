---
name: backlog-story-generator
description: Generate structured product epics, backlog-ready user stories, and ticket-import story packs from requirements, discovery notes, SOPs, workshop notes, existing backlog files, or a live codebase. Use this skill whenever a user wants to decompose product scope into organized epics, normalize inconsistent stories, continue story numbering safely, validate markdown story packs, or export backlog artifacts to Jira, Azure DevOps, GitHub Issues, or Tulip.
---

# Backlog Story Generator

Create backlog artifacts that product, design, engineering, QA, and delivery teams can act on without a second translation pass.

This skill turns source material into:
- coherent epic breakdowns
- implementation-ready user stories
- markdown story packs
- Gherkin-style acceptance criteria
- validation-ready backlog exports

This skill does not:
- invent unsupported product scope
- act as shared organizational memory
- push tickets into external tools unless the user explicitly asks for that deployment step

## When To Use

Use this skill when the user asks to:
- turn requirements, PRDs, workshops, manuals, SOPs, discovery notes, audit notes, or codebase context into epics and stories
- break a large feature area into backlog-ready increments
- clean up inconsistent story files into one reusable standard
- extend an existing story pack without renumbering what already exists
- validate or export a markdown story directory for Jira, Azure DevOps, GitHub Issues, or Tulip

Do not use this skill when the user only wants:
- light brainstorming without deliverable backlog artifacts
- a one-paragraph feature summary
- a deep system design document rather than a delivery backlog

## Operating Principles

- Ground every story in provided evidence, observed code, or clearly labeled assumptions.
- Prefer a small, coherent backlog over a long list of brittle micro-stories.
- Keep stories independently testable and reviewable.
- Carry forward important constraints such as performance, compliance, permissions, accessibility, and operational dependencies when the source supports them.
- Keep optional sections concise. Use them to reduce ambiguity, not to decorate the file.

## Expected Inputs

Expect one or more of:
- raw requirements, notes, or existing story files
- a codebase or subdirectory to inspect
- a target output directory
- a preferred export target such as `jira`, `ado`, `github`, or `tulip`
- repository conventions that affect IDs, folders, priorities, or story sizing

If information is incomplete:
- make the smallest reasonable assumption set
- label assumptions explicitly
- only interrupt the user when a missing decision would materially change the backlog structure or export target

## Default Deliverables

When working in a writable workspace, produce:
1. An epic breakdown
2. A story pack on disk using the canonical template in `references/user-story-template.md`
3. Validation output from `node scripts/validate-stories.js <stories-dir>`
4. A concise closeout summary covering assumptions, unresolved questions, and validation/export results

When the user requests export, also produce:
5. A CSV file from `node scripts/export-stories.js <stories-dir> <output.csv> [format]`

When the user only wants planning help, provide the same structure in conversation and say what would be written to disk.

## Canonical Story Pack Standard

Follow `references/user-story-template.md` as the source of truth.

Each story file should:
- use a `# User Story:` title heading
- include required metadata fields
- contain one `## User Story` section with `As a / I want / So that`
- contain one `## Acceptance Criteria` section with observable Gherkin-style scenarios
- include optional sections only when they reduce ambiguity or capture material delivery context

Default optional sections:
- `## Business Rules`
- `## Scope Notes`
- `## Dependencies`
- `## Non-Functional Notes`
- `## Testing Notes`
- `## Open Questions`
- `## Source Traceability`
- `## Implementation Notes`

Write `N/A` briefly when a retained section is intentionally empty. Do not leave raw template placeholders behind.

## Workflow

### 1. Read and normalize the source

Extract:
- actors and roles
- business outcomes
- workflow steps
- business rules and constraints
- integrations and dependencies
- quality expectations
- unresolved decisions

If source material is messy, normalize it before drafting stories. Make inference visible instead of implicit.

### 2. Define the epic model

Group work by business capability, workflow boundary, or delivery stream.

Use `references/naming-convention.md` and `references/story-pack-structure.md` to shape:
- epic folder names
- story IDs
- filenames
- output directory layout

If the target directory already contains story files:
- inspect the highest story ID first
- continue numbering without renumbering existing files
- preserve stable conventions unless the user explicitly asks for normalization

### 3. Draft right-sized stories

For each story:
- keep scope small enough to implement, test, and review independently
- make the `So that` clause express real business value
- prefer one primary outcome per story
- split stories when acceptance criteria describe independently releasable behaviors
- record important exclusions, dependencies, and operational notes in optional sections instead of overloading the story statement

Technology guardrail:
- do not guess frameworks, vendors, APIs, or test tools
- only name technology when the user states it or it is clearly present in the inspected codebase
- otherwise use `TBD` or `N/A`

### 4. Validate before you claim readiness

Before finishing:
- confirm story IDs are unique
- confirm filenames begin with the story ID and match the title slug
- confirm required headings and metadata are present
- confirm there are no leftover placeholder tokens such as `[title]` or `[Epic name]`
- run `node scripts/validate-stories.js <stories-dir>`
- if exporting, run `node scripts/export-stories.js <stories-dir> <output.csv> [format]`

If validation or export fails:
- fix the markdown source
- rerun validation
- do not leave the repository in a partially valid state

### 5. Export only when useful

Use CSV export by default.

Treat direct API pushes as a separate deployment action:
- validate credentials first
- dry-run payload structure first
- summarize what was pushed and what was not

Use `references/export-guide.md` for field mapping behavior.

## Guardrails

- Do not fabricate business rules, integrations, compliance requirements, or architectural decisions without support.
- Do not create a huge story list when a smaller set of coherent increments is stronger.
- Do not fill every optional section with boilerplate.
- Do not silently discard important non-functional or operational constraints.
- Do not overwrite existing story files unless the task is explicitly a refinement or regeneration task.
- When code and prose disagree, surface the conflict in the final summary.
- When the source is too thin for confident decomposition, generate the smallest credible draft and mark the uncertainty clearly.

## Response Contract

Close every substantial task with:
1. What was created or changed
2. Validation or export commands run
3. Key assumptions and unresolved questions
4. Any conflicts, risks, or thin-evidence areas

If no files were written, say so explicitly.

## Memory Model

Use memory only where it improves reliability and keeps behavior auditable.

- Runtime memory: current source material, assumptions, numbering choices, and in-flight decomposition decisions for the active task
- Project-local persistent memory: only if the repository already keeps stable backlog conventions or mapping files that must be reused within this skill or target project
- Shared memory: keep outside this repository; integrate through a shared-memory skill or other approved cross-agent boundary when broader reuse is truly needed

Do not automatically promote runtime observations into persistent memory.

## File Map

- `references/user-story-template.md`: canonical story template and section semantics
- `references/naming-convention.md`: story IDs, filenames, and epic folder rules
- `references/story-pack-structure.md`: recommended directory layout and delivery artifacts
- `references/export-guide.md`: export formats, field mappings, and export guidance
- `schemas/story.schema.json`: schema for parsed story documents
- `scripts/story-utils.js`: story parser and shared helpers
- `scripts/validate-stories.js`: validation CLI for story packs
- `scripts/export-stories.js`: markdown-to-CSV exporter
- `scripts/package-skill.js`: local packaging helper
- `evals/evals.json`: realistic evaluation prompts for regression testing

## Quick Commands

```bash
node scripts/validate-stories.js <stories-dir>
node scripts/validate-stories.js <stories-dir> --json
node scripts/export-stories.js <stories-dir> <output.csv> jira
node scripts/export-stories.js <stories-dir> <output.csv> ado
node scripts/export-stories.js <stories-dir> <output.csv> github
node scripts/export-stories.js <stories-dir> <output.csv> tulip
node scripts/package-skill.js
```

## Examples

### Example 1: Requirements to validated Jira-ready pack
Input: "Turn this checkout requirements doc into epics and user stories we can import into Jira."

Expected behavior:
- derive epics from the checkout workflow
- create story files in epic folders
- validate the pack
- export a Jira-ready CSV
- summarize assumptions and unresolved product decisions

### Example 2: Existing codebase to backlog uplift
Input: "Inspect this admin app and create stories for role-management improvements without inventing backend work we do not already have."

Expected behavior:
- inspect the codebase first
- separate observed system behavior from proposed improvements
- draft a focused story pack
- call out evidence gaps and assumptions separately

## Failure Handling

If the source material is too thin:
- generate the smallest trustworthy draft
- keep assumptions explicit
- identify what information is missing for a higher-confidence backlog

If validation or export output is empty, malformed, or unexpectedly sparse:
- inspect headings, metadata, and file naming first
- verify the directory contains real story files
- rerun validation after fixing the markdown source
