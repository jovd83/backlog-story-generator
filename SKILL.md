---
name: backlog-story-generator
description: Generate structured epics, backlog-ready user stories, and ticket-import story packs from product requirements, discovery notes, workshop outputs, SOPs, existing backlog folders, or an observed codebase. Use when Codex needs to decompose scope into epics, write user stories with Gherkin acceptance criteria, preserve numbering continuity, validate the pack, or export the result to Jira, Azure DevOps, GitHub Issues, or Tulip.
metadata:
  version: 5.3.0
  dispatcher-layer: information
  dispatcher-lifecycle: active
  dispatcher-output-artifacts: epic_pack, story_pack, import_ready_backlog
  dispatcher-risk: medium
  dispatcher-writes-files: true
  dispatcher-input-artifacts: requirements, discovery_notes, backlog_context, numbering_rules
  dispatcher-capabilities: backlog-generation, epic-design, story-export
  dispatcher-stack-tags: planning, backlog, product
  dispatcher-accepted-intents: generate_backlog_stories, generate_epics, export_story_pack
  dispatcher-category: planning
---

## Telemetry & Logging
> [!IMPORTANT]
> All usage of this skill must be logged via the Skill Dispatcher to ensure audit logs and wallboard analytics are accurate:
> `./log-dispatch.cmd --skill <skill_name> --intent <intent> --reason <reason>` (or `./log-dispatch.sh` on Linux)

# Backlog Story Generator

Generate a reviewable backlog pack from messy or incomplete source material without pretending unknown details are known.

Use this skill to turn requirements into:
- epic folders
- one markdown file per user story
- optional import-ready CSV exports
- a short delivery summary with assumptions, gaps, and validation results

## Responsibility

This skill is responsible for:
- shaping epics around business capabilities or workflow boundaries
- writing implementable user stories with observable Gherkin scenarios
- generating technical contracts including Data Models, API specifications, UI flows, and selectively useful diagrams
- preserving traceability to the provided source material
- extending an existing numbered story pack safely
- validating the generated pack before claiming it is ready
- exporting validated story packs into supported backlog-tool CSV formats

This skill is not responsible for:
- inventing product decisions the source material does not support
- silently filling in architecture, APIs, vendors, or frameworks without evidence
- creating implementation plans disguised as user stories
- managing cross-agent shared memory inside this repository

## Supported Inputs

Accept any combination of:
- PRDs, feature briefs, workshop notes, discovery notes, SOPs, or markdown requirements
- existing backlog folders that already contain numbered story files
- a local codebase path when the backlog should be grounded in observed implementation evidence
- export target preferences such as `jira`, `ado`, `github`, or `tulip`

Treat scattered or conflicting inputs as a reason to surface assumptions and open questions, not as permission to fabricate certainty.

## Core Workflow

Follow this sequence unless the user explicitly asks for a narrower task.

1. Ingest the source material.
   Distinguish confirmed requirements, inferred structure, unresolved gaps, and implementation evidence.
2. Ground the work.
   If a codebase path is provided, run:

   ```bash
   node scripts/inspect-codebase-context.js <path-to-codebase>
   ```

   Use only observed files and dependencies as evidence.
3. Inspect any existing pack before adding new stories.
   Find the highest existing story ID and continue numbering from there.
   Never renumber existing stories unless the task is explicitly a migration or normalization.
4. Shape epics.
   Group stories by business capability, workflow boundary, or operational concern.
   Prefer stable business language over team-specific implementation jargon.
5. Draft stories.
   Use [references/user-story-template.md](references/user-story-template.md) as the canonical structure.
   Use [references/naming-convention.md](references/naming-convention.md) for epic folders, IDs, and filenames.
   Use [references/story-drafting-playbook.md](references/story-drafting-playbook.md) when the source material is broad, messy, or likely to produce generic prose.
   Use [references/acceptance-criteria-patterns.md](references/acceptance-criteria-patterns.md) when scenarios start sounding reusable across unrelated stories.
6. Preserve evidence and scope.
   Put business rules, dependencies, non-functional needs, and traceability into the appropriate sections instead of hiding them inside the story statement.
