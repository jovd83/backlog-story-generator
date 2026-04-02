const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const exampleStoryPath = path.join(
  repoRoot,
  "examples",
  "generated",
  "epic-03-warehouse-operations",
  "US-021-reprint-label-with-audit-log.md"
);

const { parseStory, slugify } = require("../scripts/story-utils");

test("parses canonical optional sections from example story", () => {
  const story = parseStory(exampleStoryPath);
  assert.equal(story.storyId, "US-021");
  assert.equal(story.titleSlug, "reprint-label-with-audit-log");
  assert.match(story.context, /reprint/i);
  assert.match(story.functionalBusinessReferences, /input-warehouse-operations\.md/);
  assert.match(story.businessRules, /authorized user/);
  assert.equal(typeof story.ux, "string");
  assert.match(story.testingNotes, /audit-record completeness/);
  assert.ok(Array.isArray(story.sourceTraceability));
  assert.equal(story.sourceTraceability[0], "examples/input-warehouse-operations.md");
});

test("slugify creates predictable filenames", () => {
  assert.equal(slugify("Assign and Revoke Roles"), "assign-and-revoke-roles");
});
