# colin-prez

Your signature presentation look, extracted from your own Keynote files and turned into a
reusable template.

**The identity in one line:** a *persistent editorial frame* — Neue Haas Display for all
words, SF Mono for all metadata (kicker labels + class + name + page number), pinned to a
~95 px margin grid in charcoal + one orange (`#F27221`) on white. It is **not** a bento
grid; bento/split panels are optional moves inside the frame.

## Files

| Path | What |
|---|---|
| `tokens.json` | Machine-readable design tokens: canvas, grid, bands, palette, type scale, furniture, **and motion**. The source of truth. |
| `SPEC.md` | Human-readable spec — the frame explained (static look), with the measurements and the bento-vs-frame distinction. |
| `MOTION.md` | How the deck *moves* — Keynote's animation model and your build signature (entrance-only per-character dissolves), with web equivalents. Measured from ASML + INFO-3110. |
| `LAYOUTS.md` | Structural layouts — the three-voice font standard, the full-bleed front page (class TL · name BL · DU logo TR · quarter BR), the bottom gray bar (section + page number), and a 14-preset bento library. Measured from the BUS 3000 PowerPoints. |
| `keynote-library/` | Copies of the four Keynote decks shown (`decks/`, gitignored) + per-deck reverse-engineered animation JSON and a combined effect `_catalog.json` (`animations/`). The raw-specimen layer behind `MOTION.md`. |
| `specimen/index.html` | The frame realized in HTML/CSS (title / objective / four-corner slides). Open in a browser. |
| `theme/colin-prez-seed.key` | A working deck whose masters carry the frame; **File ▸ Save Theme** to get a reusable Keynote theme. See `theme/NOTES.md`. |
| `_sources/PROVENANCE.md` | How it was extracted, the source set, and the `template.key` correction. |

## Derived from

`BUS3000 Pres.key` (canonical, fully decoded) + the `ASML MGMT-3000` deck (confirms the
type system). `template.key` was examined and **excluded** — it's a separate
Helvetica-based template, not this look. Full method in `_sources/`.

## Status

Static frame (`SPEC.md`) and motion vocabulary (`MOTION.md`): complete. Frame sourced from
BUS3000 Pres.key, corroborated by ASML + INFO-3110; the BUS `.pptx` is a content reference
only (static, Office-themed) and does not define the look. Reusable Keynote theme: one
manual **Save Theme** step in Keynote (the decoder can't safely repack on Keynote 14.5 —
see `theme/NOTES.md`). Open item parked: cross-checking exact four-corner coordinates
against a second fully-decoded deck (re-save ASML to flatten its patches first).
