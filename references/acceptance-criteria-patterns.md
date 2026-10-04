# Acceptance Criteria Patterns

Use this reference when no acceptance-criteria skill (such as `acceptance-criteria-designer`) is installed, when the surrounding workflow has its own acceptance-criteria step, or when criteria start drifting into generic scaffolding. When a specialist skill wrote the criteria, use this file to check that they are specific to the story.

The goal is not to force every story into the same three scenarios. The goal is to help you choose story-specific scenarios that reflect the actual behavior, risks, and boundaries implied by the source material.

## Core Principle

Build scenarios from the story's real nouns, states, and business consequences.

Weak:
- `Given a valid project context exists`
- `When the workflow is submitted`
- `Then the platform completes the requested action successfully`

Stronger:
- `Given a shopper is on the shipping step of checkout`
- `When they leave the postal code blank and continue`
- `Then the form highlights the postal-code field and blocks checkout progression`

## Recommended Scenario Mix

Most stories become more reviewable when they include:
- one primary success path
- one validation, permission, or failure path
- one rule, audit, edge, or recovery path when the source material supports it

If a story truly only has one meaningful scenario, do not invent extra filler scenarios just to reach a fixed count.

## Pattern Selection By Story Type

### Create Or Capture

Good candidates:
- successful creation or save
- required-field or format validation
- duplicate, conflict, or unsupported-input handling

Examples:
- register a new patient
- capture a shipping address
- create a purchase order

### Update Or Edit

Good candidates:
- successful update
- blocked update because of state, permission, or validation
- audit trail or version history after the change

Examples:
- edit a supplier's bank details
- update notification preferences
- change user roles

### Delete, Archive, Or Revoke

Good candidates:
- successful deletion or archival under allowed conditions
- blocked deletion because the item is still in use or protected
- confirmation, audit, or recovery behavior

Examples:
- archive a completed project
- delete a saved payment card
- revoke a user role

### Search, Filter, Or Query

Good candidates:
- relevant results returned for valid criteria
- empty-state or no-match behavior
- performance or sorting behavior when explicitly required

Examples:
- search the product catalogue
- filter dashboards by date and region
- look up an order by reference number

### Assignment, Linking, Or Mapping

Good candidates:
- successful link or assignment
- blocked link because of incompatible scope or missing permission
- traceability or synchronization result after linking

Examples:
- assign a technician to a service job
- link an invoice to a purchase order
- map a product to a warehouse location

### Execution Or Workflow Progression

Good candidates:
- primary execution or status change
- blocked transition from an invalid state
- evidence, timestamp, or audit result after progression

Examples:
- approve an expense claim
- mark an order as packed
- pause and resume a subscription

### Reporting Or Visualization

Good candidates:
- correct data shown for a valid view
- fallback or empty state when data is missing
- permission, freshness, or export behavior when relevant

Examples:
- dashboard widget
- monthly sales trend report
- audit trail view

### Import, Export, Or Integration

Good candidates:
- successful import or export with valid input
- validation failure for malformed or unsupported input
- duplicate handling, partial-failure handling, or audit logging

Examples:
- import customers from a CSV file
- export project data
- receive shipment updates from a carrier webhook

### Performance, Security, Or Compliance

For constraint-heavy stories, scenarios should still be observable.

Weak:
- `Then the system performs well`

Stronger:
- `Then the search results return within the response budget agreed in the requirements`
- `Then the audit record cannot be edited after the claim is closed`
- `Then only finance staff with the export permission can download payroll data`

## Scenario Smells

Refine the scenario if:
- the nouns could fit almost any story
- the `Then` clause says only that the action succeeded
- the scenario ignores the main business rule in the source material
- every story in the pack has the same three scenario shapes with only the title changed

## Quick Self-Check

Before finalizing acceptance criteria, ask:
- Does each scenario mention this story's domain objects or workflow state?
- Would a QA reviewer know what to test from this scenario alone?
- Does at least one scenario cover an important failure, rule, or permission boundary where relevant?
- If I removed the story title, would these scenarios still clearly belong to this story?
