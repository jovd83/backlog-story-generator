const fs = require("fs");
const path = require("path");

const SECTION_ALIASES = {
  businessRules: ["Business Rules"],
  scopeNotes: ["Scope Notes", "Functional Requirements", "Functional Notes", "UI/UX Requirements", "UI/UX Notes"],
  dependencies: ["Dependencies"],
  nonFunctionalNotes: ["Non-Functional Notes", "Non-Functional Requirements"],
  ux: ["UX", "UX Notes"],
  testingNotes: ["Testing Notes", "Testing Strategy"],
  openQuestions: ["Open Questions"],
  implementationNotes: ["Implementation Notes", "Technical Considerations"],
  sourceTraceability: ["Source Traceability", "Source References"],
  dataModelFields: ["Data Model (Fields)", "Data Model", "Fields"],
  webAppUiInteraction: ["WebApp (UI) Interaction", "UI Interaction", "User Interaction"],
  apiRestContract: ["API (REST) Contract", "API Contract", "REST Contract"],
  functionalRequirements: ["Functional Requirements", "Requirements"],
  nonFunctionalRequirements: ["Non-Functional Requirements"],
  technicalConsiderations: ["Technical Considerations"],
  qaTestingStrategy: ["QA & Testing Strategy", "QA Strategy"],
  unitTests: ["Unit Tests"],
  integrationTests: ["Integration Tests"],
  e2eTests: ["End-to-End Tests", "E2E Tests"],
  regressionSanityTests: ["Regression & Sanity Tests", "Regression Tests", "Sanity Tests"],
  testExecutionPlan: ["Test Execution Plan & Quality Gates", "Test Execution Plan"],
  definitionOfDone: ["Definition of Done (DoD)", "Definition of Done", "DoD"],
};

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n").replace(/\uFEFF/g, "");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readMetadata(content, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = content.match(new RegExp(`^\\*\\*${escapedLabel}:\\*\\*\\s*(.+)$`, "m"));
  return match ? match[1].trim() : "";
}

function readSection(content, heading) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^## ${escapedHeading}\\s*$([\\s\\S]*?)(?=^## |^---\\s*$|(?![\\s\\S]))`, "m");
  const match = content.match(pattern);
  return match ? match[1].trim() : "";
}

function readFirstMatchingSection(content, headings) {
  for (const heading of headings) {
    const value = readSection(content, heading);
    if (value) {
      return value;
    }
  }
  return "";
}

function readAllMatchingSections(content, headings) {
  const presentSections = headings
    .map((heading) => {
      const value = readSection(content, heading);
      if (!value) {
        return null;
      }
      return { heading, value };
    })
    .filter(Boolean);

  if (presentSections.length === 0) {
    return "";
  }

  if (presentSections.length === 1 && presentSections[0].heading === headings[0]) {
    return presentSections[0].value.trim();
  }

  return presentSections
    .map(({ heading, value }) => `### ${heading}\n${value}`)
    .join("\n\n")
    .trim();
}

function isStoryMarkdown(content) {
  return /^# User Story:\s*.+$/m.test(content);
}

function parseUserStorySection(section) {
  return {
    asA: (section.match(/\*\*As a\*\*\s*(.+)$/m) || [null, ""])[1].trim(),
    iWant: (section.match(/\*\*I want\*\*\s*(.+)$/m) || [null, ""])[1].trim(),
    soThat: (section.match(/\*\*So that\*\*\s*(.+)$/m) || [null, ""])[1].trim(),
  };
}

