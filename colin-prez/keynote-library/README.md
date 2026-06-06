# keynote-library

Copies of the Keynote decks shown in this project, plus their reverse-engineered
animation data. This is the raw-specimen layer behind `../MOTION.md`.

## decks/

Byte copies of the source `.key` files (large — embedded media). `*.key` is gitignored
here so 1.2 GB of binaries doesn't enter the `mosaics` repo history; the files stay on
disk as the local library.

| copy | slides | source |
|---|---|---|
| `ASML_MGMT-3000.key` | 7 | Desktop/DU/Fall-2024/MGMT-3000/…/FINAL_McCormick-ASML_Case-2_MGMT-3000.key |
| `INFO-3110_p1_copy.key` | 48 | Desktop/DU/Spring-2025/INFO-3110/project/p1_McProject_INFO-3110 copy.key |
| `INFO-3110_p1.key` | 22 | Desktop/DU/Spring-2025/INFO-3110/project/p1_McProject_INFO-3110.key |
| `BUS3000.key` | 8 | iCloud/…/Keynote/BUS3000 Pres.key (the first, rejected file — kept per "even the ones not used") |

`INFO-3110_p1` (22 slides) and `INFO-3110_p1_copy` (48 slides) are different versions, not duplicates.

## animations/

One JSON per deck (every build: effect, animationType, delivery, duration, chunk counts,
per-slide breakdown) plus `_catalog.json` (the union effect catalog). Decoded with the
slides-only slim-key method (see `../_sources/PROVENANCE.md`) since the full stylesheets
carry patches `keynote-parser` can't read.

## Combined effect catalog — every animation across all four decks

| uses | ns | effect | does | web equivalent |
|---|---|---|---|---|
| 155 | apple | `dissolve character` | text fade-in per glyph (seeded scatter) | per-char opacity stagger |
| 59 | apple | `dissolve` | object fade-in | `opacity 0→1` |
| 49 | keynote | `FromDarkness` | emerges from black | `opacity` + `brightness(0→1)` |
| 24 | apple | `fade and move` | fade + slight rise | `opacity` + `translateY` |
| 22 | apple | `movie-start` | embedded video auto-plays | `video.play()` on reveal |
| 18 | keynote | `Trace` | stroke draws itself | SVG `stroke-dashoffset` |
| 16 | apple | `fade and move character` | per-glyph fade + rise | per-char opacity+translateY stagger |
| 13 | apple | `bc-appear` | text appears per character | per-char display toggle |
| 11 | keynote | `LineDrawForLine` | line object draws on | SVG path draw |
| 4 | apple | `move in` | slides in from an offset | translate from edge |
| 3 | keynote | `LineDraw` | line draws on | SVG path draw |

(A `bc-typewriter` text-delivery variant also appears at the chunk level in INFO-3110, used
for typed-in text; it isn't a top-level build effect so it's not in the build catalog above.)

## What the data confirms (mechanism)

- **Entrance-only.** Every build is `animationType: In`. No Out, no Action builds, in any deck.
- **Build-driven, not transition-driven.** Transitions are almost all `none` (BUS3000 8/8 none, ASML 7/7 none); only INFO uses a few `dissolve` transitions. No Magic Move anywhere.
- **`dissolve character` dominates** (155 of ~374 builds) — text resolving per glyph is the house style.
- **Single-chunk.** Most builds are one chunk; the per-glyph timing is expanded at render time from `effect + randomNumberSeed + duration`, not stored as keyframes. Full mechanism in `../MOTION.md`.
- **BUS3000 has zero builds** — it's a static deck (consistent with it being the wrong reference earlier).

## Provenance

Decoded with `keynote-parser` 1.14.4 via the slides-only slim-key method. Build/chunk/effect
data read with a PyYAML walker over `KN.BuildArchive` / `KN.BuildChunkArchive` nodes.
