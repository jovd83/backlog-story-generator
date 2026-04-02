#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { collectStoryFiles, parseStory } = require("./story-utils");
const { lintStory } = require("./lint-story-quality");

const EPIC_ACTORS = {
  "Core Platform Architecture": "quality engineer",
  "Project Workspace Management": "project administrator",
  "Test Case Management": "tester",
  "Test Organization Structuring": "tester",
  "Manual Test Execution": "tester",
  "Automated Test Execution": "test automation engineer",
  "Test Cycles and Plans": "qa lead",
  "Requirements and Traceability": "qa lead",
  Integrations: "integration engineer",
  "Reporting Dashboards": "qa lead",
  "Import Export Migration": "migration specialist",
  Collaboration: "team member",
  "Configuration Customization": "project administrator",
  "Security Audit Compliance": "security administrator",
  "Performance Scalability": "platform administrator",
  "Administration Maintenance": "platform administrator",
  Querying: "qa lead",
  API: "integration engineer",
  "User Management": "project administrator",
  "Custom Reporting": "qa lead",
  "Confluence Macro": "confluence user",
  "Risk Based Testing": "qa lead",
  "AI Capabilities": "tester",
  Documentation: "project member",
};

function usage() {
  console.error("Usage: node scripts/refine-generic-story-pack.js <input-directory> [--force]");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceLine(content, label, value) {
  const pattern = new RegExp(`^(\\*\\*${escapeRegex(label)}\\*\\*\\s*).+$`, "m");
  return content.replace(pattern, `$1${value}`);
}

function replaceSection(content, heading, body) {
  const pattern = new RegExp(
    `(^## ${escapeRegex(heading)}\\s*$)([\\s\\S]*?)(?=^## |^---\\s*$|(?![\\s\\S]))`,
    "m"
  );

  if (!pattern.test(content)) {
    throw new Error(`Missing section: ${heading}`);
  }

  return content.replace(pattern, `$1\n${body.trim()}\n\n`);
}

function articleFor(word) {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function lowerFirst(value) {
  if (!value) {
    return value;
  }
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function normalizeTerminology(value) {
  if (!value) {
    return value;
  }

  const replacements = [
    [/\bjira\b/gi, "Jira"],
    [/\bconfluence\b/gi, "Confluence"],
    [/\bopenapi\b/gi, "OpenAPI"],
    [/\bswagger\b/gi, "Swagger"],
    [/\bwysiwyg\b/gi, "WYSIWYG"],
    [/\bmarkdown\b/gi, "Markdown"],
    [/\brag\b/gi, "RAG"],
    [/\bllm\b/gi, "LLM"],
    [/\bjunit4\b/gi, "JUnit 4"],
    [/\bjunit5\b/gi, "JUnit 5"],
    [/\bjunit 4\b/gi, "JUnit 4"],
    [/\bjunit 5\b/gi, "JUnit 5"],
    [/\bgitlab ci\b/gi, "GitLab CI"],
    [/\bjenkins\b/gi, "Jenkins"],
    [/\bcypress\b/gi, "Cypress"],
    [/\bplaywright\b/gi, "Playwright"],
    [/\bselenium\b/gi, "Selenium"],
    [/\bcucumber\b/gi, "Cucumber"],
    [/\bpostman\b/gi, "Postman"],
    [/\bapi\b/g, "API"],
    [/\bci\/cd\b/gi, "CI/CD"],
  ];

  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

function humanizeSubject(value) {
  return normalizeTerminology(String(value || "").trim().toLowerCase());
}

function titleToCapabilityPhrase(title, fallback) {
  const normalizedTitle = normalizeTerminology(title.trim());
  const normalizedFallback = normalizeTerminology(fallback.replace(/^to\s+/i, "").trim());

  const explicitPatterns = [
    [/^Rich Text Editing with (.+)$/i, (_, detail) => `edit rich text with ${humanizeSubject(detail)}`],
    [/^(.+) Detection$/i, (_, subject) => `detect ${humanizeSubject(subject)}`],
    [/^(.+) Monitoring$/i, (_, subject) => `monitor ${humanizeSubject(subject)}`],
    [/^(.+) Analysis$/i, (_, subject) => `analyze ${humanizeSubject(subject)}`],
    [/^Consult (.+)$/i, (_, subject) => `review ${humanizeSubject(subject)}`],
    [/^View (.+)$/i, (_, subject) => `view ${humanizeSubject(subject)}`],
    [/^See (.+)$/i, (_, subject) => `view ${humanizeSubject(subject)}`],
    [/^List (.+)$/i, (_, subject) => `list ${humanizeSubject(subject)}`],
    [/^Show (.+)$/i, (_, subject) => `show ${humanizeSubject(subject)}`],
    [/^Create (.+)$/i, (_, subject) => `create ${humanizeSubject(subject)}`],
    [/^Link (.+)$/i, (_, subject) => `link ${humanizeSubject(subject)}`],
    [/^Import (.+)$/i, (_, subject) => `import ${humanizeSubject(subject)}`],
    [/^Update (.+)$/i, (_, subject) => `update ${humanizeSubject(subject)}`],
    [/^Assign (.+)$/i, (_, subject) => `assign ${humanizeSubject(subject)}`],
    [/^Delete (.+)$/i, (_, subject) => `delete ${humanizeSubject(subject)}`],
    [/^Copy (.+)$/i, (_, subject) => `copy ${humanizeSubject(subject)}`],
    [/^Restore (.+)$/i, (_, subject) => `restore ${humanizeSubject(subject)}`],
    [/^Tag (.+)$/i, (_, subject) => `tag ${humanizeSubject(subject)}`],
    [/^Print (.+)$/i, (_, subject) => `print ${humanizeSubject(subject)}`],
    [/^Reprint (.+)$/i, (_, subject) => `reprint ${humanizeSubject(subject)}`],
    [/^Use (.+)$/i, (_, subject) => `use ${humanizeSubject(subject)}`],
    [/^Generate (.+)$/i, (_, subject) => `generate ${humanizeSubject(subject)}`],
    [/^Perform (.+)$/i, (_, subject) => `perform ${humanizeSubject(subject)}`],
  ];

  for (const [pattern, builder] of explicitPatterns) {
    const match = normalizedTitle.match(pattern);
    if (match) {
      return builder(...match);
    }
  }

  if (/^have\s+/i.test(normalizedFallback)) {
    return normalizedFallback.replace(/^have\s+/i, "use ");
  }

  return normalizedFallback || lowerFirst(normalizedTitle);
}

function capabilityPhrase(story) {
  return titleToCapabilityPhrase(story.title, story.userStory.iWant);
}

function objectLabel(story, capability, type) {
  const title = story.title.toLowerCase();

  if (/link test cases to requirements/.test(title)) return "requirement links";
  if (/import results from/.test(title)) return "automation execution results";
  if (/openapi documentation|swagger viewer/.test(title)) return "OpenAPI documentation";
  if (/rich text editing/.test(title)) return "rich-text test content";
  if (/manual test cases/.test(title)) return "manual test cases";
  if (/rag|llm/.test(title)) return "repository-grounded AI answers";

  const stripped = capability
    .replace(/^(create|view|show|see|list|search|filter|query|add|attach|version|compare|restore|tag|reuse|link|delete|copy|select|execute|mark|pause|resume|re-run|send|store|assign|clone|book|cancel|update|record|print|reprint|support|save|archive|access|use|consult|review|choose|take|generate|perform|edit|detect|monitor|analyze)\s+/i, "")
    .trim();

  if (stripped) {
    return stripped;
  }

  return type === "workflow" ? "workflow state" : lowerFirst(normalizeTerminology(story.title));
}

function inferActor(story) {
  const currentActor = story.userStory.asA.trim();
  if (currentActor && !/^(user|system)$/i.test(currentActor)) {
    return currentActor;
  }

  const title = story.title.toLowerCase();

  if (/requirements/.test(title) && /test cases/.test(title)) {
    return "qa lead";
  }
  if (/openapi|swagger|public api/.test(title)) {
    return "integration engineer";
  }

  if (/jira|confluence|jenkins|gitlab|webhook|oauth|api|swagger|openapi|plugin/.test(title)) {
    return "integration engineer";
  }
  if (/role|permission|sso|audit|gdpr|security/.test(title)) {
    return "project administrator";
  }
  if (/dashboard|report|trend|matrix|coverage|query|search|filter/.test(title)) {
    return "qa lead";
  }
  if (/automation|cypress|playwright|selenium|junit|pipeline|ci|automation/.test(title)) {
    return "test automation engineer";
  }
  if (/manual test|test case|suite|collection|execution|cycle|plan/.test(title)) {
    return "tester";
  }

  return EPIC_ACTORS[story.epicFeature] || "project user";
}

function inferType(story) {
  const title = story.title.toLowerCase();
  const capability = capabilityPhrase(story).toLowerCase();
  const text = `${title} ${capability}`;

  if (/rag|llm|ai|vector|snapshot|generate|exploratory testing/.test(text)) return "ai";
  if (/report|dashboard|trend|matrix|indicator|metrics/.test(text)) return "report";
  if (/permission|role|audit|sso|oauth|gdpr|security/.test(text)) return "security";
  if (/performance|fast response|million|horizontal scaling|async|health monitoring|backup/.test(text)) return "platform";
  if (/api|swagger|openapi|webhook|jira|confluence|jenkins|gitlab|integration|import|export|macro/.test(text)) return "integration";
  if (/search|filter|query|list|see|view|show|consult/.test(text)) return "view";
  if (/link|assign|map|sync/.test(text)) return "link";
  if (/delete|archive|remove|revoke/.test(text)) return "remove";
  if (/copy|clone|reuse|restore|template/.test(text)) return "reuse";
  if (/execute|run|pause|resume|mark|record|send|start|cancel|update|book/.test(text)) return "workflow";
  if (/create|add|capture|save|store|attach|tag|version|print|reprint|choose|select/.test(text)) return "manage";
  return "general";
}

function buildOutcome(story, type) {
  const title = story.title.toLowerCase();

  if (/manual test case/.test(title)) {
    return "test coverage can be authored consistently before execution begins";
  }
  if (/rich text editing/.test(title)) {
    return "test steps, notes, and evidence remain readable for authors and reviewers";
  }
  if (/requirements/.test(title) && /link/.test(title)) {
    return "coverage can be traced from requirements to the tests and results that implement them";
  }
  if (/openapi documentation|swagger viewer/.test(title)) {
    return "API consumers can review available endpoints and schemas without leaving TMT";
  }
  if (/import results from/.test(title)) {
    return "automated executions can update project history without manual result transcription";
  }
  if (/rag|llm chat/.test(title)) {
    return "teams can answer repository questions faster without manually searching across project artifacts";
  }
  if (/label/.test(title) && /reprint/.test(title)) {
    return "shipment recovery actions remain traceable when a print attempt fails";
  }
  if (/label/.test(title) && /print/.test(title)) {
    return "warehouse work can move packed orders into shipment without extra manual handoffs";
  }
  if (/risk/.test(title)) {
    return "risk information can influence planning and execution decisions before defects escape";
  }

  switch (type) {
    case "view":
      return "teams can inspect the right project information without rebuilding it manually";
    case "link":
      return "related requirements, tests, and execution records stay connected across the project lifecycle";
    case "remove":
      return "obsolete project data does not confuse active delivery work";
    case "reuse":
      return "teams can reuse proven setup faster instead of recreating the same assets from scratch";
    case "workflow":
      return "execution status and operational progress stay accurate for project decisions";
    case "report":
      return "stakeholders can monitor quality status without relying on manual reporting";
    case "integration":
      return "external tools and teams can exchange project data without manual re-entry";
    case "security":
      return "access and audit evidence remain controlled and reviewable";
    case "platform":
      return "the platform remains reliable as project scale and usage grow";
    case "ai":
      return "teams can accelerate analysis while keeping answers grounded in project knowledge";
    case "manage":
      return "project work can be maintained consistently inside the managed test repository";
    default:
      return "the project workflow can be completed consistently inside TMT";
  }
}

function buildContext(story, capability, outcome) {
  return `This story adds the ability to ${capability} within a TMT project. It matters because ${outcome}.`;
}

function buildSuccessThen(story, type, capability, objectPhrase) {
  const title = story.title.toLowerCase();

  if (/link test cases to requirements/.test(title)) {
    return "the selected test case and requirement are linked and the relationship is visible from the affected records";
  }
  if (/import results from/.test(title)) {
    return "the imported automation results are recorded against the relevant test assets and execution history";
  }
  if (/openapi documentation|swagger viewer/.test(title)) {
    return "the current API operations, schemas, and request details are visible in the Swagger viewer";
  }
  if (/rich text editing/.test(title)) {
    return "the updated rich-text content is saved and remains readable in both editing modes";
  }
  if (/rag|llm/.test(title)) {
    return "the response is returned from project-scoped repository knowledge with relevant supporting context";
  }

  switch (type) {
    case "view":
    case "report":
      return `the relevant ${objectPhrase} is shown for the current project scope`;
    case "link":
      return `the new relationship is saved and visible from the affected project records`;
    case "remove":
      return `the affected ${objectPhrase} is removed from active use in the current project`;
    case "reuse":
      return `the duplicated or reusable ${objectPhrase} is created from the selected source`;
    case "workflow":
      return `the updated ${objectPhrase} state is saved and shown to the user`;
    case "integration":
      return `the ${objectPhrase} flow completes and the project data remains synchronized in the relevant target area`;
    case "security":
      return `the ${objectPhrase} change is applied only within the permitted project scope`;
    case "platform":
      return `the ${objectPhrase} capability is available within the expected project scale and operating boundaries`;
    case "ai":
      return `the response is returned from project-scoped repository knowledge with relevant supporting context`;
    case "manage":
      return `the new or updated ${objectPhrase} is saved inside the current project`;
    default:
      return `the ${objectPhrase} capability is completed for the current project`;
  }
}

function buildThirdScenario(story, type, objectPhrase) {
  const title = story.title.toLowerCase();

  if (/audit|history|version|traceability|link|risk|result|evidence|log/.test(title)) {
    return {
      name: "Traceability and audit evidence",
      given: `the ${objectPhrase} activity affects stored project records`,
      when: `the ${objectPhrase} action completes`,
      then: "the resulting change remains traceable with the affected records and timestamps",
    };
  }

  if (/cross-project|project/.test(title)) {
    return {
      name: "Project scope boundaries are preserved",
      given: `another project contains similar ${objectPhrase}`,
      when: `the user works with ${objectPhrase} in the current project`,
      then: "data from other projects is not exposed or changed unless the story explicitly allows it",
    };
  }

  if (/performance|fast response|million|horizontal scaling|async/.test(title)) {
    return {
      name: "Scale expectations remain visible",
      given: `the project contains a representative volume of ${objectPhrase}`,
      when: `the ${objectPhrase} capability is exercised`,
      then: "the platform stays within the expected response and scalability boundaries for this story",
    };
  }

  if (/rag|llm|ai|vector|generate/.test(title)) {
    return {
      name: "Responses stay grounded in project knowledge",
      given: "the project contains indexed repository artifacts relevant to the question",
      when: "the user requests an answer or generated output from the AI capability",
      then: "the response stays grounded in project-scoped source material instead of unsupported invention",
    };
  }

  if (/jira|confluence|jenkins|gitlab|api|import|export|webhook|macro/.test(title)) {
    return {
      name: "External references remain consistent",
      given: `the ${objectPhrase} workflow exchanges data with an external target`,
      when: "the action completes successfully",
      then: "the relevant identifiers, links, or payload results remain consistent across the connected systems",
    };
  }

  return {
    name: "Project state remains traceable",
    given: `the ${objectPhrase} action changes project data or workflow state`,
    when: "the action succeeds",
    then: "the resulting state remains visible and traceable in the relevant TMT area",
  };
}

function buildAcceptanceCriteria(story, actor, type) {
  const capability = capabilityPhrase(story);
  const objectPhrase = objectLabel(story, capability, type);
  const actorPhrase = `${articleFor(actor)} ${actor}`;
  const successThen = buildSuccessThen(story, type, capability, objectPhrase);
  const third = buildThirdScenario(story, type, objectPhrase);

  return [
    `### Scenario 1: Valid project-scoped ${story.title}`,
    `**Given** ${actorPhrase} is working in a TMT project with the required ${objectPhrase} context`,
    `**When** they ${capability} using valid project data`,
    `**Then** ${successThen}`,
    "",
    `### Scenario 2: Invalid input or insufficient permission`,
    `**Given** the ${objectPhrase} request is missing required data or the user lacks the needed permission`,
    `**When** they attempt to ${capability}`,
    `**Then** the system blocks the change and explains what must be corrected before the workflow can continue`,
    "",
    `### Scenario 3: ${third.name}`,
    `**Given** ${third.given}`,
    `**When** ${third.when}`,
    `**Then** ${third.then}`,
  ].join("\n");
}

function buildDependencies(story, type, capability) {
  const objectPhrase = objectLabel(story, capability, type);

  if (/link test cases to requirements/i.test(story.title)) {
    return "- Requires project-scoped requirement records, test cases, and traceability persistence.";
  }
  if (/import results from/i.test(story.title)) {
    return "- Requires project-scoped ingestion, parsing, and result-mapping support for supported automation frameworks.";
  }
  if (/openapi documentation|swagger viewer/i.test(story.title)) {
    return "- Requires published API documentation and a project-scoped Swagger viewing surface.";
  }
  if (/rich text editing/i.test(story.title)) {
    return "- Requires project-scoped storage and rendering support for Markdown and WYSIWYG editing modes.";
  }
  if (/rag|llm/i.test(story.title)) {
    return "- Requires project-scoped repository content, indexing, and retrieval support for grounded AI responses.";
  }

  if (type === "integration") {
    return `- Requires project-scoped connection, credential, and persistence support for ${objectPhrase}.`;
  }
  if (type === "report" || type === "view") {
    return `- Requires project-scoped retrieval of the data needed to support ${objectPhrase}.`;
  }
  if (type === "security") {
    return `- Requires project-scoped authorization and audit storage for ${objectPhrase}.`;
  }
  if (type === "platform") {
    return `- Requires platform services that can sustain ${objectPhrase} within the stated volume or performance expectations.`;
  }
  if (type === "ai") {
    return `- Requires project-scoped repository content and retrieval support for ${objectPhrase}.`;
  }
  return `- Requires project-scoped authorization and persistence support for ${objectPhrase}.`;
}

function buildUx(story, type) {
  const title = story.title.toLowerCase();

  if (/openapi documentation|swagger viewer/.test(title)) {
    return "- Show API operations, schemas, and request details in a readable browser-based viewer.";
  }
  if (/rich text editing/.test(title)) {
    return "- Let authors switch between Markdown and WYSIWYG editing without losing formatting intent.";
  }
  if (/dashboard|report|trend|matrix|indicator/.test(title)) {
    return "- Make scoped data easy to scan and filter without forcing the user into multiple navigation steps.";
  }
  if (/search|filter|query|list|view|see|show/.test(title)) {
    return "- Keep the result view readable so users can confirm scope and outcome without extra interpretation work.";
  }
  if (/create|edit|update|assign|link|book|cancel|execute|mark|attach|comment|tag|print|reprint/.test(title)) {
    return "- Provide clear validation, success, and failure feedback at the point where the user performs the action.";
  }
  if (type === "integration" || type === "platform" || type === "security") {
    return "N/A";
  }

  return "N/A";
}

function buildTestingNotes(story, type) {
  const title = story.title.toLowerCase();

  if (/import results from/.test(title)) {
    return "- Cover supported framework payload parsing, rejected unsupported input, and result mapping into execution history.";
  }
  if (/openapi documentation|swagger viewer/.test(title)) {
    return "- Cover viewer availability, permission-limited visibility, and refresh behavior when API documentation changes.";
  }
  if (/rich text editing/.test(title)) {
    return "- Cover mode switching, persisted formatting, and validation of rich-text content in both editors.";
  }
  if (type === "ai") {
    return "- Cover grounded responses, missing-source handling, and traceability of generated answers back to project knowledge.";
  }
  if (type === "integration") {
    return "- Cover successful data exchange, invalid external input, and traceability of synchronized records.";
  }
  if (type === "view" || type === "report") {
    return "- Cover scoped retrieval, empty-state behavior, and permission-limited visibility for the displayed data.";
  }
  if (type === "workflow" || type === "manage" || type === "link") {
    return "- Cover the primary success path, validation or permission failures, and persistence of the resulting project state.";
  }
  if (type === "platform") {
    return "- Cover response-time expectations, failure recovery, and representative load for the targeted scale scenario.";
  }
  if (type === "security") {
    return "- Cover permission enforcement, blocked unauthorized changes, and the resulting audit evidence.";
  }

  return "N/A";
}

function buildOpenQuestions(story, type) {
  const title = story.title.toLowerCase();

  if (type === "ai") {
    return "- Which repository artifacts should be considered authoritative sources for grounded answers in this project?";
  }
  if (/import results from/.test(title)) {
    return "- Which automation result formats are mandatory for the first delivery slice, and which can follow later?";
  }
  if (/openapi documentation|swagger viewer/.test(title)) {
    return "- Should the viewer expose only released API versions or also in-progress project endpoints?";
  }

  return "N/A";
}

function buildImplementationNotes(story, type) {
  const title = story.title.toLowerCase();

  if (/import results from/.test(title)) {
    return "- Keep parser adapters separate from execution-history persistence so additional framework formats can be added without rewriting core result handling.";
  }
  if (/openapi documentation|swagger viewer/.test(title)) {
    return "- Keep the documentation publishing path separate from the viewer surface so API versioning can evolve independently.";
  }
  if (/rich text editing/.test(title)) {
    return "- Keep editor-state conversion explicit so Markdown and WYSIWYG rendering do not drift across saves.";
  }
  if (type === "ai") {
    return "- Keep retrieval and answer-generation components project-scoped so repository content does not leak across projects.";
  }
  if (type === "security") {
    return "- Implement permission enforcement and audit capture together so privileged actions cannot bypass traceability.";
  }
  if (type === "platform") {
    return "- Prefer designs that preserve project isolation and operability as throughput or data volume increases.";
  }

  return "N/A";
}

function needsRefinement(story) {
  const issues = lintStory(story);
  return issues.some((issue) =>
    issue.field === "userStory.asA" ||
    issue.field === "userStory.soThat" ||
    issue.field === "context" ||
    issue.field.startsWith("acceptanceCriteria") ||
    issue.field === "dependencies"
  );
}

function refineStoryContent(content, story) {
  const actor = inferActor(story);
  const type = inferType(story);
  const capability = capabilityPhrase(story);
  const outcome = buildOutcome(story, type);
  const context = buildContext(story, capability, outcome);
  const acceptanceCriteria = buildAcceptanceCriteria(story, actor, type);
  const dependencies = buildDependencies(story, type, capability);
  const ux = buildUx(story, type);
  const testingNotes = buildTestingNotes(story, type);
  const openQuestions = buildOpenQuestions(story, type);
  const implementationNotes = buildImplementationNotes(story, type);

  let updated = content;
  updated = replaceLine(updated, "As a", actor);
  updated = replaceLine(updated, "I want", `to ${capability}`);
  updated = replaceLine(updated, "So that", outcome);
  updated = replaceSection(updated, "Context", context);
  updated = replaceSection(updated, "Acceptance Criteria", acceptanceCriteria);
  updated = replaceSection(updated, "Dependencies", dependencies);
  updated = replaceSection(updated, "UX", ux);
  updated = replaceSection(updated, "Testing Notes", testingNotes);
  updated = replaceSection(updated, "Open Questions", openQuestions);
  updated = replaceSection(updated, "Implementation Notes", implementationNotes);
  return updated;
}

function refineStoryFile(filePath, options = {}) {
  const story = parseStory(filePath);
  if (!story || (!options.force && !needsRefinement(story))) {
    return false;
  }

  const original = fs.readFileSync(filePath, "utf8");
  const updated = refineStoryContent(original, story);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, "utf8");
    return true;
  }

  return false;
}

function refineStoryPack(inputDir, options = {}) {
  const files = collectStoryFiles(inputDir);
  let updatedCount = 0;

  for (const filePath of files) {
    if (refineStoryFile(filePath, options)) {
      updatedCount += 1;
    }
  }

  return { inputDir, updatedCount };
}

function main() {
  const args = process.argv.slice(2);
  const inputDir = args.find((arg) => !arg.startsWith("--"));
  const force = args.includes("--force");
  if (!inputDir) {
    usage();
    process.exit(1);
  }

  try {
    const result = refineStoryPack(inputDir, { force });
    console.log(`Refined ${result.updatedCount} story file(s) in ${result.inputDir}.`);
  } catch (error) {
    console.error(`Story refinement failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  refineStoryContent,
  refineStoryFile,
  refineStoryPack,
};