function parseAcceptanceCriteria(section) {
  const scenarios = [];
  const scenarioBlocks = section
    .split(/\n(?=### Scenario )/)
    .map((block) => block.trim())
    .filter(Boolean);

  for (const block of scenarioBlocks) {
    const scenario = (block.match(/^### Scenario \d+:\s*(.+)$/m) || [null, ""])[1].trim();
    const given = (block.match(/\*\*Given\*\*\s*(.+)$/m) || [null, ""])[1].trim();
    const when = (block.match(/\*\*When\*\*\s*(.+)$/m) || [null, ""])[1].trim();
    const then = (block.match(/\*\*Then\*\*\s*(.+)$/m) || [null, ""])[1].trim();
    scenarios.push({ scenario, given, when, then });
  }

  return scenarios;
}

function parseSourceTraceability(section) {
  if (!section) {
    return [];
  }

  const items = section
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  if (items.length > 0) {
    return items;
  }

  return [section.trim()];
}

function buildRawSections(content) {
  const rawSections = {
    userStory: readSection(content, "User Story"),
    acceptanceCriteria: readSection(content, "Acceptance Criteria"),
  };

  for (const [fieldName, headings] of Object.entries(SECTION_ALIASES)) {
    rawSections[fieldName] = readAllMatchingSections(content, headings);
  }

  return rawSections;
}

function parseStory(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const content = normalizeNewlines(raw);

  if (!isStoryMarkdown(content)) {
    return null;
  }

  const titleMatch = content.match(/^# User Story:\s*(.+)$/m);
  const rawSections = buildRawSections(content);

  const story = {
    title: titleMatch ? titleMatch[1].trim() : path.basename(filePath, ".md"),
    storyId: readMetadata(content, "Story ID"),
    epicFeature: readMetadata(content, "Epic/Feature"),
    priority: readMetadata(content, "Priority"),
    storyPoints: readMetadata(content, "Story Points"),
    status: readMetadata(content, "Status"),
    userStory: parseUserStorySection(rawSections.userStory),
    context: readSection(content, "Context"),
    functionalBusinessReferences: readSection(content, "Functional / Business References"),
    acceptanceCriteria: parseAcceptanceCriteria(rawSections.acceptanceCriteria),
    businessRules: readFirstMatchingSection(content, SECTION_ALIASES.businessRules),
    scopeNotes: readAllMatchingSections(content, SECTION_ALIASES.scopeNotes),
    dependencies: readFirstMatchingSection(content, SECTION_ALIASES.dependencies),
    nonFunctionalNotes: readFirstMatchingSection(content, SECTION_ALIASES.nonFunctionalNotes),
    ux: readFirstMatchingSection(content, SECTION_ALIASES.ux),
    testingNotes: readFirstMatchingSection(content, SECTION_ALIASES.testingNotes),
    openQuestions: readFirstMatchingSection(content, SECTION_ALIASES.openQuestions),
    sourceTraceability: parseSourceTraceability(readFirstMatchingSection(content, SECTION_ALIASES.sourceTraceability)),
    implementationNotes: readFirstMatchingSection(content, SECTION_ALIASES.implementationNotes),
    dataModelFields: readFirstMatchingSection(content, SECTION_ALIASES.dataModelFields),
    webAppUiInteraction: readFirstMatchingSection(content, SECTION_ALIASES.webAppUiInteraction),
    apiRestContract: readFirstMatchingSection(content, SECTION_ALIASES.apiRestContract),
    functionalRequirements: readFirstMatchingSection(content, SECTION_ALIASES.functionalRequirements),
    nonFunctionalRequirements: readFirstMatchingSection(content, SECTION_ALIASES.nonFunctionalRequirements),
    technicalConsiderations: readFirstMatchingSection(content, SECTION_ALIASES.technicalConsiderations),
    qaTestingStrategy: readFirstMatchingSection(content, SECTION_ALIASES.qaTestingStrategy),
    unitTests: readFirstMatchingSection(content, SECTION_ALIASES.unitTests),
    integrationTests: readFirstMatchingSection(content, SECTION_ALIASES.integrationTests),
    e2eTests: readFirstMatchingSection(content, SECTION_ALIASES.e2eTests),
    regressionSanityTests: readFirstMatchingSection(content, SECTION_ALIASES.regressionSanityTests),
    testExecutionPlan: readFirstMatchingSection(content, SECTION_ALIASES.testExecutionPlan),
    definitionOfDone: readFirstMatchingSection(content, SECTION_ALIASES.definitionOfDone),
    sourcePath: filePath,
    fileName: path.basename(filePath),
    titleSlug: slugify(titleMatch ? titleMatch[1].trim() : path.basename(filePath, ".md")),
    rawSections,
  };

  return story;
}

function collectStoryFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory not found: ${dir}`);
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectStoryFiles(fullPath, files);
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".md") {
      files.push(fullPath);
    }
  }

  return files;
}

module.exports = {
  SECTION_ALIASES,
  collectStoryFiles,
  isStoryMarkdown,
  normalizeNewlines,
  parseStory,
  readMetadata,
  readSection,
  slugify,
};
