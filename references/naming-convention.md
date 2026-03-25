# Story ID and Folder Convention

Use naming rules that stay predictable as a backlog grows. The goal is readability, continuity, and safe automation.

## Epic Folders

Create one folder per epic:

```text
epic-01-checkout-experience/
epic-02-payment-processing/
epic-03-order-management/
```

Rules:
- use a zero-padded sequential epic number
- use a short kebab-case slug based on business capability or workflow boundary
- prefer stable business language over internal implementation jargon
- reuse existing numbering when extending an established pack

Good epic names:
- Checkout Experience
- Payment Processing
- Role Access Management
- Reporting and Exports

Weak epic names:
- Misc
- Phase 2
- Backend Stuff
- Enhancements

## Story IDs

Default story identifier format:

```text
US-001
US-002
US-003
```

Rules:
- use one global story sequence across the pack unless an established repository convention says otherwise
- continue from the highest observed story ID when extending an existing pack
- do not renumber existing stories unless the task is explicitly a normalization or migration task
- keep the ID in the file contents and filename aligned

## Story Filenames

Use:

```text
US-001-capture-shipping-address.md
US-002-select-shipping-method.md
US-003-submit-card-payment.md
```

Rules:
- prefix with the story ID
- follow with a short action-oriented kebab-case slug
- keep the slug aligned with the story title
- avoid filler words when a tighter slug is clearer

## Story Title Guidance

Good titles:
- Capture Shipping Address
- Select Shipping Method
- Assign and Revoke Roles
- Reprint Label With Audit Log

Weak titles:
- Story 1
- Shipping Stuff
- Permissions Update
- Backend Work

Choose names that help product, engineering, and QA understand the delivery boundary without opening the entire file.
