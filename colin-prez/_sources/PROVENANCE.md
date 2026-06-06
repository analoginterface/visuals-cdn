# Provenance & method

## How this was extracted

A single-file `.key` is a ZIP: `Data/` (media), `Metadata/` (plist), and `Index/*.iwa`
— the slide content as Snappy-compressed protobuf in Apple's iWork Archive schema.
Decoding used `keynote-parser` 1.14.4 (the maintained reverse-engineered iWork decoder)
via `uvx`. Geometry/type/color were read off the decoded YAML with a PyYAML walker;
BUS3000 also shipped a `BUS3000 Pres.pdf` export that gave pixel-accurate visual ground
truth for nine slides.

## Source set (chosen by Colin: BUS3000 + ASML, triangulated with template.key + INFO-3110)

| File | Size | Decode | Verdict |
|---|---|---|---|
| BUS3000 Pres.key | 0.6 MB | full | **CANONICAL.** All geometry, type scale, palette measured here. |
| FINAL_McCormick-ASML…MGMT-3000.key | 432 MB | fonts only | **Corroborates** the type system (Neue Haas Light + SF Mono Semibold + Helvetica). |
| template.key | 0.6 MB | full | **EXCLUDED — different language** (see below). |
| v.2_p1_McProject-INFO-3110.key | 0.6 MB | full | **EXCLUDED — derived from template.key**, same Helvetica language. |

## The template.key correction (a refuted hypothesis)

On first pass I weighted a coincidence: `template.key`, `BUS3000`, and the 0.6 MB
`INFO-3110` file are all ~0.6 MB and two share a 2025-04-28 date — which *suggested* a
shared custom theme. Decoding refuted it:

- **template.key**: HelveticaNeue only; **no** SF Mono, **no** Neue Haas; accent colors
  are the stock Keynote rainbow presets (`#F8BA00 #60D836 #00A2FF #EE220C #CB297B …`);
  zero of the signature orange. It is a near-stock, Helvetica-based template — a
  *different* design language.
- **v.2_p1_McProject-INFO-3110.key**: same Helvetica language, derived from template.key
  (differs in Document/Stylesheet/Metadata but shares the font system).

So file size was a false signal. The signature look (Neue Haas Display + SF Mono +
`#F27221` + mono corner labels + master page numbers) lives in **BUS3000 and ASML**.
template.key is kept in the inventory only as a known *other* template you also have.

## The ASML decode limitation

ASML's `DocumentStylesheet.iwa` was saved with unflattened incremental-edit patches
(`ProtobufPatch … fields_to_remove`) that keynote-parser 1.14.4 cannot deserialize — so
its colors could not be re-measured; the font names were recovered with `strings` on the
raw archives (Snappy stores string literals verbatim). **Tip:** opening ASML in Keynote
and doing a plain re-save (or File ▸ Duplicate) flattens those patches into clean
archives, after which the deck decodes fully and its corner coordinates can be
cross-checked against BUS3000.

## Reproduce

```sh
SCRATCH=/tmp/key-extract
uvx keynote-parser unpack "<file>.key" -o "$SCRATCH/out"        # decode to YAML
grep -rhoE 'fontName: [A-Za-z-]+' "$SCRATCH/out/Index" | sort | uniq -c | sort -rn
# colors: r/g/b/a floats under fontColor in DocumentStylesheet.iwa.yaml (model:rgb, srgb)
# geometry: geometry.position{x,y} + geometry.size{width,height}; canvas 1920x1080
```
