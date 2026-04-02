#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

const capabilityEvidence = {
  "feature decomposition": [
    "`SKILL.md` decomposition workflow",
    "`references/story-drafting-playbook.md`",
    "`examples/generated/`",
  ],
  "epic shaping": [
    "`references/epic-overview-template.md`",
    "`references/story-pack-structure.md`",
    "`examples/generated/`",
  ],
  "story-pack generation": [
    "`references/user-story-template.md`",
    "`examples/generated/`",
    "`scripts/validate-stories.js`",
  ],
  "jira export readiness": [
    "`scripts/export-stories.js`",
    "`tests/export-stories.test.js`",
    "Jira export fixtures in `tests/fixtures/`",
  ],
  "non-functional requirement preservation": [
    "`references/backlog-quality-checklist.md`",
    "`references/story-writing-quality.md`",
    "quality checks in `scripts/lint-story-quality.js`",
  ],
  "scope control": [
    "`references/story-drafting-playbook.md`",
    "semantic linting in `scripts/lint-story-quality.js`",
  ],
  "story writing": [
    "`references/story-writing-quality.md`",
    "`scripts/refine-generic-story-pack.js`",
  ],
  "normalization of scattered input": [
    "`SKILL.md` source-normalization workflow",
    "`references/story-drafting-playbook.md`",
  ],
  "epic separation": [
    "`references/epic-overview-template.md`",
    "`references/story-pack-structure.md`",
  ],
  "assumption handling": [
    "`SKILL.md` evidence-vs-assumption guardrails",
    "`references/backlog-quality-checklist.md`",
  ],
  "incremental backlog extension": [
    "`scripts/story-pack-report.js`",
    "`tests/fixtures/existing-pack/`",
  ],
  "safe numbering": [
    "`references/naming-convention.md`",
    "`scripts/validate-stories.js` duplicate and numbering checks",
  ],
  "ado export readiness": [
    "`scripts/export-stories.js`",
    "Azure DevOps export assertions in `tests/export-stories.test.js`",
  ],
  "codebase inspection": [
    "`scripts/inspect-codebase-context.js`",
    "`tests/fixtures/codebase/admin-role-app/`",
  ],
  "evidence-grounded decomposition": [
    "`SKILL.md` evidence guardrails",
    "`tests/inspect-codebase-context.test.js`",
  ],
  "technology guardrails": [
    "`scripts/inspect-codebase-context.js`",
    "`SKILL.md` anti-hallucination rules",
  ],
  "story writing quality": [
    "`references/story-writing-quality.md`",
    "`scripts/lint-story-quality.js`",
    "`scripts/refine-generic-story-pack.js`",
  ],
  "business value extraction": [
    "`references/story-drafting-playbook.md`",
    "quality checks for weak `So that` clauses in `scripts/lint-story-quality.js`",
  ],
  "context writing": [
    "`references/user-story-template.md`",
    "Context-quality checks in `scripts/lint-story-quality.js`",
  ],
  "acceptance criteria quality": [
    "`references/acceptance-criteria-patterns.md`",
    "`scripts/lint-story-quality.js`",
    "`scripts/refine-generic-story-pack.js`",
  ],
  "story specificity": [
    "`references/story-writing-quality.md`",
    "`scripts/refine-generic-story-pack.js`",
  ],
  "negative-path coverage": [
    "`references/acceptance-criteria-patterns.md`",
    "example scenarios under `examples/generated/`",
  ],
};

