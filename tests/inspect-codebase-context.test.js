const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const fixtureRepo = path.join(repoRoot, "tests", "fixtures", "codebase", "admin-role-app");

const { inspectCodebaseContext } = require("../scripts/inspect-codebase-context");

test("inspects a fixture codebase using only observed stack evidence", () => {
  const report = inspectCodebaseContext(fixtureRepo);
  assert.deepEqual(report.projectTypes, ["node"]);
  assert.ok(report.nodeProject);
  assert.ok(report.nodeProject.observedDependencies.includes("react"));
  assert.ok(report.nodeProject.observedDependencies.includes("express"));
  assert.ok(report.nodeProject.observedDependencies.includes("vite"));
  assert.ok(report.nodeProject.observedDependencies.includes("vitest"));
  assert.ok(!report.nodeProject.observedDependencies.includes("cypress"));
  assert.ok(!report.nodeProject.observedDependencies.includes("playwright"));
  assert.match(report.guardrail, /Do not infer frameworks/);
});
