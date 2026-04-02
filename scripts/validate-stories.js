#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { collectStoryFiles, parseStory, slugify } = require("./story-utils");

const schemaPath = path.resolve(__dirname, "..", "schemas", "story.schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const PLACEHOLDER_PATTERN = /\[[^\]\n]{2,}\]/;

function usage() {
  console.error("Usage: node scripts/validate-stories.js <input-directory> [--json]");
}

function validatePrimitive(value, definition, pointer, errors) {
  if (definition.type === "string") {
    if (typeof value !== "string") {
      errors.push(`${pointer} must be a string`);
      return;
    }
    if (definition.minLength && value.length < definition.minLength) {
      errors.push(`${pointer} must be at least ${definition.minLength} characters`);
    }
    if (definition.pattern && !(new RegExp(definition.pattern).test(value))) {
      errors.push(`${pointer} does not match required pattern`);
    }
    if (definition.enum && !definition.enum.includes(value)) {
      errors.push(`${pointer} must be one of: ${definition.enum.join(", ")}`);
    }
    return;
  }

  if (definition.type === "array") {
    if (!Array.isArray(value)) {
      errors.push(`${pointer} must be an array`);
      return;
    }
    if (definition.minItems && value.length < definition.minItems) {
      errors.push(`${pointer} must contain at least ${definition.minItems} item(s)`);
    }
    value.forEach((item, index) => {
      validatePrimitive(item, definition.items, `${pointer}[${index}]`, errors);
    });
  }
}

function validateAgainstSchema(value, definition, pointer, errors) {
  if (definition.type === "object") {
    if (typeof value !== "object" || value == null || Array.isArray(value)) {
      errors.push(`${pointer} must be an object`);
      return;
    }

    for (const key of definition.required || []) {
      if (!(key in value)) {
        errors.push(`${pointer}.${key} is required`);
      }
    }

    if (definition.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!definition.properties || !(key in definition.properties)) {
          errors.push(`${pointer}.${key} is not allowed`);
        }
      }
    }

    for (const [key, propertyDefinition] of Object.entries(definition.properties || {})) {
      if (key in value) {
        validateAgainstSchema(value[key], propertyDefinition, `${pointer}.${key}`, errors);
      }
    }
    return;
  }

  if (definition.type === "array") {
    validatePrimitive(value, definition, pointer, errors);
    return;
  }

  validatePrimitive(value, definition, pointer, errors);
}

function buildSchemaCandidate(story) {
  const candidate = { ...story };
  delete candidate.rawSections;
  delete candidate.fileName;
  delete candidate.titleSlug;
  return candidate;
}

function validateStory(story) {
  const candidate = buildSchemaCandidate(story);
  const errors = [];

  for (const key of schema.required || []) {
    if (!(key in candidate)) {
      errors.push(`${key} is required`);
    }
  }

  validateAgainstSchema(candidate, schema, "story", errors);

  if (!story.rawSections.userStory) {
    errors.push("story.userStory section is missing");
  }
  if (!story.context) {
    errors.push("story.context section is missing or empty");
  }
  if (!story.functionalBusinessReferences) {
    errors.push("story.functionalBusinessReferences section is missing or empty");
  }
  if (!story.rawSections.acceptanceCriteria) {
    errors.push("story.acceptanceCriteria section is missing");
  }

  const expectedFileName = `${story.storyId}-${story.titleSlug}.md`;
  if (story.storyId && story.fileName && !story.fileName.startsWith(`${story.storyId}-`)) {
    errors.push(`filename must start with ${story.storyId}-`);
  }
  if (story.storyId && story.fileName && story.fileName !== expectedFileName) {
    errors.push(`filename should be ${expectedFileName}`);
  }

  const fieldsToCheck = [
    story.title,
    story.epicFeature,
    story.userStory.asA,
    story.userStory.iWant,
    story.userStory.soThat,
    story.context,
    story.functionalBusinessReferences,
    story.businessRules,
    story.scopeNotes,
    story.dependencies,
    story.nonFunctionalNotes,
    story.ux,
    story.testingNotes,
    story.openQuestions,
    story.implementationNotes,
    ...(story.sourceTraceability || []),
  ].filter(Boolean);

  if (fieldsToCheck.some((value) => PLACEHOLDER_PATTERN.test(value))) {
    errors.push("story contains unresolved template placeholders");
  }

  return errors;
}

function collectValidationReport(inputDir) {
  const files = collectStoryFiles(inputDir);
  const storyFiles = [];
  const results = [];
  const seenIds = new Map();

  for (const filePath of files) {
    const story = parseStory(filePath);
    if (!story) {
      continue;
    }

    storyFiles.push(filePath);
    const errors = validateStory(story);

    if (seenIds.has(story.storyId)) {
      errors.push(`story.storyId duplicates ${seenIds.get(story.storyId)}`);
    } else {
      seenIds.set(story.storyId, filePath);
    }

    results.push({
      filePath,
      storyId: story.storyId,
      title: story.title,
      valid: errors.length === 0,
      errors,
    });
  }

  return {
    inputDir,
    storiesFound: storyFiles.length,
    valid: storyFiles.length > 0 && results.every((result) => result.valid),
    results,
  };
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
    const report = collectValidationReport(inputDir);

    if (report.storiesFound === 0) {
      throw new Error("No story markdown files found.");
    }

    if (jsonMode) {
      console.log(JSON.stringify(report, null, 2));
    } else if (!report.valid) {
      for (const result of report.results.filter((entry) => !entry.valid)) {
        console.error(`Validation failed: ${result.filePath}`);
        for (const error of result.errors) {
          console.error(`  - ${error}`);
        }
      }
    } else {
      console.log(`Validated ${report.storiesFound} story file(s) successfully.`);
    }

    process.exit(report.valid ? 0 : 1);
  } catch (error) {
    if (jsonMode) {
      console.log(JSON.stringify({ valid: false, error: error.message }, null, 2));
    } else {
      console.error(`Validation failed: ${error.message}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  collectValidationReport,
  validateStory,
};
