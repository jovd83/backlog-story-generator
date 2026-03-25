#!/usr/bin/env node
const path = require("path");
const { collectStoryFiles, parseStory } = require("./story-utils");

function usage() {
  console.error("Usage: node scripts/story-pack-report.js <input-directory>");
}

function buildStoryPackReport(inputDir) {
  const files = collectStoryFiles(inputDir);
  const stories = files
    .map((filePath) => parseStory(filePath))
    .filter(Boolean)
    .sort((left, right) => left.storyId.localeCompare(right.storyId, undefined, { numeric: true }));

  const storyIds = stories.map((story) => story.storyId);
  const highestStoryId = storyIds.length > 0 ? storyIds[storyIds.length - 1] : null;
  const epicFolders = Array.from(
    new Set(stories.map((story) => path.basename(path.dirname(story.sourcePath))))
  );

  return {
    inputDir,
    storyCount: stories.length,
    storyIds,
    highestStoryId,
    nextSuggestedStoryId: highestStoryId
      ? `US-${String(Number(highestStoryId.replace("US-", "")) + 1).padStart(3, "0")}`
      : "US-001",
    epicFolders,
  };
}

function main() {
  const inputDir = process.argv[2];
  if (!inputDir) {
    usage();
    process.exit(1);
  }

  try {
    const report = buildStoryPackReport(inputDir);
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(`Story pack report failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildStoryPackReport,
};
