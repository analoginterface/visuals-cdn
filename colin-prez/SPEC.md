# colin-prez — the frame

The consistent thing across your decks is **not** a bento grid. It is a *persistent
editorial frame*: a fixed set of typographic "furniture" (margin grid + monospace
kicker + footer page number + a strict two-typeface pairing) that stays constant while
the content area underneath changes. Bento panels and big-numeral splits are *moves
inside* the frame, not the frame itself.

In Keynote terms: a **master-slide template with a metadata rail and a running foot**.
In editorial-design terms: **kicker/eyebrow labels** + **running head/foot** over a
**margin grid**, set in a **display + mono type pairing**.

---

## The two-typeface rule (this is most of the identity)

| Job | Typeface | Never used for |
|---|---|---|
| Headlines, statements, body copy | **Neue Haas Display** (Light dominant; Roman/Medium/Bold for emphasis) | labels |
| Metadata: kickers, class, name, page number | **SF Mono** (Regular/Medium/Semibold), ALL-CAPS, letter-spaced | sentences |

The clean separation — Neue Haas *only* speaks, SF Mono *only* labels — is why the decks
read as one system even when their content is wildly different. The mono labels in the
corners are the "voice of the chrome"; the Neue Haas is the "voice of the content."

Caveat: **Neue Haas Display is a licensed font** (Linotype/Monotype), installed on your
machine, not a system default. SF Mono ships with macOS. Any rebuild off-machine
(HTML, a shared template, a teammate's Keynote) needs the Neue Haas license or a
substitute (Helvetica Neue is the honest fallback; Inter is a free near-match).

---

## Canvas & grid (measured from BUS3000)

- Canvas **1920 × 1080** (16:9).
- A near-uniform **~90–95 px margin** on all four sides: sides 95, top 85, bottom ~96.
- Content column **1730 px** wide, centered.
- Everything sits in one of a few horizontal **bands**:

```
 0                                                                     1920
 ┌────────────────────────────────────────────────────────────────────┐ 0
 │  [KICKER BAND]  y=85  h=50      kicker right (or label-colon left)   │
 │                                                                      │
 │  [TITLE / HERO]  y=203  h=366                                        │
 │                                                                      │
 │  [BODY]  y=215  h=650   (content region; bento/split lives here)     │
 │                                                                      │
 │  [FOOTER BAND]  y=934  h=50    byline left  ·  page number right     │
 └────────────────────────────────────────────────────────────────────┘ 1080
```

The "four corners in monospace" you remember is an *alignment* effect, not four separate
boxes: full-width bands with text pushed **left or right**. Top band, kicker right.
Bottom band, byline left + page number right. To populate all four corners (class
top-left, name top-right, etc.) you add left/right runs to the top and bottom bands.

---

## Palette (exact sRGB)

| Token | Hex | Use |
|---|---|---|
| Orange | **#F27221** | kickers, giant numerals, watermark |
| Charcoal | **#222222** | the statements — deliberately *not* pure black |
| Gray | **#5E5E5E** | secondary text |
| Black | **#000000** | byline / footer mono |
| White | **#FFFFFF** | background |
| Orange tint | **#F9CBA4** | numeral circle, tiled watermark (orange at ~35% over white) |

One accent (orange), one near-black (charcoal), white field. That's the whole palette.
Restraint is part of the look.

---

## Type scale (pt at 1920×1080)

`116 · 55 · 50 · 36 · 34 · 32 · 30 · 27 · 24 · 18`

- **Hero** ~116 (Neue Haas Roman/Bold) — title slide only.
- **Statement** 50 (Neue Haas Light) — the one big sentence.
- **Body** 30–34 (Neue Haas Light).
- **Kicker / page number** ~24–26 (SF Mono), ALL-CAPS, tracked ~0.08em.

The HelveticaNeue runs found in the file are Keynote's inherited placeholder defaults
("Body Level One…Five"), not content — ignore them.

---

## Master furniture (set once, inherited everywhere)

- **Kicker label** — top band, SF Mono, orange (sections) or black; the colon-label
  variant ("STRATEGIC PRESENCE:") sits left and narrower.
- **Byline** — footer band, left, black SF Mono.
- **Page number** — footer band, right. Mechanism: `kKindSlideNumberPlaceholder` with
  `SlideNumberVisible = true`, defined on the master. The number instances carry no
  geometry of their own — they inherit position from the master. That is exactly why it
  "just appears at the bottom" without you placing it each time.

---

## Recurring content moves (optional, inside the frame)

- **Giant numeral** (~300px) in orange over a pale-orange circle — section/objective slides.
- **Tiled watermark** — a single word repeated at an angle in orange tint as a texture.
- **Split panel** — left graphic zone / right text zone. This is the closest thing to
  "bento," but it's a content-area layout, not the deck's identity.

---

## Provenance

Measured from **BUS3000 Pres.key** (fully decoded). Font system confirmed identical in
the **ASML MGMT-3000** deck (its color stylesheet was saved with incremental patches the
decoder can't read, so colors there are inferred from the shared font system, not
re-measured). **template.key was excluded**: it is a separate, near-stock Helvetica-based
template (default rainbow palette, no SF Mono, no Neue Haas) and is *not* this look — the
0.6 MB file-size match that first suggested otherwise was a false lead. See
`_sources/PROVENANCE.md`.
