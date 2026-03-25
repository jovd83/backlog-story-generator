# User Story: Filter Sales Trends By Range and Region

**Story ID:** US-011
**Epic/Feature:** Analytics Dashboard
**Priority:** High
**Story Points:** 5
**Status:** Proposed

---

## User Story

**As a** business analyst
**I want** to filter the sales trend widget by date range and region
**So that** I can analyze trends for the business slice I care about

---

## Acceptance Criteria

### Scenario 1: Change date range
**Given** an analyst is viewing the sales trend widget
**When** they switch between 7, 30, and 90 day ranges
**Then** the chart reloads with data for the selected period

### Scenario 2: Apply region filter
**Given** multiple regions are available
**When** the analyst selects a region filter
**Then** the widget updates to show sales data scoped to that region

### Scenario 3: No data for selected filters
**Given** the selected range and region have no matching sales data
**When** the widget finishes loading
**Then** it shows a clear empty state instead of a broken chart

---

## Business Rules
- Date-range options are limited to 7, 30, and 90 days.

## Scope Notes
- This story extends the widget with filter controls and filtered data behavior.

## Dependencies
- Depends on the base widget rendering story and analytics data service support for the filters.

## Non-Functional Notes
- Filter controls should remain accessible and understandable for keyboard users.

## Testing Notes
- Validate date-range switching, region filtering, and empty-state behavior.

## Open Questions
N/A

## Source Traceability
- examples/input-analytics-dashboard-widget.md

## Implementation Notes
N/A
