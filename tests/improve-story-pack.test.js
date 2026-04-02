const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const examplesDir = path.join(repoRoot, "examples", "generated");

const { improveStoryPack, formatResult } = require("../scripts/improve-story-pack");

test("reports a clean example pack without refinement", () => {
  const result = improveStoryPack(examplesDir, { refine: false, forceRefine: false });
  assert.equal(result.before.validationValid, true);
  assert.equal(result.before.qualityValid, true);
  assert.equal(result.refinedCount, 0);
  assert.equal(result.after.validationValid, true);
  assert.equal(result.after.qualityValid, true);

  const formatted = formatResult(result, { refine: false });
  assert.match(formatted, /Validation after: pass/);
  assert.match(formatted, /Quality after: pass/);
});

test("refines a generic pack and reports the improvement result", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "story-improve-"));
  const epicDir = path.join(tempDir, "epic-01-test-case-management");
  fs.mkdirSync(epicDir, { recursive: true });

  const storyPath = path.join(epicDir, "US-014-create-manual-test-cases.md");
  const content = `# User Story: Create Manual Test Cases

**Story ID:** US-014
**Epic/Feature:** Test Case Management
**Priority:** Critical
**Story Points:** 3
**Status:** Proposed

---

## User Story

**As a** user
**I want** to create manual test cases
**So that** the test case management capability is available in TMT with clear project-scoped behavior

---

## Context
This story was reconstructed from the source backlog to express the Create Manual Test Cases capability in the current canonical skill format.

---

## Functional / Business References
- tests/input.md: source epic and raw user story title for US-014

## Acceptance Criteria

### Scenario 1: Primary success path
**Given** a valid TMT project context exists
**When** an authorized user performs the create Manual Test Cases workflow
**Then** the platform completes the requested action successfully

### Scenario 2: Invalid or unauthorized usage
**Given** the action is attempted with invalid input or insufficient permissions
**When** the workflow is submitted
**Then** the platform rejects the request with clear feedback

### Scenario 3: Persistence and traceability
**Given** the workflow changes platform state, execution data, or linked records
**When** the action succeeds
**Then** the resulting state is stored consistently and remains traceable in the relevant TMT area

---

## Business Rules
N/A

## Scope Notes
N/A

## Dependencies
- Cross-cutting platform capabilities such as authentication, project scoping, and audit support may be required depending on implementation depth.

## Non-Functional Notes
N/A

## UX
- Keep the workflow understandable for product, QA, and engineering users.
- Provide explicit success, validation, and failure feedback.
- Use a consistent Angular-based interaction model for user-facing behavior.

## Testing Notes
- Achieve at least 80% unit coverage for impacted core logic.
- Add or update backend, frontend, and end-to-end tests according to the source project guardrails.
- Update Playwright coverage when this story changes user-facing behavior.

## Open Questions
- Are there project-specific rules, data models, or permissions that should narrow this story further before implementation?
- Does this capability require additional decomposition into smaller delivery increments for the target team?

## Source Traceability
- tests/input.md

## Implementation Notes
- Keep implementation compatible with multi-project operation, deployment-mode flexibility, and the repository split expectations described in the source technical notes.
- Use this story as a planning artifact; implementation details should be refined in design and engineering work rather than invented in backlog prose.
`;

  fs.writeFileSync(storyPath, content, "utf8");

  const result = improveStoryPack(tempDir, { refine: true, forceRefine: false });
  assert.equal(result.before.validationValid, true);
  assert.equal(result.before.qualityValid, false);
  assert.equal(result.after.validationValid, true);
  assert.equal(result.after.qualityValid, true);
  assert.ok(result.refinedCount >= 1);

  const formatted = formatResult(result, { refine: true });
  assert.match(formatted, /Refined files:/);
  assert.match(formatted, /Pack is structurally valid and clear of current semantic lint issues/);
});
