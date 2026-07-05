# Quotation Frontend

Angular application for managing client quotations — create, edit, view, and print quotations, with AI-assisted drafting and status-based approval notifications.

## Tech Stack

- **Framework:** Angular
- **Forms:** Reactive Forms (`FormBuilder`, `FormArray`)
- **HTTP:** Angular `HttpClient`
- **Styling:** Custom CSS (no UI framework — hand-written styles, Bootstrap-inspired class naming only)

## Project Structure

```
src/app/
├── quotations/
│   ├── quotations-list/
│   │   ├── quotations-list.component.ts
│   │   ├── quotations-list.component.html
│   │   └── quotations-list.component.css
│   ├── quotations-form/
│   │   ├── quotations-form.component.ts
│   │   ├── quotations-form.component.html
│   │   └── quotations-form.component.css
│   ├── quotation-view/
│   │   ├── quotation-view.component.ts
│   │   ├── quotation-view.component.html
│   │   └── quotation-view.component.css
│   └── quotations.service.ts
├── app.module.ts
└── main.ts
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API base URL

Update the API URL in `quotations.service.ts` (or your environment file) to point to your running backend:

```typescript
private apiUrl = 'http://localhost:5200/';
```

### 3. Run the dev server

```bash
ng serve
```

Navigate to `http://localhost:4200`.

## Key Features

### Quotation List
- Search by quotation number, phone, email, or title.
- Filter by **status**, **quotation date**, and **created date** (filter panel toggled via the Filters button next to the quotation count).
- Status shown as color-coded badges: Draft (yellow), Sent (blue), Approved (green), Rejected (red).
- Each row links to a read-only **View** page; Edit and Delete actions available per row.

### Quotation Form (Create / Edit)
- Client selection auto-fills email and phone from the selected company.
- Quotation date defaults to the current date/time on creation.
- Line items support add/remove, with quantity × unit price auto-calculated per row and rolled up into the total amount.
- **AI Quotation Assistant drawer** — click "✨ Suggest with AI" to open a side panel where you describe a project in plain language (e.g. *"Private dining catering for 10 guests"*). The AI returns suggested line items with BHD pricing, which can be reviewed and added directly into the form with one click.
  - Items where the AI isn't confident about pricing show as **"Price TBD"** rather than a guessed number — these need manual pricing before the quotation is finalized.
  - The AI call itself happens entirely on the backend; the frontend only sends the project description and receives validated JSON back.

### Quotation View Page
- Read-only summary: client info, title/description, itemized table, and total.
- **Print / Save as PDF** — a dedicated print-only layout (letterhead, itemized table, totals, signature lines) renders when printing, separate from the on-screen view. See note below on global vs. component CSS for print styles.

### Status Workflow
- Draft → Sent → Approved / Rejected.
- When a quotation is marked **Approved**, the backend triggers an n8n workflow that emails the client and/or posts a Slack/Discord notification. This happens automatically — no manual step required from the frontend once the status is saved.

## Important CSS Note: Print Styles Must Be Global

Angular's view encapsulation scopes component CSS to that component's template. Print rules that target `body` (e.g. `body * { visibility: hidden; }`) **do not work** if placed inside a component's `.css` file, since `<body>` is outside Angular's control. All print-related CSS (`.print-only`, `@media print` rules referencing `body`) must live in the global `src/styles.css`, not in any component stylesheet. See `quotation-view.component.css` for the scoped styles that do work at the component level.

## Localization (Arabic / RTL)

If adding Arabic support:
- Use `@ngx-translate/core` for runtime language switching (no rebuild required, unlike Angular's built-in `@angular/localize`).
- RTL layout requires explicit CSS overrides (e.g. `html[dir="rtl"] .page-header { flex-direction: row-reverse; }`) since this project does not use Bootstrap's RTL stylesheet.
- The AI prompt supports a language parameter so quotation drafts can be generated in Arabic as well as English.

## Known Field Naming Notes

- Backend status labels: `0 = Draft`, `1 = Sent`, `2 = Approved`, `3 = Rejected` (as returned by `getAllQuotations`). Double-check any place using `Pending` instead of `Sent` for status `1` — these have appeared inconsistently between the form and list views and should be aligned to one label.
- Currency values are in **BHD**, displayed with 3 decimal places, not 2.
