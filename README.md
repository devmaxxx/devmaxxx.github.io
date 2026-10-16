# devmaxxx.github.io

Personal site of Maksym Synenko, senior full-stack engineer — live at **https://devmaxxx.github.io**.

| Path | What it is |
| --- | --- |
| [`/`](https://devmaxxx.github.io/) | Landing page: about, open-source projects, experience, stack and contact |
| [`/cv/`](https://devmaxxx.github.io/cv/) | Design CV, readable in the browser |
| [`/cv/maksym-synenko-cv.pdf`](https://devmaxxx.github.io/cv/maksym-synenko-cv.pdf) | Same CV as a one-page PDF |

## How it is built

Plain static HTML, no build step and no framework. GitHub Pages serves the `main` branch as is; `.nojekyll` turns Jekyll off.

```
index.html               landing page: inline CSS and JS, light and dark theme
cv/index.html            generated, do not edit by hand
cv/maksym-synenko-cv.pdf generated
scripts/sync-cv.py       refreshes cv/ from the private source
```

The landing page loads two Google Fonts (Archivo, JetBrains Mono) and nothing else. Its animated graph backdrop stops for visitors who prefer reduced motion and while the tab is hidden.

## Updating the CV

The CV source lives in the private `job-search` repo (`cv/cv-design.html`). Edit it there, never in `cv/`, then refresh this copy and push:

```sh
scripts/sync-cv.py            # expects ../job-search; pass another path if needed
git add cv && git commit -m "docs(cv): sync from job-search" && git push
```

The script:

1. copies the design CV and removes the phone line, failing if it does not find exactly one;
2. refuses to continue if anything phone-like is left;
3. prints the PDF with headless Chrome and checks it is one page;
4. adds the PDF download link and print styles to the page.

## Rules for public content

- No phone number and no rate, anywhere on the site.
- Only experience and skills that are on the CV.

## Local preview

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

Pages deploys a push to `main` in about a minute; browsers may keep the old copy for up to 10 minutes.
