const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const scriptPath = path.join(repoRoot, "scripts", "lint-story-quality.js");
const examplesDir = path.join(repoRoot, "examples", "generated");
const { collectQualityReport, lintStory } = require("../scripts/lint-story-quality");
const { parseStory } = require("../scripts/story-utils");

test("quality-lints example stories successfully", () => {
  const stdout = execFileSync("node", [scriptPath, examplesDir], {
    encoding: "utf8",
  });
  assert.match(stdout, /Quality-linted 12 story file\(s\) successfully/);
});

test("emits json quality report", () => {
  const stdout = execFileSync("node", [scriptPath, examplesDir, "--json"], {
    encoding: "utf8",
  });
  const report = JSON.parse(stdout);
  assert.equal(report.valid, true);
  assert.equal(report.storiesFound, 12);
});

test("flags generic generated story prose", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "story-quality-"));
  const epicDir = path.join(tempDir, "epic-01-test");
  fs.mkdirSync(epicDir, { recursive: true });

  const storyText = `# User Story: Generic Story

**Story ID:** US-999
**Epic/Feature:** Generic Epic
**Priority:** High
**Story Points:** 3
**Status:** Proposed

**Detailed Progress:**
- [ ] Functional / Business Analysis

---

## User Story

**As a** user
**I want** to do the thing
**So that** the generic epic capability is available in TMT with clear project-scoped behavior

---

## Context
Generic Story adds support for users who need to do the thing. This matters because the platform needs to make things work. The outcome should be available within the owning TMT project context without relying on manual workarounds outside the system.

---

## Functional / Business References
- source.md

## Acceptance Criteria

### Scenario 1: Primary success path
**Given** a valid TMT project context exists
**When** an authorized user performs the thing workflow
**Then** the platform completes the requested action successfully

---

## Business Rules
- The capability must align with the source scope.

## Scope Notes
- This story intentionally stays at backlog level and does not lock in a specific UI or endpoint design.

## Dependencies
- Cross-cutting platform capabilities such as authentication, project scoping, and audit support may be required depending on implementation depth.

## Non-Functional Notes
- User-facing changes should preserve the web-based experience and support clear operational feedback.

## UX
- Keep the workflow understandable for product, QA, and engineering users.

## Testing Notes
- Update Playwright coverage when this story changes user-facing behavior.

## Open Questions
- Does this capability require additional decomposition into smaller delivery increments for the target team?

## Source Traceability
- source.md

## Implementation Notes
- Use this story as a planning artifact; implementation details should be refined in design and engineering work rather than invented in backlog prose.
`;

  const filePath = path.join(epicDir, "US-999-generic-story.md");
  fs.writeFileSync(filePath, storyText);

  const report = collectQualityReport(tempDir);
  assert.equal(report.valid, false);
  const errorMessages = report.results[0].issues.filter((issue) => issue.severity === "error").map((issue) => issue.message);
  assert.ok(errorMessages.some((message) => message.includes("'So that'")));
  assert.ok(errorMessages.some((message) => message.includes("Context")));
  assert.ok(errorMessages.some((message) => message.includes("Acceptance criteria")));
});

test("can lint a parsed story object directly", () => {
  const story = parseStory(
    path.join(repoRoot, "examples", "generated", "epic-01-checkout-experience", "US-001-capture-shipping-address.md")
  );
  const issues = lintStory(story);
  assert.equal(issues.filter((issue) => issue.severity === "error").length, 0);
});
