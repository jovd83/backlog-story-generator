#!/usr/bin/env node
const { collectValidationReport } = require("./validate-stories");
const { buildQualitySummary } = require("./story-quality-report");

function usage() {
  console.error("Usage: node scripts/check-story-pack.js <input-directory> [--json]");
}

function buildNextActions(snapshot) {
  const actions = [];

  if (!snapshot.validationValid) {
    actions.push("Fix the structural validation failures first; run validate-stories.js for the per-file errors.");
  }

  if (snapshot.validationValid && !snapshot.qualityValid) {
    actions.push("Rewrite the flagged stories using references/story-drafting-playbook.md and references/acceptance-criteria-patterns.md, then rerun this check.");
  }

  if (snapshot.validationValid && snapshot.qualityValid) {
    actions.push("Pack is structurally valid and clear of current semantic lint issues.");
  }

  return actions;
}

function checkStoryPack(inputDir) {
  const validation = collectValidationReport(inputDir);
  const quality = buildQualitySummary(inputDir);

  const result = {
    inputDir,
    storiesFound: validation.storiesFound,
    validationValid: validation.valid,
    invalidStoryCount: validation.results.filter((entry) => !entry.valid).length,
    qualityValid: quality.valid,
    failingQualityStoryCount: quality.failingStoryCount,
    totalQualityIssues: quality.totalIssueCount,
  };

  result.nextActions = buildNextActions(result);
  return result;
}

function formatResult(result) {
  const lines = [
    `Story pack check for ${result.inputDir}`,
    `Stories: ${result.storiesFound}`,
    `Validation: ${result.validationValid ? "pass" : "fail"} (${result.invalidStoryCount} invalid)`,
    `Quality: ${result.qualityValid ? "pass" : "fail"} (${result.totalQualityIssues} issues in ${result.failingQualityStoryCount} stories)`,
  ];

  if (result.nextActions.length > 0) {
    lines.push("", "Next actions:");
    for (const action of result.nextActions) {
      lines.push(`- ${action}`);
    }
  }

  return `${lines.join("\n")}\n`;
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
    const result = checkStoryPack(inputDir);
    if (jsonMode) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      process.stdout.write(formatResult(result));
    }

    process.exit(result.validationValid && result.qualityValid ? 0 : 1);
  } catch (error) {
    if (jsonMode) {
      console.log(JSON.stringify({ valid: false, error: error.message }, null, 2));
    } else {
      console.error(`Story pack check failed: ${error.message}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkStoryPack,
  formatResult,
};
