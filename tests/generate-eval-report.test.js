const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { buildEvalReport, writeEvalReport, checkEvalReport } = require("../scripts/generate-eval-report");

test("builds an eval report from the current repository state", () => {
  const report = buildEvalReport();

  assert.equal(report.metrics.skillName, "backlog-story-generator");
  assert.equal(report.metrics.version, "5.0.0");
  assert.equal(report.metrics.promptCount, 7);
  assert.equal(report.metrics.exampleStoryCount, 12);
  assert.ok(report.metrics.testFileCount >= 12);
  assert.ok(report.metrics.testCaseCount >= 29);
  assert.match(report.markdown, /## Coverage Snapshot/);
  assert.match(report.markdown, /### Eval 6: story-value-and-context-are-not-boilerplate/);
  assert.match(report.markdown, /### Eval 7: acceptance-criteria-are-story-specific/);
});

test("writes the latest eval report to the requested output path", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "eval-report-"));
  const outputPath = path.join(tempDir, "latest-eval-report.md");

  const report = writeEvalReport(outputPath);
  const written = fs.readFileSync(outputPath, "utf8");

  assert.equal(written, report.markdown);
  assert.match(written, /approximate automated tests: \d+/);
  assert.match(written, /Regenerate this file with `npm run eval:report`/);
});

test("reports a freshly generated eval report as current", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "eval-report-current-"));
  const outputPath = path.join(tempDir, "latest-eval-report.md");

  writeEvalReport(outputPath);
  const result = checkEvalReport(outputPath);

  assert.equal(result.valid, true);
  assert.match(result.reason, /Eval report is current:/);
});

test("detects a stale eval report file", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "eval-report-stale-"));
  const outputPath = path.join(tempDir, "latest-eval-report.md");

  fs.writeFileSync(outputPath, "# stale report\n", "utf8");

  const result = checkEvalReport(outputPath);
  assert.equal(result.valid, false);
  assert.match(result.reason, /Eval report is stale:/);
});
