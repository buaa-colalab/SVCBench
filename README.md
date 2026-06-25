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

## Files

- `index.html`: homepage markup and content
- `styles.css`: luxe dark/light theme, aurora background, glass cards, responsive layout
- `main.js`: scroll-reveal, animated counters, interactive timeline, data-driven leaderboard, theme toggle, copy BibTeX
- `assets/og-card.svg`: social preview card
- `assets/favicon.svg`: site icon

## Remaining Real Assets To Add

- final arXiv or proceedings paper link
- supplementary link, if released separately
- teaser figure or overview figure
- two or three short timeline examples
- optional video demo montage
- optional leaderboard or submission instructions

The current version keeps those slots visible but avoids depending on unfinished camera-ready assets.
