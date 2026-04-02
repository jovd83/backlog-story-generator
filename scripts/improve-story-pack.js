#!/usr/bin/env node
const { collectValidationReport } = require("./validate-stories");
const { buildQualitySummary } = require("./story-quality-report");
const { refineStoryPack } = require("./refine-generic-story-pack");

function usage() {
  console.error(
    "Usage: node scripts/improve-story-pack.js <input-directory> [--refine] [--force-refine] [--json]"
  );
}

function buildSnapshot(inputDir) {
  const validation = collectValidationReport(inputDir);
  const quality = buildQualitySummary(inputDir);

  return {
    inputDir,
    storiesFound: validation.storiesFound,
    validationValid: validation.valid,
    invalidStoryCount: validation.results.filter((result) => !result.valid).length,
    qualityValid: quality.valid,
    failingQualityStoryCount: quality.failingStoryCount,
    totalQualityIssues: quality.totalIssueCount,
  };
}

function buildNextActions(before, after, options, refinedCount) {
  const actions = [];

  if (!before.validationValid) {
    actions.push("Fix structural validation failures before attempting automated refinement.");
  }

  if (before.validationValid && !before.qualityValid && !options.refine) {
    actions.push("Rerun with --refine to apply deterministic story-quality improvements.");
  }

  if (options.refine && before.validationValid && refinedCount === 0 && !before.qualityValid) {
    actions.push("No files changed during refinement; inspect the quality report for issues outside the current refiner scope.");
  }

  if (after && !after.validationValid) {
    actions.push("Refinement completed, but structural validation still fails and needs manual correction.");
  }

  if (after && !after.qualityValid) {
    actions.push("Refinement reduced or preserved issues, but manual review is still required for the remaining quality findings.");
  }

  if (after && after.validationValid && after.qualityValid) {
    actions.push("Pack is structurally valid and clear of current semantic lint issues.");
  }

  return actions;
}

function improveStoryPack(inputDir, options = {}) {
  const before = buildSnapshot(inputDir);
  let refinedCount = 0;
  let refined = false;
  let after = before;

  if (options.refine && before.validationValid && (!before.qualityValid || options.forceRefine)) {
    const refinement = refineStoryPack(inputDir, { force: options.forceRefine });
    refinedCount = refinement.updatedCount;
    refined = refinedCount > 0 || options.forceRefine;
    after = buildSnapshot(inputDir);
  }

  const result = {
    inputDir,
    refined,
    refinedCount,
    before,
    after,
  };

  result.nextActions = buildNextActions(before, after, options, refinedCount);
  return result;
}

function formatResult(result, options) {
  const lines = [
    `Story pack improvement summary for ${result.inputDir}`,
    `Stories: ${result.after.storiesFound}`,
    `Validation before: ${result.before.validationValid ? "pass" : "fail"}`,
    `Quality before: ${result.before.qualityValid ? "pass" : "fail"} (${result.before.totalQualityIssues} issues)`,
  ];

  if (options.refine) {
    lines.push(`Refined files: ${result.refinedCount}`);
  }

  lines.push(
    `Validation after: ${result.after.validationValid ? "pass" : "fail"}`,
    `Quality after: ${result.after.qualityValid ? "pass" : "fail"} (${result.after.totalQualityIssues} issues)`
  );

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
  const refine = args.includes("--refine") || args.includes("--force-refine");
  const forceRefine = args.includes("--force-refine");

  if (!inputDir) {
    usage();
    process.exit(1);
  }

  try {
    const result = improveStoryPack(inputDir, { refine, forceRefine });
    if (jsonMode) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      process.stdout.write(formatResult(result, { refine, forceRefine }));
    }

    process.exit(result.after.validationValid && result.after.qualityValid ? 0 : 1);
  } catch (error) {
    if (jsonMode) {
      console.log(JSON.stringify({ valid: false, error: error.message }, null, 2));
    } else {
      console.error(`Story pack improvement failed: ${error.message}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  improveStoryPack,
  formatResult,
};
