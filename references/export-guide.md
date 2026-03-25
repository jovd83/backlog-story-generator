# Export Guide

The repository includes `scripts/export-stories.js` to turn validated markdown story files into CSV for backlog tools.

## Supported Formats

- `jira`
- `ado`
- `github`
- `tulip`

## Command

```bash
node scripts/export-stories.js <input-directory> <output-file.csv> [format]
```

Example:

```bash
node scripts/export-stories.js ./examples/generated ./exports/jira.csv jira
```

## Export Behavior

The exporter:
- walks the input directory recursively
- parses only markdown files that match the story contract
- rejects malformed story files instead of silently exporting partial data
- formats output for the chosen target tool

The exporter is intentionally downstream of validation. Treat markdown story files as the source of truth and CSV as a derived artifact.

## Validation Before Export

Run validation first:

```bash
node scripts/validate-stories.js <input-directory>
```

Before treating an export as ready:
- confirm each story has the required heading and metadata
- confirm `## User Story` and `## Acceptance Criteria` are present
- confirm story IDs are unique and filenames align with the IDs
- inspect the generated CSV for empty descriptions or obviously truncated content

## Field Mapping

### Jira

Columns:
- `Issue Type`
- `Summary`
- `Description`
- `Priority`
- `Story Points`
- `Epic Name`

Description composition:
- user story statement
- acceptance criteria
- selected optional notes when present

### Azure DevOps

Columns:
- `Work Item Type`
- `Title`
- `Description`
- `Acceptance Criteria`
- `Priority`
- `Story Points`
- `Tags`

Priority mapping:
- `Critical` -> `1`
- `High` -> `2`
- `Medium` -> `3`
- `Low` -> `4`

### GitHub Issues

Columns:
- `Title`
- `Body`
- `Labels`

Label behavior:
- always includes `story`
- includes a lowercase priority label such as `high`

### Tulip

Columns:
- `Type`
- `Story ID`
- `Name`
- `Description`
- `Acceptance Criteria`
- `Priority`
- `Epic`

## Failure Cases

Common causes of bad output:
- heading does not match the template
- required metadata lines were removed
- acceptance criteria headings were renamed or corrupted
- placeholder text was left in the story
- the file fails schema-backed validation

If export fails, fix the markdown source and rerun validation. Do not patch the CSV by hand and treat it as authoritative.
