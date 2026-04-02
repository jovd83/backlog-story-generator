# Latest Eval Report

Date: 2026-04-02
Skill: `backlog-story-generator`
Version: `5.0.0`

## Eval Method

This file is generated from the current repository state.
It is a repository-grounded coverage report, not a blind execution benchmark.

The report summarizes:
- the current eval prompt catalog
- the live example corpus
- the current automated test surface
- the repository artifacts that support each eval prompt

## Coverage Snapshot

- eval prompts: 7
- example stories: 12
- automated test files: 12
- approximate automated tests: 33
- repository verification command: `npm run verify`
- repo-health command: `npm run check:repo-health`

## Prompt Coverage

### Eval 1: checkout-requirements-to-jira-pack
Status: Supported by current repository artifacts

Expected output:
A coherent checkout epic with multiple markdown story files, observable acceptance criteria, clear priorities, and story files that can be validated and exported to Jira without manual cleanup.

Target capabilities:
- feature decomposition
- epic shaping
- story-pack generation
- jira export readiness

Supporting evidence:
- `SKILL.md` decomposition workflow
- `references/story-drafting-playbook.md`
- `examples/generated/`
- `references/epic-overview-template.md`
- `references/story-pack-structure.md`
- `references/user-story-template.md`
- `scripts/validate-stories.js`
- `scripts/export-stories.js`
- `tests/export-stories.test.js`
- Jira export fixtures in `tests/fixtures/`
- Prompt definition in `evals/evals.json`

Review focus:
- Epic boundaries follow the checkout workflow rather than arbitrary splitting.
- Stories are implementation-ready and small enough to validate independently.
- Acceptance criteria are observable and written in Gherkin-style scenarios.
- No important checkout capability is omitted or invented.
- The closeout reports validation and export activity explicitly.

### Eval 2: analytics-widget-preserves-performance-constraint
Status: Supported by current repository artifacts

Expected output:
A focused story pack for the widget that preserves the under-1-second requirement in acceptance criteria or non-functional notes, stays scoped to the widget workflow, and avoids filler sections.

Target capabilities:
- non-functional requirement preservation
- scope control
- story writing

Supporting evidence:
- `references/backlog-quality-checklist.md`
- `references/story-writing-quality.md`
- quality checks in `scripts/lint-story-quality.js`
- `references/story-drafting-playbook.md`
- semantic linting in `scripts/lint-story-quality.js`
- `scripts/refine-generic-story-pack.js`
- Prompt definition in `evals/evals.json`

Review focus:
- The under-1-second performance expectation is preserved explicitly.
- The output avoids filler-only optional sections.
- Story scope stays focused on the widget and its supporting behavior.
- Non-functional concerns are grounded in the source prompt.

### Eval 3: messy-warehouse-notes-normalized-into-backlog
Status: Supported by current repository artifacts

Expected output:
A structured set of epics and stories that consolidates scattered operational requirements, separates core workflow from permissions and audit concerns, and keeps assumptions explicit.

Target capabilities:
- normalization of scattered input
- epic separation
- assumption handling

Supporting evidence:
- `SKILL.md` source-normalization workflow
- `references/story-drafting-playbook.md`
- `references/epic-overview-template.md`
- `references/story-pack-structure.md`
- `SKILL.md` evidence-vs-assumption guardrails
- `references/backlog-quality-checklist.md`
- Prompt definition in `evals/evals.json`

Review focus:
- Messy source material is normalized into coherent epics.
- Operational workflow, permissions, and audit concerns are separated appropriately.
- Assumptions are surfaced rather than hidden in story prose.
- The backlog is readable by both product and QA audiences.

### Eval 4: extend-existing-pack-without-renumbering
Status: Supported by current repository artifacts

Expected output:
A refined or extended story set that preserves numbering continuity, produces a valid Azure DevOps CSV, and reports duplicate-ID checks, filename alignment, and export verification.

Target capabilities:
- incremental backlog extension
- safe numbering
- ado export readiness

Supporting evidence:
- `scripts/story-pack-report.js`
- `tests/fixtures/existing-pack/`
- `references/naming-convention.md`
- `scripts/validate-stories.js` duplicate and numbering checks
- `scripts/export-stories.js`
- Azure DevOps export assertions in `tests/export-stories.test.js`
- Prompt definition in `evals/evals.json`

Review focus:
- Existing story IDs remain unchanged.
- New story numbering continues from the highest observed story ID.
- Validation steps are reported explicitly before export.
- The final output is ready for Azure DevOps CSV import.

### Eval 5: codebase-grounded-story-pack-without-tech-hallucination
Status: Supported by current repository artifacts

Expected output:
A story pack grounded in inspected code and explicit evidence, with assumptions called out instead of invented implementation details.

Target capabilities:
- codebase inspection
- evidence-grounded decomposition
- technology guardrails

Supporting evidence:
- `scripts/inspect-codebase-context.js`
- `tests/fixtures/codebase/admin-role-app/`
- `SKILL.md` evidence guardrails
- `tests/inspect-codebase-context.test.js`
- `SKILL.md` anti-hallucination rules
- Prompt definition in `evals/evals.json`

Review focus:
- Observed current-state behavior is distinguished from proposed backlog work.
- No unsupported frameworks, APIs, or tools are invented.
- Assumptions and thin-evidence areas are labeled clearly.
- Stories remain actionable despite the guardrails.

### Eval 6: story-value-and-context-are-not-boilerplate
Status: Supported by current repository artifacts

Expected output:
A small story pack whose 'So that' clauses express real business or operational value and whose 'Context' sections explain what each capability is and why it matters in the workflow.

Target capabilities:
- story writing quality
- business value extraction
- context writing

Supporting evidence:
- `references/story-writing-quality.md`
- `scripts/lint-story-quality.js`
- `scripts/refine-generic-story-pack.js`
- `references/story-drafting-playbook.md`
- quality checks for weak `So that` clauses in `scripts/lint-story-quality.js`
- `references/user-story-template.md`
- Context-quality checks in `scripts/lint-story-quality.js`
- Prompt definition in `evals/evals.json`

Review focus:
- The 'So that' clauses describe real user, business, or operational value.
- The 'Context' sections explain the capability and why it matters instead of describing the prompt or template.
- The output avoids reusable boilerplate across all stories.

### Eval 7: acceptance-criteria-are-story-specific
Status: Supported by current repository artifacts

Expected output:
A reviewable story pack whose acceptance criteria use story-specific entities, states, and outcomes for both success and failure paths.

Target capabilities:
- acceptance criteria quality
- story specificity
- negative-path coverage

Supporting evidence:
- `references/acceptance-criteria-patterns.md`
- `scripts/lint-story-quality.js`
- `scripts/refine-generic-story-pack.js`
- `references/story-writing-quality.md`
- example scenarios under `examples/generated/`
- Prompt definition in `evals/evals.json`

Review focus:
- Acceptance criteria mention story-specific states and outcomes.
- At least one failure, permission, or edge path is represented where relevant.
- The scenarios do not read like generic placeholders.

## Notes

- This report intentionally avoids claiming a blind pass or fail for each prompt without a fresh execution run.
- Use `npm run verify` for repository checks and then review prompt outputs against the criteria in `evals/evals.json`.
- Regenerate this file with `npm run eval:report` whenever the eval catalog, examples, or test surface changes.

