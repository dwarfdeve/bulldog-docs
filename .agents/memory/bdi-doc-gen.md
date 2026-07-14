---
name: BDI Document Generator Architecture
description: Key decisions and layout for the Bulldog Inc. static document generator app
---

# BDI Document Generator

## Architecture
- React + Vite, port 5000, static build (`base: './'` for GitHub Pages compatibility)
- No backend — everything is localStorage + React state
- GitHub Actions (`.github/workflows/pages.yml`) builds from `main` and deploys `dist/` to GitHub Pages

## Key Files
- `src/context/ProfileContext.jsx` — profile stored in localStorage, `profile.completed` controls questionnaire gate
- `src/documents/registry.js` — all 19 doc types defined here; `buildInitialState(doc, profile)` generates pre-filled form state; `nextDocNumber(prefix)` stores per-type counters in localStorage
- `src/layouts/ReceiptLayout.jsx` — used by 16/19 doc types
- `src/layouts/LogLayout.jsx` — used by Food Consumption Log, Feed/Supplement Log, Vaccination Record
- `src/layouts/CertLayout.jsx` — wraps existing `Certificate.jsx` for pedigree doc type

## Document Types (19 total)
Sales & Revenue: Sales Receipt, Invoice, Puppy Sale Receipt, Breeding Service
Purchases: Purchase Receipt, Petty Cash Receipt, Pet Food Receipt
Services: Service Receipt, Grooming Receipt, Boarding Receipt
Food Logs: Food Consumption Log, Feed/Supplement Log, Meal Expense Report
Medical: Vet Receipt, Vaccination Record
Finance: Expense Report, Delivery Receipt, Donation Receipt
Certificates: Pedigree Certificate

## Why
- `base: './'` in vite.config.js — relative paths work for both GitHub Pages subdirectory and root
- `profile.completed` flag — gates questionnaire on first visit, can re-enter via "Edit Profile"
- All doc state built from `buildInitialState()` — never mutate registry data directly
- Print via `window.print()` with `@media print` CSS hiding form panel and topbar
