---
name: backlog-story-generator
description: Generate structured epics, backlog-ready user stories, and ticket-import packs from requirements, discovery notes, workshops, SOPs, existing backlog folders, or an observed codebase. Use to decompose scope into epics, write user stories with Gherkin acceptance criteria, preserve numbering, validate, or export to Jira, Azure DevOps, GitHub Issues, or Tulip.
metadata:
  author: jovd83
  version: 6.0.0
---

# Backlog Story Generator

> **Version:** 6.0.0

Turn messy or incomplete source material into a reviewable backlog pack: epic folders, one markdown file per user story, and optional CSV exports for backlog tools, without pretending unknown details are known.

Product, engineering, and QA all read the pack. They stop trusting it the moment they spot a detail nobody asked for (an invented endpoint, a coverage target nobody agreed to, a framework the project does not use) or a scenario that could belong to any story. Most of the guidance below exists to prevent those two failures.

## Scope

In scope: shaping epics, writing stories with observable Gherkin scenarios, adding data, API, UI, and diagram detail where the evidence supports it, keeping traceability to the source, extending a numbered pack safely, validating, and exporting to CSV.

Out of scope: inventing product decisions, architecture, vendors, or frameworks the source does not support; implementation plans dressed up as user stories; cross-agent shared memory.

## Where things live

The helper scripts ship inside this skill, in the `scripts/` folder next to this SKILL.md. Call them by that path from wherever you are working, for example `node <skill-dir>/scripts/validate-stories.js ./stories`. They need Node 20+ and nothing from `npm install`.

Write the pack into the user's project, never into the skill directory. Use `./stories/` in the current working directory unless the user names a location or you are extending an existing pack.

## Specialist skills come first

Some parts of a story have dedicated skills that do them better than this skill's references. Before drafting, look at the skills available in your environment (the list your harness shows you). Match them by what they do, not by exact name, because installations differ. When one fits, invoke it for that part. This skill's own reference is the fallback for when no such skill is installed.

