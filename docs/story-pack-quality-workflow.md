# Story Pack Quality Workflow

Use this workflow when a story pack needs to move from "generated" to "review-ready".

The repository supports two modes:
- report-only, when you want to inspect the current pack without changing files
- refine-and-recheck, when you want deterministic cleanup of common boilerplate before human review

## Fastest Path

Run the full workflow in one command:

```bash
node scripts/improve-story-pack.js <stories-dir> --refine
```

What it does:
- checks structural validity
- summarizes semantic quality
- refines the pack if structural validation passes and semantic issues are present
- reruns the checks after refinement
- prints a compact summary with next actions

## Recommended Decision Path

### 1. Validate structure

```bash
node scripts/validate-stories.js <stories-dir>
```

If this fails, fix structural issues first. Do not refine a pack that still has broken headings, malformed metadata, or parser drift.

### 2. Summarize quality hotspots

```bash
node scripts/story-quality-report.js <stories-dir>
```

Use this when the pack is large and you need a quick answer to:
- which fields are weak most often
- how many stories still fail semantic checks
- which stories deserve the first review pass

### 3. Refine deterministic boilerplate

```bash
node scripts/refine-generic-story-pack.js <stories-dir>
```

Use this when the pack is structurally valid but still suffers from:
- weak `So that` clauses
- generic `Context`
- reusable acceptance-criteria scaffolding
- generic `Dependencies`
- boilerplate `UX`, `Testing Notes`, `Open Questions`, or `Implementation Notes`

Use `--force` only when you intentionally want to reapply the deterministic rewrite to an already clean pack.

### 4. Recheck after refinement

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
