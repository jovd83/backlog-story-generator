#!/usr/bin/env node
/**
 * Export markdown story files into CSV formats for backlog tools.
 * Usage: node scripts/export-stories.js <input-directory> <output-file.csv> [format]
 */
const fs = require("fs");
const path = require("path");
const { collectStoryFiles, parseStory } = require("./story-utils");
const { validateStory } = require("./validate-stories");

const SUPPORTED_FORMATS = new Set(["jira", "ado", "github", "tulip"]);

function usage() {
  console.error("Usage: node scripts/export-stories.js <input-directory> <output-file.csv> [format]");
  console.error("Available formats: jira, ado, github, tulip");
}

function escapeCsv(text) {
  const value = text == null ? "" : String(text);
  return `"${value.replace(/"/g, '""')}"`;
}

function formatSection(title, body) {
  if (!body) {
    return "";
  }
  return `## ${title}\n${body.trim()}`;
}

function formatSourceTraceability(story) {
  if (!story.sourceTraceability || story.sourceTraceability.length === 0) {
    return "";
  }
  return `## Source Traceability\n${story.sourceTraceability.map((item) => `- ${item}`).join("\n")}`;
}

function buildDescription(story, format) {
  const sections = [
    "## User Story",
    `As a ${story.userStory.asA}`,
    `I want ${story.userStory.iWant}`,
    `So that ${story.userStory.soThat}`,
    "",
    "## Acceptance Criteria",
    ...story.acceptanceCriteria.map((criterion, index) => [
      `### Scenario ${index + 1}: ${criterion.scenario}`,
      `Given ${criterion.given}`,
      `When ${criterion.when}`,
      `Then ${criterion.then}`,
    ].join("\n")),
    formatSection("Business Rules", story.businessRules),
    formatSection("Scope Notes", story.scopeNotes),
    formatSection("Dependencies", story.dependencies),
    formatSection("Non-Functional Notes", story.nonFunctionalNotes),
    formatSection("Testing Notes", story.testingNotes),
    formatSection("Open Questions", story.openQuestions),
    formatSourceTraceability(story),
  ].filter(Boolean);

  const markdown = sections.join("\n\n").trim();
  if (format === "jira") {
    return markdown
      .replace(/^## /gm, "h3. ")
      .replace(/^### /gm, "h4. ");
  }
  return markdown;
}

function buildAcceptanceCriteriaText(story) {
  return story.acceptanceCriteria
    .map((criterion, index) => [
      `Scenario ${index + 1}: ${criterion.scenario}`,
      `Given ${criterion.given}`,
      `When ${criterion.when}`,
      `Then ${criterion.then}`,
    ].join("\n"))
    .join("\n\n");
}

function collectStories(dir) {
  const files = collectStoryFiles(dir);
  const stories = [];
  const seenIds = new Set();

  for (const filePath of files) {
    const story = parseStory(filePath);
    if (!story) {
      continue;
    }

    const errors = validateStory(story);
    if (seenIds.has(story.storyId)) {
      errors.push(`story.storyId duplicates another story in the export set: ${story.storyId}`);
    } else {
      seenIds.add(story.storyId);
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed for ${filePath}: ${errors.join("; ")}`);
    }

    stories.push({
      IssueType: "Story",
      Title: story.title,
      Id: story.storyId,
      Description: buildDescription(story, "markdown"),
      AcceptanceCriteria: buildAcceptanceCriteriaText(story),
      Priority: story.priority,
      StoryPoints: story.storyPoints,
      EpicLink: story.epicFeature,
      Story: story,
    });
  }

  return stories;
}

function buildRows(stories, format) {
  const rows = [];

  if (format === "ado") {
    rows.push(["Work Item Type", "Title", "Description", "Acceptance Criteria", "Priority", "Story Points", "Tags"]);
    const priorityMap = { Critical: "1", High: "2", Medium: "3", Low: "4" };
    for (const story of stories) {
      rows.push([
        "User Story",
        `[${story.Id}] ${story.Title}`,
        buildDescription(story.Story, "markdown"),
        story.AcceptanceCriteria,
        priorityMap[story.Priority] || "3",
        story.StoryPoints,
        `Epic:${story.EpicLink}`,
      ]);
    }
    return rows;
  }

  if (format === "github") {
    rows.push(["Title", "Body", "Labels"]);
    for (const story of stories) {
      rows.push([
        `[${story.Id}] ${story.Title}`,
        buildDescription(story.Story, "markdown"),
        ["story", story.Priority.toLowerCase()].join(","),
      ]);
    }
    return rows;
  }

  if (format === "tulip") {
    rows.push(["Type", "Story ID", "Name", "Description", "Acceptance Criteria", "Priority", "Epic"]);
    for (const story of stories) {
      rows.push([
        "Story",
        story.Id,
        story.Title,
        buildDescription(story.Story, "markdown"),
        story.AcceptanceCriteria,
        story.Priority,
        story.EpicLink,
      ]);
    }
    return rows;
  }

  rows.push(["Issue Type", "Summary", "Description", "Priority", "Story Points", "Epic Name"]);
  for (const story of stories) {
    rows.push([
      "Story",
      `[${story.Id}] ${story.Title}`,
      buildDescription(story.Story, "jira"),
      story.Priority,
      story.StoryPoints,
      story.EpicLink,
    ]);
  }
  return rows;
}

function writeCsv(rows, outputFile) {
  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, csv);
}

function main() {
  const inputDir = process.argv[2];
  const outputFile = process.argv[3];
  const format = (process.argv[4] || "jira").toLowerCase();

  if (!inputDir || !outputFile) {
    usage();
    process.exit(1);
  }

  if (!SUPPORTED_FORMATS.has(format)) {
    console.error(`Unsupported format: ${format}`);
    usage();
    process.exit(1);
  }

  try {
    const stories = collectStories(inputDir);
    if (stories.length === 0) {
      console.error("No story markdown files found.");
      process.exit(1);
    }

    writeCsv(buildRows(stories, format), outputFile);
    console.log(`Successfully exported ${stories.length} stories to ${outputFile} in '${format}' format.`);
  } catch (error) {
    console.error(`Export failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildDescription,
  buildRows,
  buildAcceptanceCriteriaText,
  collectStories,
};
