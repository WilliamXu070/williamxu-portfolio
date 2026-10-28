# Portfolio composition and interaction redesign

Primary reference: https://janekoo.design/ — large product compositions, restrained navigation, consistent image treatment, short captions.
Interaction reference: https://www.tifftedy.com/work/tesla-cybertruck — direct selection on a product image, with an explanation of the selected part.

## Direction

The homepage opens with the original full-screen animated FSD scene, William's name and restrained navigation. Scrolling leads directly to a light gallery of William's actual instruments, interfaces and research. A dark inspection surface inside the gallery lets the reader examine the CellScope prototype. Case studies reuse this inspection surface to connect original images to engineering decisions. No borrowed Tesla artwork or branding.

Palette: paper #f5f5f3, white #ffffff, ink #171a20, secondary #62666d, dark stage #17191c, selection #3166cb. Blue is a functional selection state, not a decorative accent.

Type: Helvetica Neue / Arial for direct, readable headings and body. The hero uses Segoe UI Variable Display at a light weight; the gallery uses regular and medium weights. Display 50–124 px; project titles 32–48 px; body 16–18 px. Body text and evidence captions maintain readable contrast.

Layout: 32–64 px outer margins, a full-screen FSD opening, one large CellScope inspection surface, two large FRIDAY / WaferWatch compositions, a wide photonics composition, an FSD case-study link, and a compact index for the remaining work. Caption and ownership stay adjacent to each project.

```text
[Full-screen recorded FSD scene]
William Xu                         Projects / About / Contact
Optics, perception, and hardware.
About this scene    CellScope / FSD / WaferWatch    Pause

CellScope                                   Research prototype
[large original instrument + selectable parts][explanation]
[acquisition / resolution / field of view controls]
[FRIDAY room, large]          [WaferWatch interface]
[Photonics original geometry] [research context]
Other work / about / recognition / contact
```

Review against the brief: retain the full-screen FSD hero and use the new gallery composition underneath. Avoid a second homepage playback section; FSD remains accessible from the hero and project directory. Keep real colour in photographs and screenshots. Give small plots and notebook pages a place in the evidence viewer, rather than treating them as photographic covers. Keep every existing first-person narrative and all source captions/credits unchanged. The result must be readable without activating hotspots; all image selectors and details must work by keyboard and touch.

## Evidence boundaries

CellScope reported acquisition time is not reconstruction runtime. FRIDAY's room is a credited licensed scene and commerce is sandbox-only. WaferWatch's available image is an earlier prototype. Photonics geometry is an archived configuration, not measured transmission. HALO has implementation evidence but no recovered phone UI capture. Preserve these distinctions in the viewer.

## Verification

Build and scoped lint; scene lifecycle tests; desktop and mobile browser review; keyboard hotspot/image selection; case-study navigation, source links and image loading; all 16 original narratives unchanged. Continue the existing draft PR, without merging or deploying production.

Browser review confirmed keyboard selection, case-study navigation, source attribution, scene playback and canvas disposal. The 320 px overflow in the scene player was corrected by constraining its width. The original project content hash is unchanged. See `redesign-verification.json` and the `redesign-*.png` screenshots.

The full-screen FSD opening was restored while retaining the new gallery below it. The duplicate lower homepage player was removed; FSD is linked from the hero and project directory. Browser review at 1440, 390 and 320 px confirmed the hero, clean project anchor, all 16 project links, original evidence selection, automatic playback, pause/resume, reduced-motion handling and disposal when entering a case study. Updated hero screenshots and the `heroRestoration` verification entry describe the current composition.