| Part of the work | Use a skill that... (example name) | Fallback in this skill |
| --- | --- | --- |
| Acceptance criteria | generates or refines testable acceptance criteria (`acceptance-criteria-designer`) | [references/acceptance-criteria-patterns.md](references/acceptance-criteria-patterns.md) |
| Diagrams | plans and drafts software diagrams (`diagram-generator`) | the Diagrams guidance under [Writing stories](#writing-stories) |
| Grounding in a codebase | builds a context bundle for a repository (`codebase-context`) | `scripts/inspect-codebase-context.js`, plus reading the files |
| Readiness review, only when the user asks whether the pack is testable or ready | reviews requirements for testability and ambiguity (`test-analysis-skill`) | [references/backlog-quality-checklist.md](references/backlog-quality-checklist.md) |

This skill still owns the epic shape, story boundaries, numbering, the file format, the evidence rules, validation, and export. A specialist's output is input to the story, not a replacement for it:

- **Give it the facts, nothing invented.** Pass the story statement, Context, business rules, and the source excerpts behind that story. For acceptance criteria, ask for Gherkin, because stories use Given/When/Then. Its criterion IDs and JSON contract cover one request, so call it once per story. For a large pack, you can delegate the stories with the most rules and risk and write the rest from the patterns. Say which you did in the closeout.
- **Translate the result into the story format.** Each criterion becomes a `### Scenario N: <title>` block with bold `**Given**` / `**When**` / `**Then**` lines. Put extra steps of a clause on `**And**` lines. Its assumptions and coverage gaps go to `Open Questions`, and its out-of-scope items go to `Scope Notes`. A diagram goes into the `Diagrams` section with its title, type, a sentence on why it helps, the code block, and an explanation.
- **Apply the same evidence rules to what comes back.** If it adds an endpoint, UI label, threshold, or rule that the source does not support, drop it or move it to `Open Questions`.
- **Skip delegation when the surrounding workflow already covers that part.** An example is a chain whose next phase runs `acceptance-criteria-designer` on these stories. Write the scenarios from the patterns and let that phase refine them, so the work isn't done twice.

## Workflow

Follow this sequence unless the user asks for a narrower task.

1. **Read the sources.** Separate what the source states, what you are inferring, what is missing, and (for code) what you observed. Conflicting or scattered input is a reason to raise assumptions and open questions, not to fill the gaps with guesses.

2. **Ground in code when a path is given.** If a codebase-context skill is available, run it on the path first. Either way, run:

   ```bash
   node <skill-dir>/scripts/inspect-codebase-context.js <path-to-codebase>
   ```

   The script reports the project type, declared dependencies, and package scripts. It does not read source files, so read the relevant ones yourself. Name only frameworks, endpoints, fields, and test tools you saw in the code or the source. Keep observed current behaviour (AS-IS) apart from proposed work (TO-BE) so reviewers can tell which is which.

3. **Inspect any existing pack before adding to it.** Find the highest story ID and continue from there. Never renumber existing stories unless the task is explicitly a migration. Follow the existing epic numbering and folder style. Run the validator on the pack as you found it, so you know which problems were already there (see [Extending an older pack](#extending-an-older-pack)).

4. **Agree which sections the stories get.** Not every team wants every chapter. The five required sections are always in. Offer the optional ones as the presets from [Section sets](references/user-story-template.md#section-sets). Show each preset with the sections it adds, so the user knows exactly what they are choosing:

   - **Lean:** Business Rules, Scope Notes, Open Questions, Source Traceability
   - **Standard:** Lean plus Dependencies, Non-Functional Notes, UX, Testing Notes
   - **Technical:** Standard plus Data Model, API Contract, Diagrams, Implementation Notes, Definition of Done
   - **Full:** Technical plus a progress checklist, Functional Requirements, Technical Considerations, and separate unit, integration, end-to-end, regression, and test-execution-plan sections

   Recommend **Technical** when a codebase or an API description is part of the input, and **Standard** otherwise. Also let the user name their own mix. Use the harness's question tool if it has one, for example one single-choice question with the four presets, where the user can type a custom list instead. Otherwise ask in plain text. Wait for the answer before drafting.

   Don't ask when the answer is already known:
   - The user already said which sections they want.
   - You are extending a pack. Use the sections its stories already have.
   - Nobody can answer: a non-interactive run, or a step inside a chain. Use the recommended preset and name it in the closeout.

   Leave unchosen sections out of the files entirely, rather than writing them as `N/A`. Record the chosen set in the pack overview (for example `stories/README.md`), so the next run that extends the pack follows it.

5. **Shape epics** around business capabilities, workflow boundaries, or operational concerns, named in stable business language rather than team jargon.

6. **Draft each story** from [references/user-story-template.md](references/user-story-template.md), with names and IDs per [references/naming-convention.md](references/naming-convention.md). Draft in this order: actor, capability, value, main success path, the failure paths that matter, then supporting sections. When the source is broad or messy, use [references/story-drafting-playbook.md](references/story-drafting-playbook.md). Write the acceptance criteria with an acceptance-criteria skill when one is available (see [Specialist skills come first](#specialist-skills-come-first)). Otherwise use [references/acceptance-criteria-patterns.md](references/acceptance-criteria-patterns.md).

7. **Validate, then check quality.**

   ```bash
   node <skill-dir>/scripts/validate-stories.js <pack-dir>
   node <skill-dir>/scripts/lint-story-quality.js <pack-dir>
   ```

   The validator checks structure: metadata values, required sections, parseable scenarios, ID and filename alignment, duplicate IDs, and leftover `[bracketed placeholders]`. The linter flags a short list of known boilerplate phrases. Passing both does not prove the prose is good, so reread a few stories against the self-check below. For large packs, `story-quality-report.js <pack-dir>` lists the weakest fields and stories, and `check-story-pack.js <pack-dir>` runs validation and the quality summary in one step. Fix problems by rewriting the affected stories yourself, then rerun both checks.

8. **Export only from validated markdown, and only when asked.**

   ```bash
   node <skill-dir>/scripts/export-stories.js <pack-dir> <output.csv> <jira|ado|github|tulip>
   ```

   The exporter refuses invalid stories. The markdown is the source of truth: never hand-edit the CSV. Field mappings are in [references/export-guide.md](references/export-guide.md).

9. **Close out** using the format under [Closeout](#closeout).

## Writing stories

- **Actor:** the most specific role the source supports (`warehouse lead`, `shopper`), not `user` or `system`.
- **So that:** the business or operational outcome. Never "so that the capability is available in the platform", and never a restatement of the epic name.
- **Context:** about three sentences: what the story adds, what changes from AS-IS to TO-BE and what users gain, and how it fits with the rest of the epic. Never describe the prompt, template, or generation process.
- **Acceptance criteria:** `### Scenario N: <title>` headings with bold `**Given**` / `**When**` / `**Then**` lines (extra `**And**` lines are fine). The validator parses that exact shape, so do not put scenarios in fenced `gherkin` blocks. Use the story's own nouns, states, and outcomes. Most stories need one success path, one validation, permission, or failure path, and one rule, edge, or audit path. If a story only has two meaningful scenarios, write two: padding to a fixed count makes the real scenarios harder to find.
- **Placement:** business rules, dependencies, non-functional needs, and open decisions go in their own sections, not inside the story statement.
- **Traceability:** `Functional / Business References`, and `Source Traceability` when it is in the set, point at the actual source: the document and section, the workshop note, or the code file.

### Technical and testing sections need evidence

Whatever set was chosen, fill each technical, testing, and quality section only with what the source or the observed code supports:

- **Data Model, API Contract, UX:** only fields, endpoints, auth schemes, and screens that were stated or observed. If the story needs an API that nobody has specified, write `N/A`, add a one-line note, and record the decision in `Open Questions`. An invented endpoint that looks plausible is worse than none, because readers will build against it.
- **Non-functional requirements:** only targets the source gives, such as "the chart loads in under 1 second". Do not add generic ones (page load under 2 s, a WCAG level, "mobile responsive") unless the source asks for them.
- **Testing Notes:** say what this story's tests must prove, derived from its acceptance criteria. Name test frameworks, coverage percentages, CI triggers, or release gates only when the project or source defines them. In a codebase, check `package.json` or equivalent before naming a tool.
- **Definition of Done:** items specific to the story. Add team-wide gates only when the team's own DoD was supplied.

Inside a chosen section, write `N/A` when there is nothing grounded to say. A pack with honest `N/A`s and clear open questions is more useful than one full of confident filler. The template's bracketed text is guidance to replace, and the validator fails on any bracket left behind.

**Diagrams** are optional. Add one only when a flow, state model, or sequence is clearer as a picture than as prose. When a diagram skill is available, ask it for the diagram and embed the code it returns. Otherwise pick a fitting notation yourself (Mermaid, PlantUML, BPMN). In both cases, say in a sentence what the diagram shows.

### Self-check before calling a story done

- Could the `So that` line or any scenario be pasted into a different story unchanged? Then it is too generic.
- Would a QA engineer know what to test from each scenario alone?
- Does every technical detail trace back to the source or the code?
- Is every unresolved decision recorded rather than silently decided? It goes in `Open Questions`, or in the pack overview and closeout when that section isn't in the set.

## Extending an older pack

Existing stories may predate the current template. For example, they may lack `Context` or `Functional / Business References`. The validator and exporter will reject them, and that is not caused by your new stories.

- Do not change existing IDs, filenames, titles, story statements, or acceptance criteria unless the user asks you to.
- Give new stories the same level of detail as the existing ones where the template allows, so the pack reads as one backlog.
- If the user wants the whole pack exported, the smallest fix is to add only the missing required sections to the old stories. Write them from what each story already says, and list every backfilled file in the closeout. If you cannot do that without inventing content, export only the new stories from a staging folder and say why.

## Closeout

End with a short report:

- **Created or changed:** paths, and story IDs per epic. Name any existing file you touched and what you changed in it.
- **Sections:** the section set used, and whether the user chose it or you defaulted to it.
- **Specialist skills used:** which skill handled which part, and for which stories. Write "none" if you used none.
- **Checks:** each command you ran and its actual result. Name any check you skipped.
- **Exports:** path and format.
- **Assumptions:** what you inferred rather than read.
- **Open questions:** decisions a human still has to make.

## Gotchas

- A structurally valid pack can still be weak. Validation catches contract problems. The linter only knows a handful of phrases. No script rewrites stories for you: when a story is weak, rewrite it yourself.
- Messy sources carry noise into the pack unless you normalize it: duplicated sections, malformed actor phrasing, mixed-language lines, trailing wishlists. For each stray note, decide whether it belongs in a story, an epic note, or `Open Questions`, and say so.
- When the user asks to keep the backlog small, keep it small. A few well-bounded stories with clear scope notes beat many thin ones.

## Memory

Keep task notes (actors, candidate epics, gaps, the numbering baseline) in the current session only. Save project-local notes, such as stable naming preferences, export defaults, or an assumptions log, only when the user wants them kept. Keep them auditable and inside that repository. Do not build cross-agent shared memory into this skill. Cross-repository conventions belong in the agent's own memory (CLAUDE.md, AGENTS.md). Details: [docs/memory-model.md](docs/memory-model.md).

## References

- [references/user-story-template.md](references/user-story-template.md): canonical story file structure
- [references/naming-convention.md](references/naming-convention.md): epic folders, story IDs, filenames
- [references/story-drafting-playbook.md](references/story-drafting-playbook.md): field-by-field drafting guidance
- [references/acceptance-criteria-patterns.md](references/acceptance-criteria-patterns.md): scenario patterns by story type
- [references/backlog-quality-checklist.md](references/backlog-quality-checklist.md): ready-for-review checklist
- [references/story-pack-structure.md](references/story-pack-structure.md): directory layout and derived artifacts
- [references/epic-overview-template.md](references/epic-overview-template.md): optional epic summary table
- [references/export-guide.md](references/export-guide.md): export formats and field mappings
- [docs/adapt-for-your-org.md](docs/adapt-for-your-org.md): customizing the template safely
