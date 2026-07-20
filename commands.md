# Quick reference

Always start from this folder:
```
cd ~/teaching/agentic-coding-live
```

Run the test suite (drives a real headless Chromium against the deck):
```
npx playwright test
```

Open the visual trace viewer for a specific run (path comes from the test
output when a test fails — this one's from the baseline arrow-key test):
```
npx playwright show-trace test-results/slides-existing-deck-behav-0e642--arrow-keys-navigate-slides/trace.zip
```
