const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { parseStory } = require("../scripts/story-utils");
const { lintStory } = require("../scripts/lint-story-quality");
const { refineStoryPack } = require("../scripts/refine-generic-story-pack");

test("refines a generic story pack into story-specific prose", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "story-refine-"));
  const epicDir = path.join(tempDir, "epic-01-test-case-management");
  fs.mkdirSync(epicDir, { recursive: true });

  const storyPath = path.join(epicDir, "US-014-create-manual-test-cases.md");
  const content = `# User Story: Create Manual Test Cases

**Story ID:** US-014
**Epic/Feature:** Test Case Management
**Priority:** Critical
**Story Points:** 3
**Status:** Proposed

**Detailed Progress:**
- [ ] Functional / Business Analysis

---

## User Story

**As a** user
**I want** to create manual test cases
**So that** the test case management capability is available in TMT with clear project-scoped behavior

---

## Context
This story belongs to the Test Case Management backlog and should keep project scope, traceability, and operability clear while TMT grows.

---

## Functional / Business References
- tests/input.md: source epic and raw user story title for US-014

## Acceptance Criteria

### Scenario 1: Primary success path
**Given** a valid TMT project context exists
**When** an authorized user performs the create Manual Test Cases workflow
**Then** the platform completes the requested action successfully

### Scenario 2: Invalid or unauthorized usage
**Given** the action is attempted with invalid input or insufficient permissions
**When** the workflow is submitted
**Then** the platform rejects the request with clear feedback

### Scenario 3: Persistence and traceability
**Given** the workflow changes platform state, execution data, or linked records
**When** the action succeeds
**Then** the resulting state is stored consistently and remains traceable in the relevant TMT area

---

## Business Rules
N/A

## Scope Notes
N/A

## Dependencies
- Cross-cutting platform capabilities such as authentication, project scoping, and audit support may be required depending on implementation depth.

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

  fs.writeFileSync(storyPath, content, "utf8");

  const before = parseStory(storyPath);
  assert.equal(lintStory(before).some((issue) => issue.severity === "error"), true);

  const result = refineStoryPack(tempDir);
  assert.equal(result.updatedCount, 1);

  const after = parseStory(storyPath);
  const issues = lintStory(after);
  assert.equal(issues.some((issue) => issue.severity === "error"), false);
  assert.equal(issues.some((issue) => issue.field === "dependencies"), false);
  assert.equal(after.title, "Create Manual Test Cases");
  assert.equal(after.userStory.asA, "tester");
  assert.equal(after.userStory.iWant, "to create manual test cases");
  assert.match(after.userStory.soThat, /test coverage can be authored consistently/i);
  assert.match(after.context, /ability for tester to create manual test cases/i);
  assert.match(after.context, /Today,/i);
  assert.match(after.context, /With this change,/i);
  assert.match(after.context, /It sits with/i);
  assert.match(after.rawSections.acceptanceCriteria, /resulting state remains visible and traceable/i);
  assert.doesNotMatch(after.rawSections.acceptanceCriteria, /\*\*Given\*\*\s+Given/i);
  assert.match(after.qaTestingStrategy, /primary success path/i);
  assert.equal(after.openQuestions, "N/A");
  assert.equal(after.implementationNotes, "N/A");
});

test("normalizes terminology-heavy story language during refinement", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "story-refine-terms-"));
  const epicDir = path.join(tempDir, "epic-18-api");
  fs.mkdirSync(epicDir, { recursive: true });

  const storyPath = path.join(epicDir, "US-130-consult-openapi-documentation-in-a-swagger-viewer.md");
  const content = `# User Story: Consult OpenAPI Documentation in a Swagger Viewer

**Story ID:** US-130
**Epic/Feature:** API
**Priority:** High
**Story Points:** 2
**Status:** Proposed

---

## User Story

**As a** user
**I want** to consult openapi documentation in a swagger viewer
**So that** the api capability is available in TMT with clear project-scoped behavior

