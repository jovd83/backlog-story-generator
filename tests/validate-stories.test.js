const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const { parseStory } = require("../scripts/story-utils");
const { collectValidationReport, validateStory } = require("../scripts/validate-stories");

const repoRoot = path.resolve(__dirname, "..");
const validatorPath = path.join(repoRoot, "scripts", "validate-stories.js");
const examplesDir = path.join(repoRoot, "examples", "generated");

test("validates example stories successfully", () => {
  const stdout = execFileSync("node", [validatorPath, examplesDir], {
    encoding: "utf8",
  });
  assert.match(stdout, /Validated 12 story file\(s\) successfully/);
});

test("emits json validation report", () => {
  const stdout = execFileSync("node", [validatorPath, examplesDir, "--json"], {
    encoding: "utf8",
  });
  const report = JSON.parse(stdout);
  assert.equal(report.valid, true);
  assert.equal(report.storiesFound, 12);
});

test("detects duplicate story ids", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "story-validate-"));
  const epicDir = path.join(tempDir, "epic-01-test");
  fs.mkdirSync(epicDir, { recursive: true });

  const source = fs.readFileSync(
    path.join(examplesDir, "epic-01-checkout-experience", "US-001-capture-shipping-address.md"),
    "utf8"
  );

  fs.writeFileSync(path.join(epicDir, "US-001-capture-shipping-address.md"), source);
  fs.writeFileSync(path.join(epicDir, "US-001-duplicate-story.md"), source.replace("Capture Shipping Address", "Duplicate Story"));

  const report = collectValidationReport(tempDir);
  const duplicateErrors = report.results.flatMap((result) => result.errors).filter((error) => error.includes("duplicates"));
  assert.ok(duplicateErrors.length > 0);
});

test("returns schema and contract errors for malformed story content", () => {
  const story = parseStory(
    path.join(examplesDir, "epic-01-checkout-experience", "US-001-capture-shipping-address.md")
  );
  story.priority = "Urgent";
  story.acceptanceCriteria = [];
  story.fileName = "wrong-name.md";
  story.title = "[Title]";

  const errors = validateStory(story);
  assert.ok(errors.some((error) => error.includes("must be one of")));
  assert.ok(errors.some((error) => error.includes("must contain at least 1 item")));
  assert.ok(errors.some((error) => error.includes("filename")));
  assert.ok(errors.some((error) => error.includes("placeholders")));
});
