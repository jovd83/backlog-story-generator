# Story Writing Quality Guide

Use this reference when a story pack is structurally valid but still feels weak, generic, or unreviewable.

## What Strong Stories Look Like

A strong story:
- names a specific actor when the source material supports one
- expresses a concrete user, business, or operational outcome
- explains what the capability is and why it matters
- contains scenarios that are specific to the behavior, not generic workflow placeholders
- keeps optional sections selective and relevant

## Common Failure Modes

Avoid these patterns:
- `So that the <epic> capability is available in the platform`
- `Context` that explains how the file was generated instead of what the feature does
- acceptance criteria like `the platform completes the requested action successfully`
- generic optional sections repeated across every story regardless of story type
- actor labels like `user` or `system` when the source material supports a more specific role

## Better `So that` Clauses

Weak:
- `So that the reporting capability is available in TMT`
- `So that the feature works reliably`

Stronger:
- `So that release stakeholders can see current execution status without asking the QA team manually`
- `So that warehouse recovery actions remain traceable during shipment incidents`
- `So that unsupported shipping destinations are blocked before payment begins`

## Better `Context` Sections

Answer two things:
1. What capability is being added or changed?
2. Why does that capability matter in this domain?

Also make the current and future state visible:
3. What is the AS-IS workflow today?
4. What is the TO-BE workflow after the story lands?
5. How does the story relate to the rest of the epic and the wider product?

Keep it short. Three sentences is usually enough.

Weak:
- `This story was reconstructed from the source backlog`
- `This story belongs to the X domain and should respect the target stack`

Stronger:
- `This story adds the ability to reprint a failed label without creating ambiguity about who performed the recovery action. Today, warehouse teams rely on a slower manual recovery path; with this story, they can restore the shipment flow while keeping audit evidence intact. It complements the other recovery stories in the epic and supports the broader product goal of reliable warehouse operations.`

## Better Acceptance Criteria

Each scenario should mention story-specific entities, states, and outcomes.

Weak:
- `Given a valid project context exists`
- `When the workflow is submitted`
- `Then the platform completes the requested action successfully`

Stronger:
- `Given a shipment label failed during the first print attempt`
- `When an authorized warehouse lead requests a reprint`
- `Then the system issues a new print job for the same order`

## Selective Optional Sections

If a section adds no meaningful information, prefer `N/A`.

Examples:
- `UX`: use only when the story has interaction, responsiveness, or accessibility constraints worth calling out
- `Diagrams`: use only when a UML, BPMN, Mermaid, or similar visual materially clarifies flow, state, ownership, or structure, and include a short explanation for each diagram
- `Testing Notes`: use when there is an important coverage focus, fixture need, or environment concern
- `Implementation Notes`: use only when delivery planning is materially affected by technical context

## Quality Gate

Before calling a pack ready:

```bash
node scripts/validate-stories.js <dir>
node scripts/lint-story-quality.js <dir>
```

The validator checks structure.
The quality lint checks for common semantic boilerplate and weak story-writing patterns.
