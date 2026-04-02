#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
const skillPath = path.join(repoRoot, "SKILL.md");
const skillText = fs.readFileSync(skillPath, "utf8");
const distRoot = path.join(repoRoot, "dist");
const ignoreNames = new Set(["dist", "tmp", "node_modules", ".git"]);

function readFrontmatterValue(markdown, key) {
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return "";
  }

  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = frontmatterMatch[1].match(new RegExp(`^${escapedKey}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : "";
}

const skillName = readFrontmatterValue(skillText, "name") || "skill";
const skillDescription = readFrontmatterValue(skillText, "description");
const version = packageJson.version || "0.0.0";
const author = packageJson.author || "";
const license = packageJson.license || "";
const packageDir = path.join(distRoot, `${skillName}.skill`);

function copyRecursive(source, destination) {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.mkdirSync(destination, { recursive: true });
    const entries = fs.readdirSync(source, { withFileTypes: true });
    for (const entry of entries) {
      if (ignoreNames.has(entry.name)) {
        continue;
      }
      copyRecursive(path.join(source, entry.name), path.join(destination, entry.name));
    }
    return;
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function rimraf(target) {
  if (!fs.existsSync(target)) {
    return;
  }
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(target)) {
      rimraf(path.join(target, entry));
    }
    fs.rmdirSync(target);
    return;
  }
  fs.unlinkSync(target);
}

function main() {
  fs.mkdirSync(distRoot, { recursive: true });
  for (const entry of fs.readdirSync(distRoot, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.endsWith(".skill")) {
      rimraf(path.join(distRoot, entry.name));
    }
  }

  fs.mkdirSync(packageDir, { recursive: true });

  for (const entry of fs.readdirSync(repoRoot, { withFileTypes: true })) {
    if (ignoreNames.has(entry.name)) {
      continue;
    }
    copyRecursive(path.join(repoRoot, entry.name), path.join(packageDir, entry.name));
  }

const manifest = {
    name: skillName,
    version,
    description: skillDescription,
    author,
    license,
    packagedAt: new Date().toISOString(),
    nodeVersion: packageJson.engines && packageJson.engines.node ? packageJson.engines.node : undefined,
    contents: [
      "SKILL.md",
      "README.md",
      "CHANGELOG.md",
      "LICENSE",
      "CONTRIBUTING.md",
      "SECURITY.md",
      "SUPPORT.md",
      "openai.yaml",
      ".agents/",
      ".github/",
      "skill-manifest.example.json",
      "docs/",
      "memory/",
      "references/",
      "schemas/",
      "scripts/",
      "examples/",
      "evals/",
      "tests/"
    ].filter(Boolean)
  };

  fs.writeFileSync(
    path.join(packageDir, "skill-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`Packaged skill to ${packageDir}`);
}

if (require.main === module) {
  main();
}
