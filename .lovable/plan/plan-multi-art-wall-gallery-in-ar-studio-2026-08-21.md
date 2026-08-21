# Plan: Multi-Art Wall Gallery in AR Studio

## Goal

Extend the existing `/ar` "Try the Kala" experience so users can curate a wall of several artworks at once — move, scale, tilt, frame and layer each piece independently, then capture the full room composition.

## Current state 

- `/ar` is a single-artwork AR view: camera feed + one draggable artwork + size/tilt/frame controls + capture.
- Artwork images come from `artists` in `src/lib/kala-data.ts`; products do not have individual images.
- The route is already linked from the nav and artist pages as "View in AR".

## What we will build

### 1. Refactor AR state for multiple pieces

- Replace the single `selected` piece state with an array of `placed` pieces.
- Each placed piece carries: `instanceId`, `artistId`, `x`, `y`, `scale`, `tilt`, `framed`, `zIndex`.
- Keep a `selectedInstanceId` so controls apply to the active piece.
- Preserve a "single" mode that behaves exactly like today for users who only want one artwork.

### 2. Gallery mode toggle

- Add a segmented control at the top of the controls panel: **Single piece** / **Wall gallery**.
- Single mode: one artwork, current UX unchanged.
- Gallery mode: multi-piece canvas with selection and a piece tray.

### 3. Gallery tray and piece management

- Sidebar section listing all available artworks (artist images) as addable thumbnails.
- Clicking a thumbnail adds a new placed piece near the centre with a slight offset to avoid overlap.
- A "Placed pieces" list shows thumbnails of pieces already on the wall; click to select.
- Per-piece actions when selected: duplicate, bring forward, send backward, remove.

### 4. Stage interactions

- Click/tap an artwork to select it.
- Drag the selected artwork to reposition; dragging on empty stage does nothing.
- Selected artwork gets a visible copper border/outline so users know which piece the controls affect.
- Pointer events on artwork do not trigger global stage capture.

### 5. Controls in gallery mode

- Size, tilt and frame toggles now operate on the selected piece.
- "Reset" resets only the selected piece; "Clear wall" removes all pieces.
- Capture composites every placed piece in z-order onto the camera frame, then opens the same save/download modal.

### 6. Entry points

- Keep the existing "View in AR" links from artist pages, defaulting to single mode with that artist pre-selected.
- Add a new entry from the nav or a subtle link on `/ar` to start an empty gallery.

### 7. Polish and verification

- Ensure the dark editorial styling (copper accents, Cormorant/Karla typography) matches the rest of the app.
- Verify capture still works with zero, one or many pieces.
- Test selection and drag do not break on touch devices.

## Technical notes

- No new dependencies planned; the feature is built with React state, canvas composition and pointer events already used in `ar.tsx`.
- `src/lib/kala-data.ts` already exposes `artists`, so the gallery can source every artist image without schema changes.
- Head metadata on `/ar` will be updated to mention the gallery feature.