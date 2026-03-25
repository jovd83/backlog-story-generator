# Latest Eval Report

Date: 2026-03-25
Skill: `backlog-story-generator`
Version: `3.4.0`

## Eval Method

This pass used the local `skill-creator` style evaluation adapted to the current environment:
- verified the repository contract with `npm run verify`
- reviewed the prompts in `evals/evals.json`
- assessed whether the current skill instructions, examples, tooling, and regression coverage credibly support each prompt

This is a repository-grounded eval pass, not a blind with-skill versus baseline comparison.

## Verification Snapshot

- `npm run verify`: passed
- example stories validated: 12
- automated tests passed: 15
- packaged artifact produced: `dist/backlog-story-generator.skill`

## Prompt Review

### Eval 1: checkout-requirements-to-jira-pack
Status: Pass

Why:
- The checkout domain is directly represented in the example corpus.
- Jira export is covered by fixtures and automated tests.
- The skill contract explicitly requires validation and export reporting.

Confidence: High

### Eval 2: analytics-widget-preserves-performance-constraint
Status: Pass

Why:
- The analytics example preserves the under-1-second expectation in both acceptance criteria and non-functional notes.
- The current skill instructions explicitly tell the model to carry forward non-functional requirements instead of dropping them.

Confidence: High

### Eval 3: messy-warehouse-notes-normalized-into-backlog
Status: Pass

Why:
- The warehouse example separates operational work from audit-sensitive concerns.
- The skill guidance explicitly emphasizes normalization of messy source material and explicit assumptions.

Confidence: High

### Eval 4: extend-existing-pack-without-renumbering
Status: Pass

Why:
- The skill contract, naming convention reference, and validator all reinforce numbering continuity.
- Export readiness is well covered for Azure DevOps.

Confidence: High

### Eval 5: codebase-grounded-story-pack-without-tech-hallucination
Status: Pass

Why:
- The skill instructions now strongly prohibit unsupported framework and tooling invention.
- The response contract explicitly calls for separating observed behavior from assumptions.

Confidence: High

## Overall Assessment

The current repository is in strong shape:
- the skill contract is coherent across docs, schema, parser, validator, exporter, tests, and examples
- export coverage is now meaningful across both focused and mixed-domain packs
- the example corpus is broad enough to support qualitative confidence in the current prompt set

## Remaining Gaps

The previously identified gaps are now covered by:
- `tests/fixtures/existing-pack` plus `scripts/story-pack-report.js`
- `tests/fixtures/codebase/admin-role-app` plus `scripts/inspect-codebase-context.js`

The most likely future improvements are broader, not foundational:
- add another non-Node codebase fixture if you want stronger multi-stack grounding
- add a mutation-style fixture for extending an existing pack and comparing the final export artifact
