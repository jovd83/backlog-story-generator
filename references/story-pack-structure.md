# Story Pack Structure

Use this layout when writing a story pack to disk.

## Recommended Directory Layout

```text
stories/
|-- epic-01-checkout-experience/
|   |-- US-001-capture-shipping-address.md
|   `-- US-002-select-shipping-method.md
|-- epic-02-payment-processing/
|   `-- US-003-submit-card-payment.md
`-- epic-03-order-review/
    `-- US-004-review-order-summary.md
```

## Why This Structure Works

- epic folders make capability boundaries visible
- global story numbering simplifies traceability and export
- one-file-per-story makes incremental updates safer than one giant backlog document

## Expected Delivery Artifacts

A typical task may leave behind:
- one or more epic folders
- one markdown file per story
- optional generated output such as `exports/stories-jira.csv`
- validation output in the terminal or a JSON report

Markdown stories are the source of truth. Generated CSV and HTML are derived artifacts.

## Extension Guidance

It is acceptable to keep a small number of supporting files beside a story pack, for example:
- a local README explaining the source material
- a mapping file for an external backlog system
- a reviewer note listing assumptions or unresolved decisions

Do not mix unrelated design documents or implementation specs into epic folders unless the target repository already depends on that structure.
