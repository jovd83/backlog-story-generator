#!/usr/bin/env node
const { collectQualityReport } = require("./lint-story-quality");

function usage() {
  console.error("Usage: node scripts/story-quality-report.js <input-directory> [--json] [--limit <n>]");
}

function toSortedCounts(map) {
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
}

function incrementCount(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function buildQualitySummary(inputDir, options = {}) {
  const limit = Number.isInteger(options.limit) && options.limit > 0 ? options.limit : 10;
  const report = collectQualityReport(inputDir);
  const severityCounts = new Map();
  const fieldCounts = new Map();
  const messageCounts = new Map();

  const stories = report.results.map((result) => {
    const errorCount = result.issues.filter((issue) => issue.severity === "error").length;
    const warningCount = result.issues.filter((issue) => issue.severity === "warning").length;

    for (const issue of result.issues) {
      incrementCount(severityCounts, issue.severity);
      incrementCount(fieldCounts, issue.field);
      incrementCount(messageCounts, issue.message);
    }

    return {
      filePath: result.filePath,
      storyId: result.storyId,
      title: result.title,
      valid: result.valid,
      issueCount: result.issues.length,
      errorCount,
      warningCount,
    };
  });

  const failingStories = stories.filter((story) => !story.valid);
  const passingStories = stories.filter((story) => story.valid);
  const topFailingStories = [...failingStories]
    .sort((left, right) => {
      if (right.errorCount !== left.errorCount) {
        return right.errorCount - left.errorCount;
      }
      if (right.warningCount !== left.warningCount) {
        return right.warningCount - left.warningCount;
      }
      return left.storyId.localeCompare(right.storyId, undefined, { numeric: true });
    })
    .slice(0, limit);

  return {
    inputDir: report.inputDir,
    storiesFound: report.storiesFound,
    valid: report.valid,
    passingStoryCount: passingStories.length,
    failingStoryCount: failingStories.length,
    totalIssueCount: stories.reduce((sum, story) => sum + story.issueCount, 0),
    severityCounts: Object.fromEntries(toSortedCounts(severityCounts).map(({ name, count }) => [name, count])),
    topIssueFields: toSortedCounts(fieldCounts).slice(0, limit),
    topIssueMessages: toSortedCounts(messageCounts).slice(0, limit),
    topFailingStories,
  };
}

function formatQualitySummary(summary) {
  const lines = [
    `Story quality summary for ${summary.inputDir}`,
    `Stories: ${summary.storiesFound}`,
    `Passing: ${summary.passingStoryCount}`,
    `Failing: ${summary.failingStoryCount}`,
    `Issues: ${summary.totalIssueCount}`,
  ];

  if (summary.severityCounts.error != null || summary.severityCounts.warning != null) {
    lines.push(
      `Errors: ${summary.severityCounts.error || 0}`,
      `Warnings: ${summary.severityCounts.warning || 0}`
    );
  }

  if (summary.topIssueFields.length > 0) {
    lines.push("", "Most common issue fields:");
    for (const field of summary.topIssueFields) {
      lines.push(`- ${field.name}: ${field.count}`);
    }
  }

  if (summary.topIssueMessages.length > 0) {
    lines.push("", "Most common issue messages:");
    for (const issue of summary.topIssueMessages) {
      lines.push(`- ${issue.name} (${issue.count})`);
    }
  }

  if (summary.topFailingStories.length > 0) {
    lines.push("", "Stories with the most issues:");
    for (const story of summary.topFailingStories) {
      lines.push(
        `- ${story.storyId} ${story.title}: ${story.issueCount} issues (${story.errorCount} errors, ${story.warningCount} warnings)`
      );
    }
  }

  return `${lines.join("\n")}\n`;
}

function parseArgs(args) {
  const inputDir = args.find((arg) => !arg.startsWith("--"));
  const jsonMode = args.includes("--json");
  const limitIndex = args.indexOf("--limit");
  const limit = limitIndex >= 0 ? Number.parseInt(args[limitIndex + 1], 10) : undefined;
  return { inputDir, jsonMode, limit };
}

function main() {
  const { inputDir, jsonMode, limit } = parseArgs(process.argv.slice(2));

  if (!inputDir) {
    usage();
    process.exit(1);
  }

  try {
    const summary = buildQualitySummary(inputDir, { limit });
    if (summary.storiesFound === 0) {
      throw new Error("No story markdown files found.");
    }

    if (jsonMode) {
      console.log(JSON.stringify(summary, null, 2));
    } else {
      process.stdout.write(formatQualitySummary(summary));
    }

    process.exit(summary.valid ? 0 : 1);
  } catch (error) {
    if (jsonMode) {
      console.log(JSON.stringify({ valid: false, error: error.message }, null, 2));
    } else {
      console.error(`Story quality report failed: ${error.message}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildQualitySummary,
  formatQualitySummary,
};
