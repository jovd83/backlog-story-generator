# Example Packs

These examples demonstrate the canonical story contract across multiple domains and show what "good" looks like for validation and export.

Included source inputs:
- `input-checkout-requirements.md`
- `input-analytics-dashboard-widget.md`
- `input-warehouse-operations.md`
- `input-role-access-management.md`
- `input-healthcare-appointment-scheduling.md`
- `input-field-service-dispatch.md`

Generated examples under `examples/generated/` intentionally:
- use globally unique story IDs
- follow epic-folder and story-file naming rules
- include both required sections and selective optional sections
- demonstrate the optional `Diagrams` section selectively, using real diagrams only where they materially clarify the story and `N/A` where prose is sufficient
- use raw Mermaid code blocks for Mermaid-based examples so Markdown renderers with Mermaid support can render them directly
- include rendered SVG previews plus source files under `examples/generated/_diagrams/` and `examples/generated/_diagram-sources/` for the PlantUML-based examples
- split the visual examples across Mermaid and PlantUML so both notations are represented where they fit best
- remain valid under the parser, schema, validator, and exporter

Use these examples when changing:
- the story template
- naming rules
- validation behavior
- export logic
- packaging or documentation claims about the repository contract

Recommended checks against the example pack:

```bash
npm run validate:examples
npm run lint:quality:examples
npm run improve:examples
```

The examples should remain:
- structurally valid
- free of semantic boilerplate under the current lint rules
- stable under the deterministic improvement workflow
