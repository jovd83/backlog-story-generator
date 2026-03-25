#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const JS_STACK_INDICATORS = [
  "react",
  "next",
  "vue",
  "@angular/core",
  "express",
  "fastify",
  "nestjs",
  "vite",
  "webpack",
  "jest",
  "vitest",
  "cypress",
  "playwright",
  "typescript",
];

function usage() {
  console.error("Usage: node scripts/inspect-codebase-context.js <repo-directory>");
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function inspectNodeProject(repoDir) {
  const packageJsonPath = path.join(repoDir, "package.json");
  const packageJson = readJsonIfExists(packageJsonPath);
  if (!packageJson) {
    return null;
  }

  const dependencies = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {}),
  };

  const observedDependencies = Object.keys(dependencies)
    .filter((name) => JS_STACK_INDICATORS.includes(name))
    .sort();

  return {
    ecosystem: "node",
    manifest: "package.json",
    packageManager: fs.existsSync(path.join(repoDir, "package-lock.json"))
      ? "npm"
      : fs.existsSync(path.join(repoDir, "pnpm-lock.yaml"))
        ? "pnpm"
        : fs.existsSync(path.join(repoDir, "yarn.lock"))
          ? "yarn"
          : "unknown",
    observedDependencies,
    scripts: packageJson.scripts || {},
  };
}

function inspectCodebaseContext(repoDir) {
  const nodeProject = inspectNodeProject(repoDir);
  const observations = [];

  if (nodeProject) {
    observations.push(`Observed Node project via ${nodeProject.manifest}`);
    if (nodeProject.observedDependencies.length > 0) {
      observations.push(`Observed dependencies: ${nodeProject.observedDependencies.join(", ")}`);
    } else {
      observations.push("No recognized stack indicators found in package.json dependencies");
    }
  } else {
    observations.push("No package.json found; Node stack could not be confirmed");
  }

  return {
    repoDir,
    projectTypes: [nodeProject].filter(Boolean).map((project) => project.ecosystem),
    nodeProject,
    observations,
    guardrail:
      "Use only observed dependencies and files as technology evidence. Do not infer frameworks, test tools, or integrations that are not present.",
  };
}

function main() {
  const repoDir = process.argv[2];
  if (!repoDir) {
    usage();
    process.exit(1);
  }

  try {
    const report = inspectCodebaseContext(repoDir);
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(`Codebase inspection failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  inspectCodebaseContext,
};