7. Validate before delivery.

   ```bash
   node scripts/validate-stories.js <story-pack-directory>
   ```

   Fix validation failures before presenting the output as ready.
   If the pack is large or the prose quality is uneven, also run:

   ```bash
   node scripts/story-quality-report.js <story-pack-directory>
   ```

   Use the summary to identify repeated weak fields before doing a refinement pass.
   When the pack is structurally valid but still generic, run:

   ```bash
   node scripts/refine-generic-story-pack.js <story-pack-directory>
   ```

   Then rerun validation and the quality checks before calling the pack ready.
   If you want the repository to handle that whole quality-improvement loop in one command, run:

   ```bash
   node scripts/improve-story-pack.js <story-pack-directory> --refine
   ```

   Use `--force-refine` when you intentionally want to reapply deterministic refinements to an already clean pack.
8. Export only from validated markdown source when requested.

   ```bash
   node scripts/export-stories.js <story-pack-directory> <output.csv> <format>
   ```

9. Deliver a concise closeout.
   Report what was created or changed, what was validated, any exports produced, the assumptions made, and any open questions that still need human decisions.

## Gotchas

- A structurally valid pack can still be low quality. Validation catches contract problems; use the quality lint and quality report to catch generic prose.
- Blind runs from messy source material often preserve source noise unless you deliberately normalize duplicated sections, malformed actor phrasing, or mixed-language lines.
- Blind runs and curated benchmark packs may legitimately differ in story count when trailing notes, duplicated sections, or field wishlists are classified differently. Make that decision explicit instead of treating every count change as an error.
- Do not mistake the sandbox output for the skill contract. The markdown pack is a benchmark surface; the real capability is the generation, validation, refinement, and export workflow.
- If acceptance criteria start sounding reusable across unrelated stories, stop and rewrite them before continuing. Generic success-path scaffolding is one of the easiest ways to produce weak backlog output.
- `Context` should explain the capability, the AS-IS state, the TO-BE state, the user gain, and the story's relationship to the rest of the epic and product. It should never describe the prompt, template, reconstruction process, or repository mechanics.
- When the source contains trailing notes, field wishlists, or partial ideas, decide explicitly whether they belong in stories, epic notes, or open questions. Do not let them drift into the pack by accident.

## Story Authoring Rules

- Write one markdown file per story.
- Use globally sequential `US-###` identifiers unless the repository already establishes a different convention.
- Keep story titles action-oriented and specific.
- Use concrete actors in the `As a` clause whenever possible.
- Make the `So that` clause express business value or operational outcome.
- Do not restate the epic name or say the capability is merely "available in the platform" as the value statement.
- Write `Context` as a short explanation of what the story is, what it changes from AS-IS to TO-BE, what users gain, and how it fits with the rest of the epic and product. Do not describe the prompt, repository, template, or reconstruction process there.
- Write acceptance criteria as observable `Given / When / Then` scenarios.
- Cover Happy Path, Alternative Flow, and Error/Edge cases in every story.
- Include technical contracts (Data Model, API, UI, and Diagrams) when the source material supports them.
- Treat `Diagrams` as an optional section. Decide whether a diagram materially clarifies the story before adding one, choose a fitting notation such as Mermaid, UML, or BPMN, and include a short explanation of what each diagram shows and why it matters.
- Define a comprehensive testing strategy (Unit, Integration, E2E) and a clear Definition of Done.
- Make each acceptance-criteria scenario specific to the story behavior. Do not use generic fallbacks such as "the platform completes the requested action successfully."
- Draft the story in this order: actor, capability, value, main success path, important failure path, then optional supporting sections.
- Capture negative paths, permission boundaries, and important edge cases when the source material implies them.
- Keep optional sections meaningful. If a section adds no value, mark it `N/A` rather than leaving template residue.
- Prefer `N/A` over generic filler for optional sections like `UX`, `Testing Notes`, or `Implementation Notes`.
- Keep `Source Traceability` explicit. Point to the requirement note, source file, workshop note, or observed code area that justified the story.

