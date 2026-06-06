# theme/ — reusable Keynote theme

## What's here

`colin-prez-seed.key` — a byte copy of **BUS3000 Pres.key**, the cleanest fully-decoding
deck that carries the frame on its master slides (kicker band, footer band, the
`SlideNumberPlaceholder` page-number furniture, the Neue Haas / SF Mono pairing).

## Why a copy and not a generated theme

`keynote-parser` *can* repack a `.key`, but the installed Keynote is **14.5** and the
decoder only guarantees **14.4** — its own warning is "may not be editable, or data
corruption may occur." Hand-editing the protobuf to strip the BUS content into a blank
theme risks corrupting the slide tree. The zero-risk path is to let Keynote itself mint
the theme from a known-good file.

## Make the reusable theme (one manual step in Keynote)

1. Open `colin-prez-seed.key` in Keynote.
2. Delete the content slides (the masters are what matter — they hold the furniture).
3. **File ▸ Save Theme…** → name it `Colin Prez`.
4. It now appears under **My Themes** in the theme chooser. New decks start with the
   kicker band, footer, page number, palette, and type styles already in place.

To verify the page-number furniture survived: Document ▸ change a master, confirm
"Slide numbers" is on; every new slide should show the number bottom-right without
placing it by hand.

## If you'd rather build it clean from scratch

Use `../tokens.json` as the spec. In a blank 1920×1080 Keynote theme, set on the master:
SF Mono kicker (top band, y≈85), SF Mono byline + slide-number placeholder (footer band,
y≈934), Neue Haas Display paragraph styles per the type scale, palette per the color
tokens. That reproduces the frame without inheriting BUS3000's content.

## Source files this was derived from

See `../_sources/PROVENANCE.md` and `../_sources/PROVENANCE.tsv`.
