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