## Guardrails

- Do not invent requirements, integrations, frameworks, test tools, or architecture decisions that were not supplied or observed.
- Do not collapse unrelated work into giant placeholder stories just to reduce story count.
- Do not create filler-heavy optional sections.
- Do not use boilerplate prose that could fit any story, especially in `So that`, `Context`, and `Acceptance Criteria`.
- Do not claim a story pack is ready without running validation or clearly stating that validation was not run.
- Do not patch exported CSV by hand and treat it as authoritative. The markdown stories are the source of truth.
- When evidence is thin, label the gap in `Open Questions`, `Scope Notes`, or the delivery summary.

## Output Contract

Default output shape:

```text
stories/
|-- epic-01-example-capability/
|   |-- US-001-first-story.md
|   `-- US-002-second-story.md
`-- epic-02-next-capability/
    `-- US-003-third-story.md
```

Each story must follow the canonical structure in [references/user-story-template.md](references/user-story-template.md).

When useful, also provide:
- an epic overview based on [references/epic-overview-template.md](references/epic-overview-template.md)
- a validation report from `scripts/validate-stories.js`
- a story-pack summary from `scripts/story-pack-report.js`
- a CSV export for the user-requested backlog platform

## Memory Model

Use memory deliberately and keep the boundaries explicit.

### Runtime memory

Use runtime memory for the current task only:
- extracted actors
- provisional epic candidates
- unresolved requirement gaps
- observed numbering continuity
- temporary export or validation results

Do not assume runtime notes become persistent.

### Project or skill memory

Use project-local persistent memory only when it materially helps repeated work inside one repository or one backlog pack.
Examples:
- local naming preferences that are stable for this repository
- confirmed export defaults for this project
- a vetted assumptions ledger that the user wants preserved locally

If you persist project-local memory, keep it auditable and scoped to this repository. Do not silently promote temporary notes.

### Shared memory

Do not implement shared cross-agent memory inside this skill.
If the task truly requires reusable cross-repository conventions, treat shared memory as an external dependency and integrate through a dedicated shared-memory skill or equivalent boundary.

## References To Load As Needed

- [references/user-story-template.md](references/user-story-template.md): canonical story file structure
- [references/naming-convention.md](references/naming-convention.md): epic folder, story ID, and filename rules
- [references/story-pack-structure.md](references/story-pack-structure.md): expected directory layout and derived artifacts
- [references/backlog-quality-checklist.md](references/backlog-quality-checklist.md): ready-for-review checklist
- [references/story-drafting-playbook.md](references/story-drafting-playbook.md): field-by-field drafting guidance for stronger story prose
- [references/acceptance-criteria-patterns.md](references/acceptance-criteria-patterns.md): scenario selection patterns for story-specific Gherkin
- [references/export-guide.md](references/export-guide.md): export behavior and field mappings
- [docs/adapt-for-your-org.md](docs/adapt-for-your-org.md): safe customization guidance
- [docs/story-pack-quality-workflow.md](docs/story-pack-quality-workflow.md): repeatable validation and refinement loop
- [docs/memory-model.md](docs/memory-model.md): repository memory policy and promotion rules

## Tooling

Useful commands:

```bash
node scripts/validate-stories.js <dir>
node scripts/validate-stories.js <dir> --json
node scripts/lint-story-quality.js <dir>
node scripts/story-quality-report.js <dir>
node scripts/refine-generic-story-pack.js <dir>
node scripts/improve-story-pack.js <dir> --refine
node scripts/export-stories.js <dir> <out.csv> jira
node scripts/story-pack-report.js <dir>
node scripts/inspect-codebase-context.js <path>
```

Run validation before export whenever feasible.
Run the story-quality lint when you need confidence that the pack is not merely structurally valid but also free of obvious boilerplate.
Run the story-quality report when the pack is large and you need a concise hotspot summary before refining weak stories.
Run the generic-story refiner when a pack clearly contains reusable boilerplate that should be replaced with story-specific value, context, and scenarios.
Run the improvement workflow when you want validation, reporting, optional refinement, and post-checks in one repeatable step.
