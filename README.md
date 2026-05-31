# visuals-cdn

Lean CDN partition of [`analoginterface/visuals`](https://github.com/analoginterface/visuals).

The full `visuals` repo is >50 MB, which exceeds jsDelivr's per-package size cap —
so `cdn.jsdelivr.net/gh/analoginterface/visuals@main/...` returns 404 for *every*
asset, and the INFO-3320 R Markdown template's fonts never load.

This repo holds **only the assets that template actively references**, keeping the
total under the cap so the CDN serves them. `visuals` remains the full archive
(its git history is the manifest of everything else).

## Contents (28 files, ~3.3 MB)

- **CSS/JS:** `styles.css`, `template.css`, `v1_sidebar.css`, `v1_sidebar.js`, `tomorrow-night-80s.css`
- **TT Commons Pro Mono** (code): Regular, Italic, Medium, Medium Italic, DemiBold, DemiBold Italic
- **Minion Pro** (body serif): `6812`–`6819`
- **Helvetica Neue LT Com** (sidebar/TOC): MdEx, MdExO, BdEx, BdExO
- **Neue Haas Display** (headings): Medium, Medium Italic
- **logos/**: `primary-wordmark_black_mosaic.svg`, `github-mark.svg`, `LinkedIn_icon.svg`

The `@font-face` URLs inside `styles.css` / `template.css` / `v1_sidebar.js` were
repointed from `visuals@main` to `visuals-cdn@main` so they resolve here.

Served via: `https://cdn.jsdelivr.net/gh/analoginterface/visuals-cdn@main/<path>`
