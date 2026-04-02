#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const REQUIRED_DIRS = ["tmp", "exports", "memory", "stories"];
const MIN_NODE_MAJOR = 20;

function ensureNodeVersion() {
  const currentMajor = Number(process.versions.node.split(".")[0]);
  if (currentMajor < MIN_NODE_MAJOR) {
    console.error(`Node.js ${MIN_NODE_MAJOR}+ is required. Current version: ${process.versions.node}`);
    process.exit(1);
  }
}

function ensureDirectories(repoRoot) {
  for (const dirName of REQUIRED_DIRS) {
    const fullPath = path.join(repoRoot, dirName);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created ${dirName}/`);
    }
  }
}

function ensureCriticalScripts(repoRoot) {
  const requiredScripts = [
    "validate-stories.js",
    "export-stories.js",
    "story-utils.js",
  ];

  for (const scriptName of requiredScripts) {
    const fullPath = path.join(repoRoot, "scripts", scriptName);
    if (!fs.existsSync(fullPath)) {
      console.error(`Missing required script: scripts/${scriptName}`);
      process.exit(1);
    }
  }
}

function main() {
  const repoRoot = process.cwd();
  ensureNodeVersion();
  ensureDirectories(repoRoot);
  ensureCriticalScripts(repoRoot);
  console.log("Repository setup checks completed.");
}

if (require.main === module) {
  main();
}
