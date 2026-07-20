# Live Session Plan: Building a Presenter App

**Format:** 2-hour live coding session, audience asks questions throughout.
**Goal:** Showcase advanced agentic coding practices (skills, planning workflows, verification loops, possibly an MCP server) by building something real and finishing in a demoable state.

## Starting point

`unbounded_contexts_slides/unbounded_contexts_slides.html` — a single-file HTML slide deck Chelsea already used to give this talk. It already has:

- Slide navigation (arrow keys / space, plus always-visible "← prev" / "next →" buttons)
- A speaker notes panel (`aside.notes` per slide), toggled by an **`N` key shortcut that already exists**, but the toggle also has a permanently visible `notes [N]` button on screen
- A timing feature: estimates seconds-per-slide from the note's word count (~120 wpm) plus a per-slide `data-extra-seconds` override, shown as a running cumulative clock in the corner
- `localStorage` slide-position persistence and a print stylesheet

## The actual gaps (confirmed by reading the code)

1. **Prev/next buttons are always visible** — no toggle exists at all for these. Audience sees them during the live talk.
2. **The `notes [N]` button is always visible** even though the `N` keyboard shortcut already works — so notes toggling doesn't need a button, just needs the button gone (or hidden from an audience-facing display).
3. There's no single "presenter mode vs. audience mode" concept — everything is one mode today.

## Feature list to build

- [ ] **Audience/presenter mode toggle** (keyboard shortcut, e.g. `P`) that hides *all* chrome from the projected view: prev/next buttons, the notes button, the counter, the slide timer — while keeping arrow-key/space navigation and `N` fully functional under the hood.
- [ ] Keep the existing `N` shortcut for notes, just stop rendering a button for it (or only render it in presenter mode).
- [ ] Ensure the timer math still displays correctly in both modes.
- [ ] Stretch: Timer calibration feature. When the slides are made but not the notes, this feature allows a presenter to present the slides in timer mode, talking through the slides the way they would in real life. The feature transcribes the words they say into the notes of the appropriate slide adn calculates their speaking words per minute so that the timer then displays times approximate to the amount of text in the notes and the presenters' words per minute. 
- [ ] Stretch: a small on-screen indicator only visible in presenter mode confirming which mode is active (so Chelsea isn't guessing before going on stage).
- [ ] Stretch: second-monitor-friendly presenter view (notes + timer + upcoming slide) vs. a clean audience view — this is the "real" two-window presenter mode pattern (like PowerPoint/Keynote presenter view). Bigger lift; only attempt if the core toggle above lands early.

## Where "advanced agentic coding" shows up

- **Planning before building**: use a Plan-mode pass to turn "hide the nav chrome" into a concrete spec before writing code, and narrate why.
- **Verification loop**: use a browser-driving step (not just eyeballing the diff) to confirm the toggle actually hides/shows what it should, live, in front of the audience.
- **Skills**: candidates to actually invoke live —
  - `run` skill to launch/drive the HTML file in a browser
  - `verify` skill after the toggle change, to make the "did it actually work" step visible and repeatable rather than vibes-based
  - Could sketch a tiny custom skill *live* (e.g. "check-presenter-mode") if time allows, to show the audience how skills get authored, not just consumed
- **MCP possibility**: if there's appetite, wiring `claude-in-chrome` (already available) to drive the browser toggle live instead of Chelsea clicking around by hand would be a strong "this is different from just autocomplete" moment.

## Open questions for Chelsea

- Keyboard shortcut key for presenter/audience mode toggle — `P`? Something else?
- Do we want the stretch two-window presenter view attempted at all, or is the single-window toggle the whole scope for 2 hours?
- Any preference on how heavily to lean on `claude-in-chrome` for live verification vs. keeping it simple?
