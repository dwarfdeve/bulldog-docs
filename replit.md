# BDI Pedigree Certificate Generator

## Overview
A web application for **Bulldog Inc. (BDI)** that generates professional pedigree certificates styled after AKC / UKC heritage pedigrees, branded with the BDI bulldog logo and quality stamp.

## Stack
- **React + Vite** (port 5000)
- Pure CSS — no UI library
- Google Fonts: Cinzel, IM Fell English, Playfair Display, Source Serif 4

## How to Run
```
npm run dev
```
Workflow: **Start application** → `npm run dev` → serves on port 5000.

## Features
- Form-driven input: dog info, owner/breeder, 4-generation pedigree tree (parents → grandparents → great-grandparents → 4th gen)
- Certificate types: Heritage Pedigree, Certified Pedigree, Registration Certificate
- Printable / PDF-saveable output via browser print dialog
- BDI logo as watermark stamp and footer seal
- Dark UI shell with gold-accented certificate document

## Assets
- `public/bdi-logo.jpeg` — Bulldog Inc. logo (used as header icon, footer seal, and watermark)

## Project Structure
```
src/
  App.jsx                    — layout shell, state management
  components/
    CertificateForm.jsx      — sidebar input form
    Certificate.jsx          — printable certificate document
  index.css                  — all styles
public/
  bdi-logo.jpeg
index.html
vite.config.js
```

## User Preferences
- Company: Bulldog Inc. (BDI)
- Signature acronym: BDI
- Certificate style inspired by AKC Certified Pedigree and UKC Heritage Pedigree formats
