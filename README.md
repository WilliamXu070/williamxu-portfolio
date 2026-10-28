# William Xu — Engineering portfolio

An image-led portfolio of optics, hardware, perception and software projects. The current draft uses Jane Koo's product compositions and Tiffany Tedy's interactive Cybertruck guide as design references. All project images are retained engineering evidence, with source credits and development-stage qualifications.

## Run and verify

```sh
npm ci
npm run dev
npm run lint:experiment
npm run test:scene
npm run build
```

Vite uses the `/williamxu-portfolio/` base path. The current entry point is `src/PortfolioExperiment.jsx`; `src/App.jsx` is a retained earlier version.

## Content and interactions

- `src/content/projects.json`: the 16 first-person project accounts, source links and evidence captions.
- `src/content/inspection.js`: image view labels and selectable engineering annotations. Point coordinates are percentages of the original image.
- `src/components/EvidenceExplorer.jsx`: accessible image views, hotspots, captions, source credits and links to the matching design account. Tabs support arrow, Home and End keys; every hotspot also has a text button.
- `src/components/PerceptionFeature.jsx`: user-activated FSD playback. The Three.js scene loads only after activation, respects reduced motion and is disposed when closed or when navigating away.
- `public/projects/evidence/`: original curated project media and provenance.
- `public/fsd/`: the recorded perception scene and its asset/dataset attribution.
- `src/portfolio.css`: gallery, viewer, case-study and responsive styling.

## Review status

Branch `test/fsd-portfolio` is a draft review branch. Its GitHub workflow validates and uploads a build artifact; it does not deploy to production.

See `docs/tesla-composition-redesign.md` for the design rationale and `docs/redesign-verification.json` for the verification record. Earlier design documents and screenshots describe historical iterations.

## References

- [Jane Koo](https://janekoo.design/): large product compositions, image treatment and restrained navigation.
- [Tiffany Tedy's Cybertruck guide](https://www.tifftedy.com/work/tesla-cybertruck): selecting components to understand a system.

The portfolio uses William's own project evidence and credited team material. It is not affiliated with Tesla and does not reuse the reference designers' artwork.
