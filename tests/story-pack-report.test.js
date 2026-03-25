const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const fixtureDir = path.join(repoRoot, "tests", "fixtures", "existing-pack");

const { buildStoryPackReport } = require("../scripts/story-pack-report");

test("builds a preflight report for an existing numbered pack", () => {
  const report = buildStoryPackReport(fixtureDir);
  assert.equal(report.storyCount, 2);
  assert.equal(report.highestStoryId, "US-102");
  assert.equal(report.nextSuggestedStoryId, "US-103");
  assert.deepEqual(report.storyIds, ["US-101", "US-102"]);
});
