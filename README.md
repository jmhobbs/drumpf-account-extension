# Drumpf Account Browser Extension

A browser extension that replaces the text "Trump Account" (and case, plural, and possessive variants) with "530A IRA" wherever it appears on a rendered web page. Because why the hell are we calling it that.  Call it a 530A IRA you muppets.

## What it matches

Case-insensitive, with plural and possessive support:

- `Trump Account` / `trump account` / `TRUMP ACCOUNT` → `530A IRA`
- `Trump Accounts` → `530A IRAs`
- `Trump's Account` / `Trump's Accounts` → `530A IRA` / `530A IRAs`

It intentionally does NOT match loosely related phrasing (e.g. "Trump savings account"), near-miss words ("Trump Accountant", "Trump Accounting"), or the un-apostrophized plural possessive ("Trumps Account"). See `src/matcher.test.ts` for the full case list.

## Known limitations

A phrase split across multiple DOM nodes by markup (e.g. `Trump <b>Account</b>`) will not be matched — the extension only scans single text nodes, not the rendered/flattened text across sibling elements. This is a deliberate simplification; the vast majority of real-world text is not mid-phrase tag-split.

## Build

```
npm install
npm run build
```

This produces `dist/` with the extension built and ready to go.

## Load it

### Chrome, Edge, Brave, Opera (Chromium-based)

1. `chrome://extensions` (or the equivalent `edge://extensions`, `brave://extensions`, etc.)
2. Enable "Developer mode".
3. Click "Load unpacked" and select this project's root directory.

### Firefox

1. `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on…" and select `dist/manifest.json`
3. Note: temporary add-ons are removed when Firefox restarts and need to be reloaded after each rebuild.
