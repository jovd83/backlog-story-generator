#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { checkEvalReport } = require("./generate-eval-report");

const repoRoot = path.resolve(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function readYamlScalar(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim().replace(/^"(.*)"$/, "$1") : "";
}

function ensureFile(relativePath, errors) {
  if (!fs.existsSync(path.join(repoRoot, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

function runChecks(root = repoRoot) {
  const errors = [];
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const openaiYamlText = fs.readFileSync(path.join(root, "openai.yaml"), "utf8");
  const manifestExample = JSON.parse(
    fs.readFileSync(path.join(root, "skill-manifest.example.json"), "utf8")
  );
  const readmeText = fs.readFileSync(path.join(root, "README.md"), "utf8");

  [
    "README.md",
    "SKILL.md",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "SECURITY.md",
    "SUPPORT.md",
    "LICENSE",
    "openai.yaml",
    "skill-manifest.example.json",
    ".github/CODEOWNERS",
    ".github/pull_request_template.md",
    ".github/workflows/ci.yml",
    ".github/workflows/release.yml",
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    ".github/ISSUE_TEMPLATE/contract_change.yml",
    ".github/ISSUE_TEMPLATE/config.yml",
  ].forEach((relativePath) => ensureFile(relativePath, errors));

  const openaiName = readYamlScalar(openaiYamlText, "name");
  const openaiVersion = readYamlScalar(openaiYamlText, "version");
  const openaiAuthor = readYamlScalar(openaiYamlText, "author");
  const openaiLicense = readYamlScalar(openaiYamlText, "license");
  const openaiNode = readYamlScalar(openaiYamlText, "\\s+node");

  if (packageJson.name !== openaiName) {
    errors.push(`package.json name does not match openai.yaml name (${packageJson.name} vs ${openaiName})`);
  }

  if (packageJson.name !== manifestExample.name) {
    errors.push(
      `package.json name does not match skill-manifest.example.json name (${packageJson.name} vs ${manifestExample.name})`
    );
  }

  if (packageJson.version !== openaiVersion) {
    errors.push(
      `package.json version does not match openai.yaml version (${packageJson.version} vs ${openaiVersion})`
    );
  }

  if (packageJson.version !== manifestExample.version) {
    errors.push(
      `package.json version does not match skill-manifest.example.json version (${packageJson.version} vs ${manifestExample.version})`
    );
  }

  if ((packageJson.author || "") !== openaiAuthor) {
    errors.push(
      `package.json author does not match openai.yaml author (${packageJson.author || ""} vs ${openaiAuthor})`
    );
  }

  if ((packageJson.author || "") !== (manifestExample.author || "")) {
    errors.push(
      `package.json author does not match skill-manifest.example.json author (${packageJson.author || ""} vs ${manifestExample.author || ""})`
    );
  }

  if ((packageJson.license || "") !== openaiLicense) {
    errors.push(
      `package.json license does not match openai.yaml license (${packageJson.license || ""} vs ${openaiLicense})`
    );
  }

  if ((packageJson.license || "") !== (manifestExample.license || "")) {
    errors.push(
      `package.json license does not match skill-manifest.example.json license (${packageJson.license || ""} vs ${manifestExample.license || ""})`
    );
  }

  const packageNode = packageJson.engines && packageJson.engines.node ? packageJson.engines.node : "";
  const manifestNode =
    manifestExample.compatibility && manifestExample.compatibility.node
      ? manifestExample.compatibility.node
      : "";

  if (packageNode !== openaiNode) {
    errors.push(`package.json engines.node does not match openai.yaml compatibility.node (${packageNode} vs ${openaiNode})`);
  }

  if (packageNode !== manifestNode) {
    errors.push(
      `package.json engines.node does not match skill-manifest.example.json compatibility.node (${packageNode} vs ${manifestNode})`
    );
  }

  ["setup", "verify", "package", "test", "check:repo-health"].forEach((scriptName) => {
    if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
      errors.push(`Missing package.json script: ${scriptName}`);
    }
  });

  if (!packageJson.scripts || !packageJson.scripts["check:eval-report"]) {
    errors.push("Missing package.json script: check:eval-report");
  }

  ["SECURITY.md", "SUPPORT.md", ".github/CODEOWNERS"].forEach((needle) => {
    if (!readmeText.includes(needle)) {
      errors.push(`README.md is missing governance reference: ${needle}`);
    }
  });

  const evalReportCheck = checkEvalReport(path.join(root, "evals", "latest-eval-report.md"));
  if (!evalReportCheck.valid) {
    errors.push(evalReportCheck.reason);
  }

  if (errors.length > 0) {
    const message = ["Repository health check failed:"]
      .concat(errors.map((error) => `- ${error}`))
      .join("\n");
    throw new Error(message);
  }

  return {
    name: packageJson.name,
    version: packageJson.version,
    checks: "passed",
  };
}

function main() {
  const result = runChecks();
  console.log(
    `Repository health checks completed for ${result.name}@${result.version}.`
  );
}

if (require.main === module) {
  main();
}

module.exports = {
  runChecks,
  readJson,
  readText,
};
