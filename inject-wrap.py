#!/usr/bin/env python3
# =============================================================================
# inject-wrap.py — retroactively apply the code-block WRAP + pinned-chrome fix to
# already-rendered, self-contained HTML (files that won't be re-knit right away).
#
# The fix lives canonically in mosaics/info3320-overrides.css @72fdcff (so every
# FUTURE knit gets it). This patcher updates files already on disk without a re-knit:
# it injects an override <style> just before </head> (last in the head, so it wins),
# making long code lines wrap instead of running off the right — which also keeps the
# absolutely-positioned language logo + copy button pinned (no horizontal scroll to
# drag them along).
#
# Idempotent (sentinel-guarded) and reversible (dated .pre-wrap-*.bak alongside each
# file, per the archive-don't-delete rule).
#
#   python3 inject-wrap.py FILE.html [FILE2.html ...]
# =============================================================================
import sys, shutil, datetime, pathlib

SENTINEL = "<!-- code-wrap-fix v4 -->"
CSS = "<style>\n" + SENTINEL + """
div.sourceCode{position:relative !important;overflow-x:visible !important}
pre.sourceCode,pre.sourceCode code,code.sourceCode{white-space:pre-wrap !important;overflow-wrap:anywhere !important;overflow-x:visible !important}
div.sourceCode pre.numberSource{margin-left:0 !important;padding-left:0 !important;border-left:0 !important}
pre.numberSource code{background:linear-gradient(#6a6a6a,#6a6a6a) 3.05em 0 / 1px 100% no-repeat !important}
pre.numberSource code > span{display:block !important;position:relative !important;left:0 !important;padding-left:3.5em !important;text-indent:0 !important}
pre.numberSource code > span > a:first-child{position:absolute !important;left:0 !important;top:0 !important;width:2.7em !important;text-align:right !important;display:block !important}
pre.numberSource code > span > a:first-child::before{position:static !important;left:0 !important}
</style>
"""

def patch(path):
    p = pathlib.Path(path)
    if not p.exists():            print("skip (missing):", p); return
    html = p.read_text(encoding="utf-8", errors="replace")
    if SENTINEL in html:          print("skip (already patched):", p.name); return
    if "</head>" not in html:     print("skip (no </head>):", p.name); return
    stamp = datetime.datetime.now().strftime("%Y%m%dT%H%M%S")
    shutil.copy2(p, p.with_suffix(p.suffix + f".pre-wrap-{stamp}.bak"))
    p.write_text(html.replace("</head>", CSS + "</head>", 1), encoding="utf-8")
    print("patched:", p.name)

if __name__ == "__main__":
    if len(sys.argv) < 2: print(__doc__); sys.exit(0)
    for f in sys.argv[1:]: patch(f)
