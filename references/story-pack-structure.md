# Story Pack Structure

Use this layout when writing story files to disk.

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

- Epic folders make capability boundaries visible without opening every file.
- Global story numbering simplifies validation, cross-references, and export behavior.
- Story-level markdown files make incremental updates safer than one giant backlog document.

## Delivery Artifacts

For a typical task, the skill should leave behind:
- one or more epic folders
- one story markdown file per backlog increment
- optional export output such as `tmp/stories-jira.csv`
- validation output in the command log or summary

## Extension Guidance

It is acceptable to add repository-local supporting files beside a story pack, such as:
- a `README.md` explaining the source material
- a mapping file for an external backlog system
- a manually curated assumptions note

Do not mix arbitrary design documents or implementation specs into epic folders unless the target repository already depends on that structure.
