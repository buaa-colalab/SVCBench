# SVCBench Project Homepage Draft

This folder is an independent static prototype for the SVCBench project homepage. It does not modify the paper source, camera-ready files, data files, or existing GitHub/Hugging Face links.

## Why Use A Project Homepage

The paper currently points directly to GitHub and Hugging Face. A single project homepage is cleaner for the camera-ready PDF because it can act as the stable entry point for:

- paper and supplementary PDF links
- code repository
- Hugging Face dataset
- examples, videos, and teaser figures
- leaderboard or evaluation server
- changelog and release notes

Recommended final paper link:

```text
https://buaa-colalab.github.io/SVCBench/
```

Two practical publishing options:

- Use the existing `buaa-colalab/SVCBench` repository and enable GitHub Pages from a `docs/` folder or `gh-pages` branch.
- Create a dedicated public repository such as `buaa-colalab/SVCBench_page`, then enable Pages from its root.

## Local Preview

From this folder:

```bash
python3 -m http.server 8123 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:8123
```

A static server must be running; opening `index.html` directly with `file://` can break Google Fonts and the leaderboard script.

## Design

The page uses a restrained editorial direction: ink-on-paper light theme, a single
deep-navy accent, hairline rules instead of glass cards, and real paper figures rather
than decorative gradients. Motion is intentionally minimal (scroll-reveal plus the
leaderboard bar fill), implemented with GSAP ScrollTrigger and disabled under
`prefers-reduced-motion`.

## Files

- `index.html`: page markup and content
- `styles.css`: editorial light theme, single accent, responsive layout
- `main.js`: data-driven leaderboard, GSAP scroll-reveal, nav highlight, copy BibTeX
- `assets/figures/`: figures exported from the paper (overview, taxonomy, construction, oracle, rotation)
- `assets/og-card.svg`: social preview card
- `assets/favicon.svg`: site icon

## Remaining Real Assets To Add

- final arXiv or proceedings paper link (the hero `Paper` button currently points to `#`)
- supplementary link, if released separately
- optional short timeline-example clips or a demo montage

Figures are exported from `SVCBench_FINAL/figures/*.pdf` with
`pdftocairo -png -r 200 -singlefile`. Re-run that command to refresh them if the paper
figures change.
