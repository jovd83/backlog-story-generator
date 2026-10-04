# Story Pack Quality Workflow

Use this workflow when a story pack needs to move from "generated" to "review-ready".

## Fastest Path

Run validation and the quality summary in one command:

```bash
node scripts/check-story-pack.js <stories-dir>
```

What it does:
- checks structural validity
- summarizes semantic quality
- prints a compact summary with next actions

It never changes files. Rewriting weak stories is a judgment task, so it stays with the author.

## Recommended Decision Path

### 1. Validate structure

```bash
node scripts/validate-stories.js <stories-dir>
```

If this fails, fix structural issues first. Do not polish prose in a pack that still has broken headings, malformed metadata, or parser drift.

### 2. Summarize quality hotspots

```bash
node scripts/story-quality-report.js <stories-dir>
```

Use this when the pack is large and you need a quick answer to:
- which fields are weak most often
- how many stories still fail semantic checks
- which stories deserve the first review pass

### 3. Rewrite the flagged stories

Rewrite the stories the report flags, using [`references/story-drafting-playbook.md`](../references/story-drafting-playbook.md) and [`references/acceptance-criteria-patterns.md`](../references/acceptance-criteria-patterns.md). Typical problems:
- weak `So that` clauses
- generic `Context`
- reusable acceptance-criteria scaffolding
- generic `Dependencies`
- boilerplate `UX`, `Testing Notes`, `Open Questions`, or `Implementation Notes`

### 4. Recheck after rewriting

```bash
node scripts/validate-stories.js <stories-dir>
node scripts/lint-story-quality.js <stories-dir>
node scripts/story-quality-report.js <stories-dir>
```

The goal is not just a passing lint result. The goal is a pack that can survive product, engineering, and QA review without obvious template drift.

## What The Workflow Does Not Replace

This workflow does not replace:
- product judgment about story boundaries
- domain-specific decisions that are missing from the source material
- human review of nuanced business rules
- approval of assumptions and open questions

Use the workflow to remove mechanical weakness so review time is spent on real product decisions instead of template cleanup.

## Export Guidance

Export only after the pack is structurally valid:

```bash
node scripts/export-stories.js <stories-dir> <output.csv> jira
```

Exports intentionally stay focused on backlog-tool-friendly content. Internal planning notes such as `Implementation Notes` are not emitted into the CSV description payload.
