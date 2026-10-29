# Portfolio composition and interaction redesign

The homepage retains the original full-screen animated FSD scene, William's name and restrained navigation. The projects below use a staggered editorial composition: CellScope and photonics at unequal scales, a full-width FRIDAY room view, then an offset WaferWatch / HackerFab pair. Eleven further projects sit in a compact archive with original thumbnails where available. All 16 case studies remain linked.

The gallery foregrounds the original artifacts and William's contribution. Interactive image views, engineering annotations and full first-person accounts remain inside the case studies. There is no second homepage playback section or enclosing inspection dashboard.

## References and visual system

- Gonzalo Morales (https://gmoral.es/): staggered placement and unequal project scale.
- Christine Liang (https://www.christineliangdesign.com/): image-led presentation with short contribution captions.
- Jane Koo (https://janekoo.design/): product composition and restrained navigation.
- Tiffany Tedy (https://www.tifftedy.com/work/tesla-cybertruck): select a part of a system to understand it.

Retain Helvetica Neue / Arial, paper #f5f5f3, ink #171a20 and secondary #62666d. Use real colour from project photographs and screenshots. The maximum gallery width is 1376 px; desktop margins are 72 px and mobile margins are 20 px. On narrow screens, pairs stack in reading order with smaller secondary images. There is no scroll interception or added animation dependency. See `project-composition-2026-10-29.md` for the layout brief.

## Evidence boundaries

CellScope's reported acquisition time is not reconstruction runtime. FRIDAY's room is a credited licensed scene and commerce is sandbox-only. WaferWatch's available image is an earlier prototype. Photonics geometry is an archived configuration, not measured transmission. HackerFab uses a published objective prescription as a proxy. HALO has implementation evidence but no recovered phone UI capture. These distinctions remain explicit in the gallery and detailed viewer.

## Verification

The 29 October composition passed the scoped ESLint command and Vite production build. Browser review at 1440, 390 and 320 px found no horizontal overflow. All five main images and six archive thumbnails loaded, all 16 project links were present, and FRIDAY's evidence-tab selection and return navigation worked. The FSD hero retained playback, pause and reduced-motion handling; no browser console errors were captured. Original project-account content is byte-for-byte unchanged.

The build still reports the existing 583 kB asynchronous Three.js scene chunk warning. Current captures are `composition-projects-desktop.png`, `composition-projects-mobile.png`, `composition-friday-desktop.png`, `composition-friday-mobile.png` and `composition-fabrication-desktop.png`. Earlier captures and verification entries describe previous iterations. Work continues on the existing draft PR without production deployment.
