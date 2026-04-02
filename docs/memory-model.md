# Memory Model

This repository uses a narrow, auditable memory policy.

## Purpose

Backlog generation often benefits from keeping track of:
- numbering continuity
- accepted naming conventions
- stable export preferences
- confirmed assumptions that the user wants preserved locally

Those needs do not justify mixing runtime notes, project-local memory, and cross-agent shared memory into one vague layer. This repository keeps them separate on purpose.

## Memory Layers

### Runtime Memory

Runtime memory is temporary and task-scoped.

Examples:
- extracted actors and workflows
- provisional epic candidates
- unresolved ambiguity notes
- validation output from the current run
- export target requested in the current conversation

Rules:
- use it freely during the task
- do not assume it becomes persistent
- discard it when the task ends unless the user explicitly asks to preserve something

### Project-Local Memory

Project-local memory is persistent but scoped to one repository, one story pack, or one local fork of the skill.

Examples:
- a repository-specific numbering convention
- agreed custom story sections
- a local assumptions ledger approved by the team
- stable export defaults for one backlog platform

Rules:
- keep it explicit and auditable
- store only information that remains useful across tasks
- prefer small, human-readable files over opaque state
- do not treat project-local memory as shared organizational truth

The [`memory/`](../memory/) directory exists for this purpose when local persistence is helpful.

### Shared Memory

Shared memory is cross-agent or cross-repository infrastructure. It is out of scope for this repository.

If broader reuse is required:
- integrate with an external shared-memory skill or service
- keep the interface explicit
- promote information deliberately, not automatically

## Promotion Rules

- runtime memory must not automatically become persistent
- project-local memory must not automatically become shared memory
- only stable, valuable, and correctly scoped information should be promoted

## Repository Guidance

Use project-local memory here only when it improves repeatability without turning the skill into a stateful black box. When in doubt, keep the decision in the story pack, README, or explicit documentation instead.