function listFilesRecursive(dir, filter) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFilesRecursive(fullPath, filter));
    } else if (!filter || filter(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

function countTestCases(testFiles) {
  return testFiles.reduce((sum, filePath) => {
    const text = fs.readFileSync(filePath, "utf8");
    const matches = text.match(/\btest\s*\(/g);
    return sum + (matches ? matches.length : 0);
  }, 0);
}

function unique(items) {
  return Array.from(new Set(items));
}

function buildPromptEvidence(evalDefinition) {
  const evidence = [];
  for (const capability of evalDefinition.target_capabilities || []) {
    const mappedEvidence = capabilityEvidence[capability] || [];
    evidence.push(...mappedEvidence);
  }

  evidence.push("Prompt definition in `evals/evals.json`");
  return unique(evidence);
}

function buildEvalReport(root = repoRoot) {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const evalCatalog = JSON.parse(fs.readFileSync(path.join(root, "evals", "evals.json"), "utf8"));
  const testFiles = listFilesRecursive(path.join(root, "tests"), (filePath) => filePath.endsWith(".test.js"));
  const exampleStories = listFilesRecursive(
    path.join(root, "examples", "generated"),
    (filePath) => filePath.endsWith(".md")
  );

  const metrics = {
    date: new Date().toISOString().slice(0, 10),
    skillName: evalCatalog.skill_name || packageJson.name,
    version: evalCatalog.version || packageJson.version,
    promptCount: Array.isArray(evalCatalog.evals) ? evalCatalog.evals.length : 0,
    testFileCount: testFiles.length,
    testCaseCount: countTestCases(testFiles),
    exampleStoryCount: exampleStories.length,
  };

  const prompts = (evalCatalog.evals || []).map((evalDefinition) => ({
    id: evalDefinition.id,
    name: evalDefinition.name,
    targetCapabilities: evalDefinition.target_capabilities || [],
    reviewCriteria: evalDefinition.review_criteria || [],
    expectedOutput: evalDefinition.expected_output || "",
    evidence: buildPromptEvidence(evalDefinition),
  }));

  const lines = [
    "# Latest Eval Report",
    "",
    `Date: ${metrics.date}`,
    `Skill: \`${metrics.skillName}\``,
    `Version: \`${metrics.version}\``,
    "",
    "## Eval Method",
    "",
    "This file is generated from the current repository state.",
    "It is a repository-grounded coverage report, not a blind execution benchmark.",
    "",
    "The report summarizes:",
    "- the current eval prompt catalog",
    "- the live example corpus",
    "- the current automated test surface",
    "- the repository artifacts that support each eval prompt",
    "",
    "## Coverage Snapshot",
    "",
    `- eval prompts: ${metrics.promptCount}`,
    `- example stories: ${metrics.exampleStoryCount}`,
    `- automated test files: ${metrics.testFileCount}`,
    `- approximate automated tests: ${metrics.testCaseCount}`,
    `- repository verification command: \`npm run verify\``,
    `- repo-health command: \`npm run check:repo-health\``,
    "",
    "## Prompt Coverage",
    "",
  ];

  for (const prompt of prompts) {
    lines.push(`### Eval ${prompt.id}: ${prompt.name}`);
    lines.push("Status: Supported by current repository artifacts");
    lines.push("");
    lines.push("Expected output:");
    lines.push(prompt.expectedOutput);
    lines.push("");
    lines.push("Target capabilities:");
    for (const capability of prompt.targetCapabilities) {
      lines.push(`- ${capability}`);
    }
    lines.push("");
    lines.push("Supporting evidence:");
    for (const item of prompt.evidence) {
      lines.push(`- ${item}`);
    }
    lines.push("");
    lines.push("Review focus:");
    for (const criterion of prompt.reviewCriteria) {
      lines.push(`- ${criterion}`);
    }
    lines.push("");
  }

  lines.push("## Notes");
  lines.push("");
  lines.push("- This report intentionally avoids claiming a blind pass or fail for each prompt without a fresh execution run.");
  lines.push("- Use `npm run verify` for repository checks and then review prompt outputs against the criteria in `evals/evals.json`.");
  lines.push("- Regenerate this file with `npm run eval:report` whenever the eval catalog, examples, or test surface changes.");
  lines.push("");

  return {
    metrics,
    prompts,
    markdown: `${lines.join("\n")}\n`,
  };
}

function writeEvalReport(outputPath) {
  const report = buildEvalReport();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, report.markdown, "utf8");
  return report;
}

function checkEvalReport(outputPath) {
  const report = buildEvalReport();

  if (!fs.existsSync(outputPath)) {
    return {
      valid: false,
      reason: `Missing eval report: ${outputPath}`,
      report,
    };
  }

  const existing = fs.readFileSync(outputPath, "utf8");
  if (existing !== report.markdown) {
    return {
      valid: false,
      reason: `Eval report is stale: ${outputPath}`,
      report,
    };
  }

  return {
    valid: true,
    reason: `Eval report is current: ${outputPath}`,
    report,
  };
}

function main() {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf("--output");
  const checkMode = args.includes("--check");
  const outputPath =
    outputIndex >= 0 && args[outputIndex + 1]
      ? path.resolve(args[outputIndex + 1])
      : path.join(repoRoot, "evals", "latest-eval-report.md");

  if (checkMode) {
    const result = checkEvalReport(outputPath);
    if (!result.valid) {
      console.error(result.reason);
      process.exit(1);
    }

    console.log(result.reason);
    return;
  }

  const report = writeEvalReport(outputPath);
  console.log(
    `Generated eval report for ${report.metrics.skillName}@${report.metrics.version} at ${outputPath}`
  );
}

if (require.main === module) {
  main();
}

module.exports = {
  buildEvalReport,
  writeEvalReport,
  checkEvalReport,
  countTestCases,
};
