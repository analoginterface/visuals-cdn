# colin-prez — layouts

Structural layout tokens that repeat across the decks. Measured from the BUS 3000
PowerPoints (`McCormick_Presentation_C-1.pptx`, `v4 FINAL Friends of Chamber Music`).
Tokens live in `tokens.json` under `layouts`. Nothing here merges or renames `deck`,
`mosaics`, or `_format` — it only records the standard.

## Type standard (three voices)

| Voice | Font | Job |
|---|---|---|
| sans | **Neue Haas Grotesk** (Display or Text) — or **Helvetica Neue LT** | headlines, statements, numerals |
| serif | **Minion Pro** | editorial / supporting copy, takeaways, captions |
| mono | **TT Commons Pro Mono** (SF Mono = system fallback) | metadata: class, name, section, page number |

Recorded as names only; the font files stay in the `mosaics` repo.

## Title page (front page) — same every time

Shipped as **one full-bleed designed graphic** (your Illustrator art, placed at `0,0`
across the whole 16:9 slide). The four corner labels are vector art *inside* the graphic,
which is why they're identical every deck and aren't editable PowerPoint text:

```
┌ class (BUS 3000) ───────────────── DU logo ┐
│                                            │
│              [ title / topic ]             │
│                                            │
└ name (Colin McCormick) ───── quarter (W'24)┘
```

If ever rebuilt as live elements: mono corner labels on the standard margin, logo as an
image top-right.

## Footer bar — the gray bar, always at the bottom

PowerPoint **master chrome**, so it repeats on every content slide automatically. Full-width
band pinned to the bottom edge (`y = 6.95″` of `7.5″` ≈ 92.7% down, `0.4″` tall), filled
`tx1`. Three mono fields:

```
│ date (left)        SECTION (center)        PAGE # (right) │   ← gray bar, bottom edge
```

The rule that makes it consistent: page number + section live **here, at the bottom** —
never as a header at the top.

## Bento library

14 layout presets in `tokens.json → layouts.bento.presets` for the content zone:
`2x2 · 3up · 4up · 4x2 · 2x3 · 3x3 · focal-left · focal-center · hero-top · sidebar ·
l-shape · 1-2-1 · 2up-tall · 5-mosaic`. Cells on the surface token, at most one `.focal`
(accent) cell, gap = `sp-2`. Cap 4–6 cells except the dense dashboards (4x2 / 3x3).
