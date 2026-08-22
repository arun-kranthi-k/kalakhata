# Phase 1 — Kalakhata as a Heritage Platform (Core)

## What exists today

- Routes: `/` (hero + feed), `/explore` (search + filters), `/map` (India outline with 15 clickable region hotspots), `/artists/$artistId` (story, products, message form), `/ar` (Try the Kala — camera studio, multi-piece wall gallery).
- Data: one file, `src/lib/kala-data.ts` — 6 artists (name, craft, region, place, generations, quote, story, products), 15 regions (name, x/y hotspot, art form names, note), 6 feed items. Six generated art images in `src/assets`.
- Components: `SiteNav`, `SiteFooter`. Design tokens and editorial animations (`reveal`, `mask-rise`, `slow-zoom`, `grain`) in `src/styles.css`.
- No backend, no auth, no database. Everything is static typed data.

One correction worth flagging: the site's current identity is a **dark** editorial theme with copper accents, not cream/off-white. I'll keep the dark identity as-is (that is the "soul" of what's built) rather than repainting it, unless you'd rather I switch the palette to cream.

## Phase 1 scope

Everything below is front-end with structured local data, written so a real backend can slot in later without touching components.

### 1. Data model rewrite (foundation)
Split `kala-data.ts` into typed modules under `src/lib/heritage/`:
- `artForms.ts` — the new core entity: id, name, state, district, category (Painting/Textile/Metal/Wood/Pottery/Folk Theatre/Music/Dance), heritage status, status factors, origin, timeline entries, materials, technique steps, cultural significance, gallery, artisan ids, related form ids, sources.
- `artisans.ts` — existing artists extended with art form id, years practising, specialisation, verification state (`demo-verified` / `unverified`), workshop notes.
- `regions.ts` — states with district → art form nesting, plus map hotspot coords.
- `products.ts` — artworks lifted out of artisans so a product has its own page and links back to form + artisan.
- `stories.ts` — existing feed, with categories.
Every heritage number carries a `sampleData: true` marker so the UI can label it.

Seed ~14 art forms across the existing regions, with **Cheriyal Scroll Painting (Telangana)** as the fully-detailed flagship record, plus a Cheriyal artisan (Nakashi tradition, described without unverifiable historical claims).

### 2. Navigation
`SiteNav` gains: Home, Explore, India Map, Stories, Artisans, Marketplace (Learn/Dashboard land in Phases 2–3). Right side: Saved Heritage placeholder icon, language switch stub (functional in Phase 2). Mobile gets a compact bottom bar. Keyboard focus states and aria labels throughout.

### 3. Homepage
Keep the hero image grid and giant "Kalakhata" wordmark; restructure hierarchy:
- Hero copy → "Where India's disappearing arts get a digital life." + supporting line + three CTAs (Explore Heritage / Meet Artisans / Explore India).
- New **The Problem** section — qualitative causes, no invented statistics.
- New **Preservation Loop** — DOCUMENT → PRESERVE → DISCOVER → LEARN → SUPPORT → SUSTAIN, each with one line.
- Existing feed stays, retitled Stories, with category chips.
- Map teaser stays.

### 4. Heritage status system
A small `HeritageStatus` badge component: Thriving / At Risk / Endangered / Critically Endangered, labelled **Kalakhata Heritage Status** everywhere, with a "why this status" factor list on the record page. Colour tokens added to `src/styles.css`.

### 5. India Heritage Map
Upgrade `/map` to drill down India → State → District → Art Form. Selecting a state shows its art forms with status badges, documented-artisan counts (labelled sample data), related stories and products. Touch-friendly hotspots, keyboard-selectable state list beside the map so it works without pointer precision.

### 6. Digital Heritage Record — new route `/art/$artFormId`
The centrepiece page: header (location, category, status), then History & Origin, Timeline, Materials, Traditional Techniques, Step-by-step Process, Cultural Significance, Gallery, Artisans, Products, Related Art Forms, Sources. Sections that have no data are omitted rather than showing "coming soon".

### 7. Artisan profiles
Rewrite `/artists/$artistId` into: Meet the Artist header (location, form, years, generation, specialisation, verification chip clearly marked demo), Their Story, Their Craft & Process, Their Workshop, Their Artworks, and actions — Buy Directly, Request Custom Artwork, Message. Add `/artisans` index. Replace "no middlemen" wording with "direct artisan-to-buyer".

### 8. Marketplace
New `/marketplace` grid and `/marketplace/$productId` detail. Cards lead with artist, place, art form, status and "story behind this artwork" — not price-first. Detail page covers technique, materials, time taken, origin, authenticity, shipping, buy CTA (prototype checkout — clearly a prototype, no fake payment).

### 9. Explore & search
Extend `/explore` to search across art forms, artisans, states, districts, materials and techniques, with category and heritage-status filters and a clear empty state.

### 10. Cross-cutting
Per-route `head()` metadata; semantic landmarks and one `<main>` per page; alt text; visible focus rings; 44px touch targets; `prefers-reduced-motion` honoured by the existing animations; lazy images; no horizontal overflow at 360px. `/ar` and its links stay untouched and get added to the Marketplace/Record pages.

## Not in Phase 1
Learn, Save Heritage, multilingual, verification workflow, Heritage/Impact dashboards, AI Guide, auth and roles. Auth and roles require Lovable Cloud — I'll raise that when we reach Phase 2/3 rather than faking it now.

## Verification before finishing
Build check, then a Playwright pass over every route at desktop and mobile widths: nav links, map drill-down, search/filters, record page, artisan page, product page, empty states, screenshots.
