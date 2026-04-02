# Export Guide

Use `scripts/export-stories.js` to turn validated markdown story files into CSV for backlog tools.

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

## Export Discipline

The exporter:
- walks the input directory recursively
- parses only markdown files that match the story contract
- rejects malformed stories instead of silently exporting partial data
- formats rows for the chosen downstream tool

Treat markdown stories as the source of truth and CSV as a derived artifact.
Exports are intentionally optimized for backlog tools rather than internal planning. Sections such as `Implementation Notes` are kept in markdown but omitted from the CSV description payload.

## Validate Before Export

Always run:

```bash
node scripts/validate-stories.js <input-directory>
```

Before calling an export ready, confirm:
- each story has the required heading and metadata
- `## User Story` and `## Acceptance Criteria` are present
- story IDs are unique
- filenames align with IDs and titles
- no placeholders remain
- the pack has already gone through the quality-improvement workflow when semantic cleanup is needed

## Field Mapping

### Jira

Columns:
- `Issue Type`
- `Summary`
- `Description`
- `Priority`
- `Story Points`
- `Epic Name`

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

Common reasons export fails:
- the heading does not match the template
- required metadata lines were removed or renamed
- acceptance criteria headings were corrupted
- placeholder text remains
- the file fails validation

If export fails, fix the markdown source and rerun validation. Do not patch the CSV manually and treat it as canonical.
