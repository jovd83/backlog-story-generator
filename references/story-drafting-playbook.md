# Story Drafting Playbook

Use this guide while drafting stories from source material. It is meant to reduce generic output and make the story content reviewable by product, engineering, and QA.

## Drafting Order

Draft stories in this order:

1. identify the actor
2. identify the capability
3. identify the reason the capability matters
4. identify the main success path
5. identify the most important failure path or edge case
6. identify any notable business rule, dependency, or non-functional constraint

Do not start by filling every optional section. Start from the behavior and add supporting sections only where they are justified by the source material.

## Actor Heuristics

Prefer the most specific actor supported by the source:
- `warehouse lead` is better than `user`
- `shopper` is better than `customer` if the workflow is specifically checkout
- `project lead` is better than `admin` when the capability is project-scoped rather than global

Use broader actors only when the source material truly stays generic.

## Better `So that` Clauses

The `So that` clause should describe value, not platform existence.

Weak:
- `So that the reporting capability is available in the platform`
- `So that the feature works in TMT`
- `So that the epic is supported`

Stronger:
- `So that shipment recovery actions remain traceable`
- `So that unsupported destinations are blocked before payment begins`
- `So that release stakeholders can see current execution status without asking QA manually`

Quick test:
- if you can replace the story title with any other story and the `So that` still sounds plausible, it is probably too generic

## Better `Context`

`Context` should answer:
- what capability is being added or changed?
- why does it matter in this workflow or domain?
- what is the current AS-IS state?
- what is the intended TO-BE state?
- how does this story relate to the other stories in the epic and to the broader product?

Keep it short. Three sentences is usually enough:
1. what the story is
2. what changes from AS-IS to TO-BE and what users gain
3. how it fits with the rest of the epic and the product

Weak:
- talks about the prompt, template, repo, or reconstruction process
- repeats the epic title in abstract terms
- describes the target stack instead of the problem

Stronger:
- `This story adds the ability to reprint a failed label without losing traceability about who initiated the recovery action. Today, warehouse staff have to recover shipments through a slower manual path; with this change, they can restore shipment flow while preserving audit evidence. It sits with the other shipment recovery stories in the epic and supports the broader product need for reliable, auditable warehouse operations.`

## Better Acceptance Criteria

Acceptance criteria should use story-specific nouns, states, and outcomes.

Weak:
- `Given a valid project context exists`
- `When the workflow is submitted`
- `Then the platform completes the requested action successfully`

Stronger:
- `Given a shopper is on the shipping step of checkout`
- `When they leave a required address field blank and continue`
- `Then the form shows a validation error for the missing field`

For most stories, include:
- one primary success path
- one failure, permission, or validation path
- one edge case, business-rule, or audit/traceability path when relevant

## Optional Sections

Use optional sections selectively.

Good reasons to populate them:
- `Business Rules`: the source contains explicit policy, permission, or domain rules
- `Scope Notes`: the story intentionally excludes adjacent behavior
- `Dependencies`: another system, data source, team, or story is a real dependency
- `Non-Functional Notes`: performance, accessibility, security, reliability, or compliance is materially relevant
- `UX`: interaction, feedback, accessibility, or responsiveness matters
- `Testing Notes`: there is a meaningful coverage focus, fixture need, or environment concern
- `Implementation Notes`: delivery planning materially depends on technical context

Otherwise, prefer `N/A`.

## Good Story Smells

Strong stories usually have these traits:
- a specific actor
- a concrete value statement
- story-specific scenarios
- at least one real source reference
- a clear boundary around what is and is not in scope

## Bad Story Smells

Refine the story if you see:
- generic value statements about the platform existing
- context that mentions the generation process
- the same acceptance criteria across many stories with only titles swapped
- optional sections filled with cross-cutting filler that could fit any story
- dependencies that describe the entire platform instead of this story
