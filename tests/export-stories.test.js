const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const scriptPath = path.join(repoRoot, "scripts", "export-stories.js");
const examplesDir = path.join(repoRoot, "examples", "generated", "epic-01-checkout-experience");
const mixedExamplesDir = path.join(repoRoot, "examples", "generated");
const fixturesDir = path.join(repoRoot, "tests", "fixtures", "exports");

function runExport(format, inputDir = examplesDir) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "story-export-"));
  const outputFile = path.join(tempDir, `stories-${format}.csv`);
  const stdout = execFileSync("node", [scriptPath, inputDir, outputFile, format], {
    encoding: "utf8",
  });
  return {
    outputFile,
    stdout,
    csv: fs.readFileSync(outputFile, "utf8"),
  };
}

function readFixture(name) {
  return fs.readFileSync(path.join(fixturesDir, name), "utf8").trimEnd();
}

test("exports Jira CSV from valid story files", () => {
  const { stdout, csv } = runExport("jira");
  assert.match(stdout, /Successfully exported 2 stories/);
  assert.equal(csv.trimEnd(), readFixture("checkout-jira.csv"));
});

test("exports Azure DevOps CSV with mapped priority", () => {
  const { csv } = runExport("ado");
  assert.equal(csv.trimEnd(), readFixture("checkout-ado.csv"));
});

test("exports GitHub CSV with labels", () => {
  const { csv } = runExport("github");
  assert.equal(csv.trimEnd(), readFixture("checkout-github.csv"));
});

test("exports Tulip CSV from valid story files", () => {
  const { csv } = runExport("tulip");
  assert.equal(csv.trimEnd(), readFixture("checkout-tulip.csv"));
});

test("exports mixed-domain Jira CSV from the full example pack", () => {
  const { stdout, csv } = runExport("jira", mixedExamplesDir);
  assert.match(stdout, /Successfully exported 12 stories/);
  assert.equal(csv.trimEnd(), readFixture("mixed-pack-jira.csv"));
});

test("exports mixed-domain GitHub CSV from the full example pack", () => {
  const { csv } = runExport("github", mixedExamplesDir);
  assert.equal(csv.trimEnd(), readFixture("mixed-pack-github.csv"));
});

test("fails cleanly on unsupported format", () => {
  assert.throws(() => {
    execFileSync("node", [scriptPath, examplesDir, "ignored.csv", "linear"], {
      encoding: "utf8",
      stdio: "pipe",
    });
  }, /Unsupported format: linear/);
});

test("fails export for invalid story files", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "story-export-invalid-"));
  const epicDir = path.join(tempDir, "epic-01-test");
  fs.mkdirSync(epicDir, { recursive: true });

  fs.writeFileSync(path.join(epicDir, "US-999-invalid.md"), `# User Story: Broken\n\n**Story ID:** US-999\n**Epic/Feature:** Test\n**Priority:** High\n**Story Points:** 2\n**Status:** Proposed\n`);

  assert.throws(() => {
    execFileSync("node", [scriptPath, tempDir, path.join(tempDir, "broken.csv"), "jira"], {
      encoding: "utf8",
      stdio: "pipe",
    });
  }, /Validation failed/);
});

test("preserves diagrams in exported descriptions when present", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "story-export-diagrams-"));
  const epicDir = path.join(tempDir, "epic-01-visual-contracts");
  fs.mkdirSync(epicDir, { recursive: true });

  fs.writeFileSync(path.join(epicDir, "US-301-document-approval-flow.md"), `# User Story: Document Approval Flow

**Story ID:** US-301
**Epic/Feature:** Visual Contracts
**Priority:** Medium
**Story Points:** 3
**Status:** Proposed

## User Story
**As a** business analyst
**I want** a story with a useful diagram
**So that** reviewers can understand the approval flow quickly

## Context
This story verifies that optional diagrams remain part of exported story descriptions when authors include them intentionally.

## Functional / Business References
- export test fixture

## Acceptance Criteria
### Scenario 1: Export keeps diagrams
**Given** a story includes a diagrams section
**When** the exporter builds the description
**Then** the diagrams section appears in the exported output

## Diagrams
### Diagram 1: Approval flow
- **Type**: Mermaid
- **Why this is useful**: It clarifies the review and approval sequence.

\`\`\`mermaid
flowchart TD
  A[Draft] --> B[Review] --> C[Approved]
\`\`\`

- **Explanation**: The diagram shows the happy-path approval flow.

## Source Traceability
- tests/export-stories.test.js
`, "utf8");

  const { csv } = runExport("github", tempDir);
  assert.match(csv, /## Diagrams/);
  assert.match(csv, /```mermaid/);
  assert.match(csv, /Approval flow/);
});
