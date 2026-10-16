#!/usr/bin/env python3
"""Copy the design CV from the job-search repo into cv/, without the phone
number, and print a matching PDF.

Usage: scripts/sync-cv.py [path/to/job-search]
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT.parent / "job-search") / "cv" / "cv-design.html"
OUT = ROOT / "cv"
PDF = "maksym-synenko-cv.pdf"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

html = SOURCE.read_text()

# The public copy never carries the phone number.
html, removed = re.subn(r'\s*<li><a href="tel:[^"]*">[^<]*</a></li>', "", html)
if removed != 1:
    sys.exit(f"expected one phone line in {SOURCE}, found {removed}")
if re.search(r"\+\d{2}[\d ]{7,}", html):
    sys.exit("a phone-like number is still in the page")

OUT.mkdir(exist_ok=True)
(OUT / "index.html").write_text(html)

subprocess.run(
    [CHROME, "--headless", "--no-pdf-header-footer", f"--print-to-pdf={OUT / PDF}", (OUT / "index.html").as_uri()],
    check=True,
    capture_output=True,
)
pages = len(re.findall(rb"/Type\s*/Page\b(?!s)", (OUT / PDF).read_bytes()))
if pages != 1:
    sys.exit(f"{PDF} has {pages} pages, expected 1")

# Added after printing, so the PDF does not link to itself.
link = f'    <li class="pdf"><a href="{PDF}" download>Download PDF</a></li>\n'
html = html.replace('  <ul class="contact">\n', '  <ul class="contact">\n' + link, 1)
html = html.replace("</style>", "  @media print { .pdf { display: none; } }\n</style>", 1)
(OUT / "index.html").write_text(html)
print(f"cv/index.html and cv/{PDF} updated from {SOURCE}")
