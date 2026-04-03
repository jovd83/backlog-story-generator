const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const examplesDir = path.join(repoRoot, "examples", "generated");

const { buildQualitySummary, formatQualitySummary } = require("../scripts/story-quality-report");

test("builds a passing quality summary for the curated examples", () => {
  const summary = buildQualitySummary(examplesDir);
  assert.equal(summary.valid, true);
  assert.equal(summary.storiesFound, 12);
  assert.equal(summary.failingStoryCount, 0);
  assert.equal(summary.passingStoryCount, 12);
  assert.equal(summary.totalIssueCount, 0);
});

test("surfaces repeated hotspots for a generic story pack", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "story-quality-report-"));
  const epicDir = path.join(tempDir, "epic-01-test");
  fs.mkdirSync(epicDir, { recursive: true });

  const story = `# User Story: Generic Story

**Story ID:** US-001
**Epic/Feature:** Test Epic
**Priority:** High
**Story Points:** 3
**Status:** Proposed

---

## User Story

**As a** user
**I want** perform a task
**So that** the capability is available in TMT

---

## Context
This story belongs to the Test Epic backlog and should keep project scope, traceability, and operability clear while TMT grows.

---

## Functional / Business References
- tests/input.md: source requirement narrative for Generic Story

## Acceptance Criteria

### Scenario 1: Generic success path
**Given** a valid project context exists
**When** the workflow is submitted
**Then** the platform completes the requested action successfully

---

## Business Rules
N/A

## Scope Notes
N/A

## Dependencies
- cross-cutting platform capabilities

## Non-Functional Notes
N/A

## UX
N/A

## Testing Notes
N/A

## Open Questions
N/A

## Source Traceability
- tests/input.md

## Implementation Notes
N/A
`;

  fs.writeFileSync(path.join(epicDir, "US-001-generic-story.md"), story, "utf8");

  const summary = buildQualitySummary(tempDir);
  assert.equal(summary.valid, false);
  assert.equal(summary.failingStoryCount, 1);
  assert.ok(summary.totalIssueCount >= 4);
  assert.equal(summary.topIssueFields[0].name, "acceptanceCriteria[0]");

  const formatted = formatQualitySummary(summary);
  assert.match(formatted, /Most common issue fields:/);
  assert.match(formatted, /Generic Story/);
});
