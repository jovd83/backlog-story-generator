#!/usr/bin/env node
const { collectStoryFiles, parseStory } = require("./story-utils");

const GENERIC_PATTERNS = {
  soThat: [
    /capability is available in/i,
    /clear project-scoped behavior/i,
    /available in tmt/i,
  ],
  context: [
    /adds support for users who need/i,
    /this matters because the platform needs to/i,
    /without relying on manual workarounds outside the system/i,
    /reconstructed from/i,
    /canonical skill format/i,
  ],
  acceptance: [
    /completes the requested action successfully/i,
    /workflow is submitted/i,
    /valid .* project context exists/i,
    /changes platform state, execution data, or linked records/i,
  ],
  optionalSections: [
    /keep the workflow understandable/i,
    /provide explicit success, validation, and failure feedback/i,
    /use a consistent angular-based interaction model/i,
    /cross-cutting platform capabilities/i,
    /achieve at least 80% unit coverage/i,
    /add or update backend, frontend, and end-to-end tests/i,
    /update playwright coverage/i,
    /are there project-specific rules, data models, or permissions/i,
    /does this capability require additional decomposition/i,
    /keep implementation compatible with multi-project operation/i,
    /implementation details should be refined in design and engineering work/i,
  ],
};

function usage() {
  console.error("Usage: node scripts/lint-story-quality.js <input-directory> [--json]");
}

function makeIssue(severity, field, message) {
  return { severity, field, message };
}

function hasPattern(value, patterns) {
  if (!value) {
    return false;
  }
  return patterns.some((pattern) => pattern.test(value));
}

function lintStory(story) {
  const issues = [];

  if (!story.userStory.asA || /^(user|system)$/i.test(story.userStory.asA.trim())) {
    issues.push(
      makeIssue(
        "warning",
        "userStory.asA",
        "Use a more specific actor when the source material supports one."
      )
    );
  }

  if (hasPattern(story.userStory.soThat, GENERIC_PATTERNS.soThat)) {
    issues.push(
      makeIssue(
        "error",
        "userStory.soThat",
        "The 'So that' clause reads like template boilerplate instead of business or operational value."
      )
    );
  }

  if (hasPattern(story.context, GENERIC_PATTERNS.context)) {
    issues.push(
      makeIssue(
        "error",
        "context",
        "Context should explain what the story is and why it matters, not how the file was generated."
      )
    );
  }

  story.acceptanceCriteria.forEach((criterion, index) => {
    const scenarioText = [criterion.scenario, criterion.given, criterion.when, criterion.then]
      .filter(Boolean)
      .join("\n");

    if (hasPattern(scenarioText, GENERIC_PATTERNS.acceptance)) {
      issues.push(
        makeIssue(
          "error",
          `acceptanceCriteria[${index}]`,
          "Acceptance criteria are too generic; make the scenario specific to the story behavior."
        )
      );
    }
  });

  [
    ["businessRules", story.businessRules],
    ["scopeNotes", story.scopeNotes],
    ["dependencies", story.dependencies],
    ["nonFunctionalNotes", story.nonFunctionalNotes],
    ["ux", story.ux],
    ["testingNotes", story.testingNotes],
    ["openQuestions", story.openQuestions],
    ["implementationNotes", story.implementationNotes],
  ].forEach(([field, value]) => {
    if (hasPattern(value, GENERIC_PATTERNS.optionalSections)) {
      issues.push(
        makeIssue(
          "warning",
          field,
          "This section looks generic and should be made story-specific or replaced with N/A."
        )
      );
    }
  });

  return issues;
}

function collectQualityReport(inputDir) {
  const files = collectStoryFiles(inputDir);
  const results = [];

  for (const filePath of files) {
    const story = parseStory(filePath);
    if (!story) {
      continue;
    }

    const issues = lintStory(story);
    results.push({
      filePath,
      storyId: story.storyId,
      title: story.title,
      valid: issues.every((issue) => issue.severity !== "error"),
      issues,
    });
  }

  return {
    inputDir,
    storiesFound: results.length,
    valid: results.length > 0 && results.every((result) => result.valid),
    results,
  };
}

function main() {
  const args = process.argv.slice(2);
  const inputDir = args.find((arg) => !arg.startsWith("--"));
  const jsonMode = args.includes("--json");

  if (!inputDir) {
    usage();
    process.exit(1);
  }

  try {
    const report = collectQualityReport(inputDir);

    if (report.storiesFound === 0) {
      throw new Error("No story markdown files found.");
    }

    if (jsonMode) {
      console.log(JSON.stringify(report, null, 2));
    } else if (!report.valid) {
      for (const result of report.results.filter((entry) => !entry.valid)) {
        console.error(`Quality lint failed: ${result.filePath}`);
        for (const issue of result.issues) {
          if (issue.severity === "error") {
            console.error(`  - [${issue.field}] ${issue.message}`);
          }
        }
      }
    } else {
      console.log(`Quality-linted ${report.storiesFound} story file(s) successfully.`);
    }

    process.exit(report.valid ? 0 : 1);
  } catch (error) {
    if (jsonMode) {
      console.log(JSON.stringify({ valid: false, error: error.message }, null, 2));
    } else {
      console.error(`Quality lint failed: ${error.message}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  collectQualityReport,
  lintStory,
};