---

## Context
This story belongs to the API backlog and should keep project scope, traceability, and operability clear while TMT grows.

---

## Functional / Business References
- tests/input.md: source epic and raw user story title for US-130

## Acceptance Criteria

### Scenario 1: Primary success path
**Given** a valid TMT project context exists
**When** an authorized user performs the consult openapi documentation in a swagger viewer workflow
**Then** the platform completes the requested action successfully

### Scenario 2: Invalid or unauthorized usage
**Given** the action is attempted with invalid input or insufficient permissions
**When** the workflow is submitted
**Then** the platform rejects the request with clear feedback

### Scenario 3: Persistence and traceability
**Given** the workflow changes platform state, execution data, or linked records
**When** the action succeeds
**Then** the resulting state is stored consistently and remains traceable in the relevant TMT area

---

## Business Rules
N/A

## Scope Notes
N/A

## Dependencies
- Cross-cutting platform capabilities such as authentication, project scoping, and audit support may be required depending on implementation depth.

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

  fs.writeFileSync(storyPath, content, "utf8");

  const result = refineStoryPack(tempDir);
  assert.equal(result.updatedCount, 1);

  const after = parseStory(storyPath);
  assert.equal(after.title, "Review OpenAPI Documentation in a Swagger Viewer");
  assert.equal(after.userStory.asA, "integration engineer");
  assert.equal(after.userStory.iWant, "to review OpenAPI documentation in a Swagger viewer");
  assert.match(after.userStory.soThat, /API consumers can review available endpoints and schemas/i);
  assert.match(after.context, /OpenAPI documentation/i);
  assert.match(after.context, /Today,/i);
  assert.match(after.context, /With this change,/i);
  assert.match(after.context, /It sits with/i);
  assert.match(after.rawSections.acceptanceCriteria, /current API operations, schemas, and request details/i);
  assert.match(after.dependencies, /Swagger viewing surface/i);
  assert.match(after.webAppUiInteraction, /browser-based viewer/i);
  assert.match(after.qaTestingStrategy, /viewer availability/i);
  assert.match(after.openQuestions, /released API versions/i);
  assert.match(after.implementationNotes, /documentation publishing path/i);
});

test("normalizes backlog-style raw titles into action-oriented story titles", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "story-refine-title-"));
  const epicDir = path.join(tempDir, "epic-10-reporting-dashboards");
  fs.mkdirSync(epicDir, { recursive: true });

  const storyPath = path.join(epicDir, "US-091-execution-progress-reports.md");
  const content = `# User Story: As a user, I want execution progress reports

**Story ID:** US-091
**Epic/Feature:** Reporting Dashboards
**Priority:** Medium
**Story Points:** 3
**Status:** Proposed

---

## User Story

**As a** user
**I want** to As a user, I want execution progress reports
**So that** the reporting capability is available in TMT with clear project-scoped behavior

---

## Context
This story belongs to the Reporting Dashboards backlog and should keep project scope, traceability, and operability clear while TMT grows.

---

## Functional / Business References
- tests/input.md: source epic and raw user story title for US-091

## Acceptance Criteria

### Scenario 1: Primary success path
**Given** a valid TMT project context exists
**When** an authorized user performs the reporting workflow
**Then** the platform completes the requested action successfully

---

## Business Rules
N/A

## Scope Notes
N/A

## Dependencies
- Cross-cutting platform capabilities such as authentication, project scoping, and audit support may be required depending on implementation depth.

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

  fs.writeFileSync(storyPath, content, "utf8");

  const result = refineStoryPack(tempDir);
  assert.equal(result.updatedCount, 1);

  const after = parseStory(storyPath);
  assert.equal(after.title, "View Execution Progress Reports");
  assert.equal(after.userStory.asA, "qa lead");
  assert.equal(after.userStory.iWant, "to view execution progress reports");
  assert.match(after.context, /ability for qa lead to view execution progress reports/i);
});
