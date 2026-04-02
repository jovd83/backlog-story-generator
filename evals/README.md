# Evaluation Notes

The prompts in `evals.json` are intended to exercise the skill across realistic backlog-authoring scenarios:
- greenfield feature decomposition
- preservation of non-functional requirements
- normalization of messy or scattered source material
- extension of an existing story pack without renumbering
- export-readiness and validation discipline
- story-value and context quality
- story-specific acceptance-criteria quality

Refresh the repository-grounded coverage report with:

```bash
npm run eval:report
```

That command regenerates [`latest-eval-report.md`](./latest-eval-report.md) from the current prompt catalog, examples, and automated test surface. It is intentionally a coverage report, not a blind benchmark result.

To confirm the checked-in report is current without rewriting it:

```bash
npm run check:eval-report
```

When reviewing outputs, look for:
- coherent epic boundaries
- right-sized stories
- concrete business value in the story statement
- a `Context` section that explains what the capability is and why it matters
- observable acceptance criteria
- explicit assumptions rather than hidden invention
- safe numbering continuity
- evidence that validation happened before export

Weak outputs usually show up as one or more of:
- overloaded mega-stories
- generic `So that` clauses that restate the epic instead of value
- `Context` sections that describe generation mechanics instead of product behavior
- acceptance criteria that could apply to almost any story
- filler-heavy optional sections
- invented requirements or architecture
- dropped non-functional constraints
- numbering collisions or filename drift
- claims of export readiness without validation evidence

For large packs, summarize semantic lint results before review:

```bash
node scripts/story-quality-report.js <stories-dir>
```

This helps surface repeated weak fields such as generic `So that` clauses or reusable acceptance-criteria scaffolding without forcing reviewers to inspect raw JSON by hand.

When the output is structurally valid but clearly generic, follow with:

```bash
node scripts/refine-generic-story-pack.js <stories-dir>
```

Then rerun validation and the semantic quality checks.
