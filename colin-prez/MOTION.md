# colin-prez — motion

The frame (`SPEC.md`) is how the deck looks still. This is how it *moves*. Measured from
**ASML** (7 slides, 153 build chunks) and **INFO-3110** (48 slides, 184 build chunks).
The BUS `McCormick_Presentation_C.pptx` is static PowerPoint and contributes nothing here.

## How Keynote encodes animation

Every animation — build or transition — is one `animationAttributes` record hung on an
object:

```
animationAttributes:
  animationType: In | Out | Action | Transition
  effect:        "apple:dissolve character"     # string id (not a number)
  duration:      1.0
  delay:         0.0
  isAutomatic:   false                          # false = on tap; true = auto / with prior
  delivery:      All at Once
  customTextDelivery: kTextDeliveryByCharacter   # per-glyph for text
```

- **Four scopes.** `In` (entrance), `Out` (exit), `Action` (animate an already-visible
  object), `Transition` (slide-to-slide, incl. **Magic Move** — object-matching tween,
  PowerPoint's "Morph").
- **Two effect namespaces.** `apple:*` are cross-iWork effects; `com.apple.iWork.Keynote.*`
  are Keynote-only.
- **Text decomposes into build chunks** by **Delivery** (By Object / Word / Character /
  Bullet). The ` character` suffix on an effect id binds it to per-character delivery —
  which is why 7 ASML slides hold 153 chunks.

This is object-centric: a flat record per object. (PowerPoint is the opposite — a nested
`<p:timing>` time-node DAG with numeric `presetID`s. Same effects, inverted data shape.)

## The signature (what's actually consistent)

1. **Entrance-only.** Every build is `In`. No Build Outs, no Action builds. Things arrive
   and stay.
2. **Dissolve is the spine, and text resolves per character** — not as a block. The single
   most common effect in both decks is `apple:dissolve character`; INFO also leans on
   `bc-typewriter` and `fade and move character`.
3. **Motion is within slides, not between them.** Slide transitions are mostly `none`
   (ASML 0/7; INFO 10/48 dissolve, rest hard cuts). You are **not** a Magic Move user.
4. **~1.0 s, on tap, no delay.** Primary duration 1.0 s, quick accents at 0.3 s; triggered
   on tap (`isAutomatic = false`).

## Build palette → web equivalent

| Keynote effect | Does | Web equivalent (for HTML rebuilds) |
|---|---|---|
| `apple:dissolve` | object fades in | `opacity 0→1`, ~1s ease-out |
| `apple:dissolve character` | **text fades in per glyph** | per-char opacity stagger ~20–30ms/char |
| `apple:bc-typewriter` | text typed in | per-char reveal, optional caret |
| `apple:fade and move` | enters with slight rise | `opacity` + `translateY(24px→0)` |
| `apple:fade and move character` | text rises in per glyph | per-char opacity + translateY stagger |
| `…Keynote.FromDarkness` | emerges from black | `opacity` + `filter: brightness(0→1)` |
| `…Keynote.Trace` | stroke draws itself | SVG `stroke-dashoffset` draw |
| `…Keynote.LineDraw / LineDrawForLine` | line/underline draws on | SVG path draw / width 0→full |
| `apple:appear / bc-appear` | instant on | display toggle |
| `apple:movie-start` | embedded video auto-plays | `video.play()` on reveal |

## Measured distribution

| | slides | build chunks | non-"none" transitions | top effects |
|---|---|---|---|---|
| ASML | 7 | 153 | 0 | dissolve-char 56 · dissolve 41 · FromDarkness 30 · Trace 18 |
| INFO-3110 | 48 | 184 | 10 (dissolve) | dissolve-char 72 · fade+move 17 · movie-start 16 · FromDarkness 14 |

## Method note

The Keynote stylesheets in these decks were saved with unflattened incremental-edit
patches that `keynote-parser` 1.14.4 can't read — so the slides were decoded with a
**slides-only slim `.key`** (Index/Slide-*.iwa + Metadata, excluding the patched
`DocumentStylesheet.iwa`). That round-tripped cleanly for all 55 slides. See
`_sources/PROVENANCE.md`.
