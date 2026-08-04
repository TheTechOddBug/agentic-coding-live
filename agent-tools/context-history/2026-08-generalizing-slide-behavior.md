# Generalizing slide deck behavior (theme / mechanics / slides separation)

Context: `unbounded_contexts_slides/unbounded_contexts_slides.html` currently bundles
theme (colors, fonts, box styles), mechanics (nav, timer, notes panel, presenter-mode
toggle), and slide content into one file. Goal: make it easy to build other slide decks
that reuse the mechanics and optionally swap the theme.

## Findings from reading the file

- Theme colors are not isolated to one spot. They're hardcoded hex values in the
  `<style>` block (lines 7–300, including the `.blue/.orange/.green/.purple`
  section-color classes) *and* sprinkled as inline `style="color:#..."` attributes
  directly in individual slide markup (e.g. the chat-bubble example slides).
- The `<script>` block (mechanics: nav, timer-from-notes, notes panel, presenter-mode
  toggle) doesn't reference any color or theme value — it's already decoupled
  logically, just not physically.
- Playwright loads the deck via `file://`, so any split has to keep working without a
  local server. This rules out ES module `import`, but plain `<link>` and non-module
  `<script src>` both work fine over `file://`.

## Options

### A. How many physical files, and what build/assembly step (if any)
1. Three flat files per deck folder: `theme.css`, `mechanics.js` (shared, one copy
   referenced by all decks), `slides.html` (just the `<body>` markup + a `<head>` that
   links the other two). No build step — just relative paths.
2. A shared `mechanics/` folder (css + js) at the repo root, decks each get their own
   folder with `theme.css` + `deck.html`, both referencing the shared mechanics via
   relative `../` paths.
3. Keep everything as single files per deck (current model) but generate them from
   parts with a tiny script (e.g. `build.js` concatenates `theme.css` +
   `mechanics.js` + deck-specific slide markup into one `.html`) — so you edit in
   pieces but still ship/open one self-contained file.

### B. How theme values are defined and swapped
1. CSS custom properties (`:root { --accent-blue: #2a5fd4; ... }`) defined in
   `theme.css`, consumed everywhere via `var(--accent-blue)`. Swapping themes =
   swapping one file, no HTML changes.
2. Keep the current `.blue/.orange/.green/.purple` class-based approach, but move the
   color *values* those classes reference into `theme.css` only, so
   `mechanics.js`/structural CSS never hardcodes a hex.
3. Go further than color: pull font-family, spacing, and box styles (`.tip-box`,
   `.detect-box`, `.example-block`) into the theme file too, so "theme" means the
   deck's whole visual identity, not just accent colors.

### C. What to do with the inline hardcoded colors inside slide content
(the chat-bubble examples, the QR slide, etc.)
1. Leave them — treat per-slide inline styling as "content," not "theme," on the
   reasoning that bespoke one-off visuals (like a chat mockup) aren't meant to reskin.
2. Replace the inline hex values with `var(--accent-blue)` etc. so even bespoke
   content slides, if reused in later decks, pick up the new deck's theme
   automatically.
3. Extract repeated inline patterns (chat bubble, the two-color message pairs) into
   reusable CSS classes in a shared "slide-content-patterns" stylesheet, so new decks
   can reuse the pattern without recopying inline styles at all.

### D. How a new deck actually gets authored day-to-day
1. Copy an existing deck's HTML file wholesale, replace the slide markup, keep the
   `<link>`/`<script>` tags pointed at the shared files.
2. Start from a minimal `deck-template.html` (just the head links + empty `<body>` +
   the nav/notes-panel chrome markup) and paste slides in.
3. Keep a "decks" index/manifest (even just a folder listing) plus the template, so
   `mechanics.js` could eventually be theme- and deck-agnostic enough to npm-init a new
   deck with one command — more infrastructure, only worth it if you expect to make
   many decks.

## Status

Options presented 2026-08-04, no decision made yet. Waiting on Chelsea to pick a
combination before any implementation starts.
