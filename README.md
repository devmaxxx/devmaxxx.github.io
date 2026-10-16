# devmaxxx.github.io

Personal GitHub Pages site.

- `/` redirects to `/cv/`.
- `/cv/` is the design CV with a PDF download. The public copy leaves out the phone number.

The CV source lives in the private `job-search` repo (`cv/cv-design.html`). After changing it there, refresh this copy and push:

```sh
scripts/sync-cv.py            # expects ../job-search; pass another path if needed
git add cv && git commit -m "docs(cv): sync from job-search" && git push
```

The script strips the phone line, refuses to run if a phone-like number remains, prints the PDF with headless Chrome and checks that it is one page.
