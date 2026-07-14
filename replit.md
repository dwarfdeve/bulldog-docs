# BDI Document Generator

## Overview
A web application for **Bulldog Inc. (BDI)** that generates 22 business document types — receipts, invoices, logs, shipping/delivery paperwork, and pedigree certificates — branded with the BDI bulldog logo.

## Stack
- **Plain HTML / CSS / vanilla JavaScript (ES modules)** — no framework, no build step, no bundler
- Served by a small built-in Node.js static file server (`server.js`), no external dependencies
- Google Fonts: Cinzel, IM Fell English, Playfair Display, Source Serif 4

## How to Run
```
node server.js
```
Workflow: **Start application** → `node server.js` → serves on port 5000.

## Features
- Onboarding questionnaire that pre-fills every document with the user's business info (stored in `localStorage`)
- Dashboard grid of 22 document types across 8 categories (Sales & Revenue, Purchases, Services, Shipping & Delivery, Food Logs, Medical & Health, Finance, Certificates)
- Live split-screen form + printable preview for every document
- Three pedigree certificate styles, selectable per-document: **Heritage Pedigree** (UKC-style black-framed/gold), **Certified Pedigree** (AKC-style blue-bordered), and **Registration Certificate** (original BDI gold-stamp style)
- Shipping & Delivery documents for French Bulldog logistics: Puppy Shipping Manifest, Health & Travel Certificate, Food Delivery Receipt
- Printable / PDF-saveable output via the browser print dialog
- BDI logo (transparent PNG) as watermark, header icon, and footer/certificate seal

## Assets
- `assets/bdi-logo.png` — Bulldog Inc. bulldog-head logo, background removed (transparent PNG)

## Project Structure
```
index.html                     — single HTML entry point
css/style.css                  — all styles (dashboard, forms, receipts, logs, 3 cert styles, print rules)
js/
  app.js                       — router / entry point (replaces React App.jsx)
  profile.js                   — localStorage-backed business profile (replaces ProfileContext)
  registry.js                  — registry of all 22 document types + form-state builder
  utils.js                     — escaping / date / money formatting helpers
  pages/
    questionnaire.js           — onboarding wizard
    dashboard.js                — document type grid
    document.js                 — split form + live preview page (all non-cert layouts + cert form)
  layouts/
    receipt.js                  — receipt/invoice printable layout
    log.js                       — table log printable layout
    certificate.js               — pedigree certificate: BDI / AKC-style / UKC-style renderers
assets/bdi-logo.png             — logo
server.js                       — zero-dependency static file server
.github/workflows/pages.yml     — deploys the static site (no build step) to GitHub Pages
```

## User Preferences
- Company: Bulldog Inc. (BDI)
- Signature acronym: BDI
- No React, no build tooling — static HTML/CSS/JS only, per explicit user request
- Certificate styles modeled on official AKC "Certified Pedigree" and UKC "Heritage Pedigree" formats, but fully BDI-branded (not an official government/registry document)
