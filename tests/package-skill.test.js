const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const packageScript = path.join(repoRoot, "scripts", "package-skill.js");
const packageDir = path.join(repoRoot, "dist", "backlog-story-generator.skill");

test("packages the skill into a distributable directory with manifest", () => {
  const stdout = execFileSync("node", [packageScript], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.match(stdout, /Packaged skill to/);
  assert.ok(fs.existsSync(path.join(packageDir, "SKILL.md")));
  assert.ok(fs.existsSync(path.join(packageDir, "README.md")));
  assert.ok(fs.existsSync(path.join(packageDir, "LICENSE")));
  assert.ok(fs.existsSync(path.join(packageDir, "CHANGELOG.md")));
  assert.ok(fs.existsSync(path.join(packageDir, "CONTRIBUTING.md")));
  assert.ok(fs.existsSync(path.join(packageDir, "SECURITY.md")));
  assert.ok(fs.existsSync(path.join(packageDir, "SUPPORT.md")));
  assert.ok(fs.existsSync(path.join(packageDir, "openai.yaml")));
  assert.ok(fs.existsSync(path.join(packageDir, "skill-manifest.example.json")));
  assert.ok(fs.existsSync(path.join(packageDir, ".github", "CODEOWNERS")));
  assert.ok(fs.existsSync(path.join(packageDir, "docs", "adapt-for-your-org.md")));
  assert.ok(fs.existsSync(path.join(packageDir, "docs", "memory-model.md")));
  assert.ok(fs.existsSync(path.join(packageDir, "memory", "README.md")));
  assert.ok(fs.existsSync(path.join(packageDir, "schemas", "story.schema.json")));
  assert.ok(fs.existsSync(path.join(packageDir, "references", "story-pack-structure.md")));
  assert.ok(fs.existsSync(path.join(packageDir, "skill-manifest.json")));

  const manifest = JSON.parse(fs.readFileSync(path.join(packageDir, "skill-manifest.json"), "utf8"));
  assert.equal(manifest.name, "backlog-story-generator");
  assert.equal(manifest.version, "5.2.0");
  assert.equal(manifest.author, "jovd83");
  assert.equal(manifest.license, "MIT");
  assert.match(manifest.description, /Generate structured epics/);
  assert.ok(manifest.contents.includes("SECURITY.md"));
  assert.ok(manifest.contents.includes("SUPPORT.md"));
  assert.ok(manifest.contents.includes(".github/"));
});
