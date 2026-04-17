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

test("parses optional diagrams sections when present", () => {
  const storyDir = path.join(repoRoot, "tmp", "tests-story-utils-diagrams");
  const storyPath = path.join(storyDir, "US-999-diagram-story.md");
  require("fs").mkdirSync(storyDir, { recursive: true });
  require("fs").writeFileSync(storyPath, `# User Story: Diagram Story

**Story ID:** US-999
**Epic/Feature:** Visual Contracts
**Priority:** Medium
**Story Points:** 3
**Status:** Proposed

## User Story
**As a** product owner
**I want** a diagram-backed story
**So that** the workflow is easier to review

## Context
This story proves the optional diagrams section can be parsed correctly without changing the rest of the contract.

## Functional / Business References
- test fixture

## Acceptance Criteria
### Scenario 1: Diagram is preserved
**Given** a story includes a diagrams section
**When** the parser reads the markdown
**Then** the diagrams content is captured

## Diagrams
### Diagram 1: Approval flow
- **Type**: Mermaid
- **Why this is useful**: It clarifies the approval sequence.

\`\`\`mermaid
flowchart TD
  A[Draft] --> B[Review]
\`\`\`

- **Explanation**: The draft moves to review.

## Source Traceability
- tests/story-utils.test.js
`, "utf8");

  const story = parseStory(storyPath);
  assert.match(story.diagrams, /Approval flow/);
  assert.match(story.diagrams, /```mermaid/);
});
