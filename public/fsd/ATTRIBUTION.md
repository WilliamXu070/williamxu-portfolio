# FSD scene assets and recording

This portfolio experiment adapts William Xu's existing FSD renderer and retained
validation replay. It contains recorded model outputs, not live browser inference
or an autonomous-driving demonstration. Road display filtering and interpolation
are presentation steps. The hero does not draw additional lanes or traffic.

## Cybertruck

Tesla Cybertruck by **neshallads**, licensed under **CC BY 4.0**.

- Creator: https://sketchfab.com/neshallads
- Source: https://sketchfab.com/3d-models/tesla-cybertruck-3e72defa993c4d81b9deb2eee1ee6054
- License: https://creativecommons.org/licenses/by/4.0/
- Existing FSD adaptations: normalized orientation, scale and position; separated
  wheel geometry and wheel-height corrections; display lighting and wheel motion.
- Portfolio adaptation: reuse of the existing FSD-exported GLB and shared scene
  appearance. No affiliation with or endorsement by Tesla or the creator is implied.

## Gray car and person

Original procedural display meshes created in William's FSD workspace. These are
visualization assets, not additional classes inferred by the model.

## Recorded scene and derived surface atlases

Source dataset: **nuScenes, Motional**. Validation scene **scene-0927**, 40 source
keyframes, approximately 20 seconds at approximately 2 Hz.

License: **Creative Commons Attribution-NonCommercial-ShareAlike 4.0**, subject to
the nuScenes Dataset Terms. This notice covers the recording, derived atlases,
and scene poster; it does not change the separate mesh licenses.

- Dataset and citation: https://www.nuscenes.org/nuscenes
- Terms: https://www.nuscenes.org/terms-of-use
- License: https://creativecommons.org/licenses/by-nc-sa/4.0/
- Citation: Caesar et al., "nuScenes: A multimodal dataset for autonomous driving,"
  CVPR 2020.
- Changes: retained model predictions were filtered with the existing FSD
  presentation estimator. Its belief, support, and coverage buffers were packed
  losslessly into opaque RGB atlases. Matched recorded poses and actors interpolate
  for display. No source camera media, model weights, training data, or ground-truth
  arrays are included. The poster is an existing render of that reconstruction.
- Evidence: `provenance.json` records source identity and output hashes.

This is an independent personal research visualization. No endorsement or
affiliation with Motional is implied. Misses, coarse surfaces, and unstable
predictions remain visible limitations; this selected clip is not an accuracy
benchmark or a claim of generalization.
