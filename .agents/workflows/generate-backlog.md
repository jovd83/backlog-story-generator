---
description: How to perform an end-to-end backlog generation and validation
---

# Backlog Generation Workflow

// turbo-all

Follow these steps to generate a high-fidelity backlog from raw requirements.

1. **Ingest & Ground**
   - Read the provided source material (Markdown, PDF, Code, etc.).
   - Extract primary Actors, Workflow Steps, and Constraints.
   - If a codebase is provided, run the Contextualizer:
   ```bash
   node scripts/inspect-codebase-context.js <path-to-code>
   ```

2. **Epic Modeling**
   - Propose an Epic structure based on Business Capabilities.
   - Use `references/naming-convention.md` for folder and ID rules.

3. **Story Drafting**
   - Create one Markdown file per User Story using `references/user-story-template.md`.
   - Ensure Gherkin-style Acceptance Criteria.
   - Verify ID numbers are sequential and unique within the context.

4. **Verify Integrity**
   - Run the local validator to catch schema and formatting errors:
   ```bash
   node scripts/validate-stories.js <dir-of-stories>
   ```
   - Resolve any errors before proceeding.

5. **Generate Export Artifacts**
   - If the user requested an export (e.g., Jira), run the exporter:
   ```bash
   node scripts/export-stories.js <dir-of-stories> exports/backlog-export.csv jira
   ```

6. **Final Delivery**
   - Summarize what was created.
   - Report the validation output.
   - List all Assumptions and Unresolved Questions.
