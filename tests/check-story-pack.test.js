const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const examplesDir = path.join(repoRoot, "examples", "generated");

const { checkStoryPack, formatResult } = require("../scripts/check-story-pack");

test("reports a clean example pack", () => {
  const result = checkStoryPack(examplesDir);
  assert.equal(result.storiesFound, 12);
  assert.equal(result.validationValid, true);
  assert.equal(result.qualityValid, true);

  const formatted = formatResult(result);
  assert.match(formatted, /Validation: pass/);
  assert.match(formatted, /Quality: pass/);
  assert.match(formatted, /Pack is structurally valid and clear of current semantic lint issues/);
});

test("flags a generic pack without changing its files", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "story-check-"));
  const epicDir = path.join(tempDir, "epic-01-invoicing");
  fs.mkdirSync(epicDir, { recursive: true });

  const storyPath = path.join(epicDir, "US-014-create-invoices.md");
  const content = `# User Story: Create Invoices

**Story ID:** US-014
**Epic/Feature:** Invoicing
**Priority:** High
**Story Points:** 3
**Status:** Proposed

---

## User Story

**As a** user
**I want** to create invoices
**So that** the invoicing capability is available in the platform with clear project-scoped behavior

---

## Context
This story belongs to the Invoicing backlog and should keep project scope, traceability, and operability clear as the platform grows.

---

## Functional / Business References
- tests/input.md: source epic for US-014

## Acceptance Criteria

### Scenario 1: Primary success path
**Given** a valid project context exists
**When** an authorized user performs the create invoices workflow
**Then** the platform completes the requested action successfully

---

## Dependencies
- Cross-cutting platform capabilities such as authentication and audit support may be required.

## Source Traceability
- tests/input.md
`;

  fs.writeFileSync(storyPath, content, "utf8");

  const result = checkStoryPack(tempDir);
  assert.equal(result.validationValid, true);
  assert.equal(result.qualityValid, false);
  assert.ok(result.totalQualityIssues >= 3);
  assert.equal(fs.readFileSync(storyPath, "utf8"), content);

  const formatted = formatResult(result);
  assert.match(formatted, /Quality: fail/);
  assert.match(formatted, /Rewrite the flagged stories/);
});
