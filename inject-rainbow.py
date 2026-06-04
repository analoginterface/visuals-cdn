#!/usr/bin/env python3
# =============================================================================
# inject-rainbow.py — retroactively add rainbow parentheses to already-rendered,
# self-contained HTML (files that won't be re-rendered from the fixed format).
#
# Injects the canonical .paren/.bracket/.brace palette (mosaics/tomorrow-night-80s.css)
# before </head> and the depth-rainbow delimiter walker before </body>. Idempotent
# (sentinel-guarded — re-running is a no-op) and reversible (each file gets a dated
# .pre-rainbow-*.bak copy alongside, per the archive-don't-delete rule).
#
# NOTE: files that WILL be re-rendered (the deck, the rebuilt final-project) do NOT
# need this — they inherit the fix from the format root (mosaics overrides +
# _format/after_body.html). This is only for FINAL outputs (e.g. graded HW).
#
#   python3 inject-rainbow.py FILE.html [FILE2.html ...]
# =============================================================================
import sys, shutil, datetime, pathlib

SENTINEL = "<!-- rainbow-parentheses v2 -->"

CSS = "<style>\n" + SENTINEL + """
code span.ot{color:#66cccc!important}
.sourceCode .paren-1,.sourceCode .bracket-1,.sourceCode .brace-1{color:#f2777a!important;font-weight:bold!important}
.sourceCode .paren-2,.sourceCode .bracket-2,.sourceCode .brace-2{color:#f99157!important;font-weight:bold!important}
.sourceCode .paren-3,.sourceCode .bracket-3,.sourceCode .brace-3{color:#ffcc66!important;font-weight:bold!important}
.sourceCode .paren-4,.sourceCode .bracket-4,.sourceCode .brace-4{color:#99cc99!important;font-weight:bold!important}
.sourceCode .paren-5,.sourceCode .bracket-5,.sourceCode .brace-5{color:#66cccc!important;font-weight:bold!important}
.sourceCode .paren-6,.sourceCode .bracket-6,.sourceCode .brace-6{color:#6699cc!important;font-weight:bold!important}
.sourceCode .paren-7,.sourceCode .bracket-7,.sourceCode .brace-7{color:#cc99cc!important;font-weight:bold!important}
</style>
"""

JS = "<script>\n" + SENTINEL + """
(function(){var TYPE={'(':'paren',')':'paren','[':'bracket',']':'bracket','{':'brace','}':'brace'},
OPEN={'(':1,'[':1,'{':1},CLOSE={')':1,']':1,'}':1},N=7;
function paint(codeEl){if(codeEl.dataset.rbDone)return;codeEl.dataset.rbDone='1';var depth=0,
w=document.createTreeWalker(codeEl,NodeFilter.SHOW_TEXT,null),tn=[],t;
for(t=w.nextNode();t;t=w.nextNode())tn.push(t);
tn.forEach(function(node){var s=node.nodeValue;if(!/[()\\[\\]{}]/.test(s))return;
var frag=document.createDocumentFragment(),buf='';
function flush(){if(buf){frag.appendChild(document.createTextNode(buf));buf='';}}
function wrap(ch,lvl){var sp=document.createElement('span');sp.className=TYPE[ch]+'-'+lvl;sp.textContent=ch;frag.appendChild(sp);}
for(var i=0;i<s.length;i++){var ch=s[i];
if(OPEN[ch]){flush();wrap(ch,(depth%N)+1);depth++;}
else if(CLOSE[ch]){depth=Math.max(0,depth-1);flush();wrap(ch,(depth%N)+1);}
else{buf+=ch;}}
flush();node.parentNode.replaceChild(frag,node);});}
function run(){document.querySelectorAll('code.sourceCode, pre.sourceCode > code').forEach(paint);}
if(document.readyState!=='loading')run();else document.addEventListener('DOMContentLoaded',run);})();
</script>
"""

def patch(path):
    p = pathlib.Path(path)
    if not p.exists():
        print("skip (missing):", p); return
    html = p.read_text(encoding="utf-8", errors="replace")
    if SENTINEL in html:
        print("skip (already patched):", p); return
    if "</head>" not in html or "</body>" not in html:
        print("skip (no head/body):", p); return
    stamp = datetime.datetime.now().strftime("%Y%m%dT%H%M%S")
    shutil.copy2(p, p.with_suffix(p.suffix + f".pre-rainbow-{stamp}.bak"))
    html = html.replace("</head>", CSS + "</head>", 1)
    html = html.replace("</body>", JS + "</body>", 1)
    p.write_text(html, encoding="utf-8")
    print("patched:", p)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(0)
    for f in sys.argv[1:]:
        patch(f)
