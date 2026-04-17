const test = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("child_process");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const healthScript = path.join(repoRoot, "scripts", "check-repo-health.js");

test("passes repository health checks for the canonical repo state", () => {
  const stdout = execFileSync("node", [healthScript], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.match(stdout, /Repository health checks completed for backlog-story-generator@\d+\.\d+\.\d+\./);
});
