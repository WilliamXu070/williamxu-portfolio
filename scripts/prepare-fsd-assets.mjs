import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';

// Offline export only. The production site never reads the research checkout.
const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/prepare-fsd-assets.mjs <fsd-checkout>');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'public/fsd');
await mkdir(output, { recursive: true });
const readJson = async p => JSON.parse(await readFile(p, 'utf8'));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const recordingRoot = path.join(source, 'artifacts/renderer-redesign/dataset-replay/scene-0927');
const recording = await readJson(path.join(recordingRoot, 'stream.json'));
const evidence = await readJson(path.join(recordingRoot, 'road-evidence.json'));
const { TemporalRoad } = await import(pathToFileURL(path.join(source, 'simulator/temporal-road.mjs')));
const { alignNextSurface } = await import(pathToFileURL(path.join(source, 'simulator/replay-interpolation.mjs')));
if (evidence.source_export_sha256 !== recording.manifest.source_export_sha256) throw new Error('FSD source identity mismatch');
if (evidence.frames.length !== recording.frames.length) throw new Error('FSD evidence frame mismatch');

const { width, height } = recording.frames[0].road_display;
const { bev_min: minimum, bev_step: step } = recording.manifest;
const transpose = rows => Array.from({ length: 16 }, (_, i) => rows[i % 4][Math.floor(i / 4)]);
const poses = recording.frames.map(frame => transpose(frame.ego_to_world));
const filter = new TemporalRoad(width, height, minimum, step);
const surfaces = recording.frames.map((frame, i) => {
  if (frame.timestamp !== evidence.frames[i].timestamp) throw new Error('FSD evidence timestamp mismatch');
  return filter.update({ ...evidence.frames[i], time: frame.time, pose: poses[i], ground: frame.ground_z }).target;
});
const nextSurfaces = recording.frames.map((frame, i) => {
  const next = Math.min(i + 1, recording.frames.length - 1);
  return alignNextSurface({ pose: poses[i], ground: frame.ground_z }, { pose: poses[next], target: surfaces[next] }, width, height, minimum, step);
});

// A compact opaque RGB atlas preserves the exact three channels consumed by
// TemporalSurface: belief, support, and coverage. The unused inferred-cell flag
// is not uploaded. Opaque PNG avoids browser premultiplied-alpha corruption.
const columns = 8, rows = Math.ceil(surfaces.length / columns);
const atlasWidth = columns * width, atlasHeight = rows * height;
function atlas(buffers) {
  const output = Buffer.alloc(atlasWidth * atlasHeight * 3);
  for (const [i, bytes] of buffers.entries()) {
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const from = 4 * (y * width + x);
      const to = 3 * ((Math.floor(i / columns) * height + y) * atlasWidth + (i % columns) * width + x);
      output[to] = bytes[from]; output[to + 1] = bytes[from + 1]; output[to + 2] = bytes[from + 3];
    }
  }
  return output;
}
function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) { value ^= byte; for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ (0xedb88320 & -(value & 1)); }
  return (value ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  const name = Buffer.from(type), chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length); name.copy(chunk, 4); data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([name, data])), 8 + data.length); return chunk;
}
function png(bytes) {
  const header = Buffer.alloc(13); header.writeUInt32BE(atlasWidth); header.writeUInt32BE(atlasHeight, 4); header[8] = 8; header[9] = 2;
  const scanlines = Buffer.alloc((atlasWidth * 3 + 1) * atlasHeight);
  for (let y = 0; y < atlasHeight; y++) bytes.copy(scanlines, y * (atlasWidth * 3 + 1) + 1, y * atlasWidth * 3, (y + 1) * atlasWidth * 3);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), pngChunk('IHDR', header), pngChunk('IDAT', deflateSync(scanlines, { level: 9 })), pngChunk('IEND', Buffer.alloc(0))]);
}
const sourceAtlas = atlas(surfaces), nextAtlas = atlas(nextSurfaces);
await writeFile(path.join(output, 'surfaces.png'), png(sourceAtlas));
await writeFile(path.join(output, 'surfaces-next.png'), png(nextAtlas));

const frames = recording.frames.map((frame, i) => ({
  time: frame.time, pose: poses[i], ground: frame.ground_z,
  actors: frame.boxes.flatMap((box, k) => frame.scores[k] >= .55 && [0, 1].includes(frame.labels[k]) ? [{
    id: `${frame.labels[k]}:${frame.track_ids[k]}`, label: frame.labels[k], score: frame.scores[k], box
  }] : [])
}));
const clip = {
  schema: 1, scene: 'scene-0927', model: 'Retained Stage A epoch 18', duration: recording.manifest.duration_seconds,
  sourceKeyframesHz: 2, width, height, minimum, step, atlasColumns: columns, atlasRows: rows,
  checkpoint: recording.manifest.checkpoint_sha256, sourceExport: recording.manifest.source_export_sha256,
  note: 'Recorded model outputs with presentation filtering and offline interpolation. No browser inference or autonomous driving.',
  frames
};
await writeFile(path.join(output, 'recording.json'), JSON.stringify(clip));
const assetRoot = path.join(source, 'artifacts/renderer-redesign/runtime-assets');
for (const name of ['cybertruck.glb', 'detected-car.glb', 'detected-human.glb', 'manifest.json']) await copyFile(path.join(assetRoot, name), path.join(output, name));
await copyFile(path.join(source, 'artifacts/renderer-redesign/dataset-replay/road-threshold-live-verified.jpg'), path.join(output, 'poster.jpg'));
const sources = {};
for (const name of ['runtime-scene.js', 'temporal-surface.js', 'temporal-road.mjs', 'replay-interpolation.mjs', 'presentation-ground.mjs']) sources[`simulator/${name}`] = sha256(await readFile(path.join(source, 'simulator', name)));
const files = {};
for (const name of ['cybertruck.glb', 'detected-car.glb', 'detected-human.glb', 'manifest.json', 'surfaces.png', 'surfaces-next.png', 'recording.json', 'poster.jpg']) {
  const bytes = await readFile(path.join(output, name)); files[name] = { sha256: sha256(bytes), bytes: bytes.length };
}
await writeFile(path.join(output, 'provenance.json'), JSON.stringify({
  exportVersion: 1, scene: clip.scene, checkpoint: clip.checkpoint, sourceExport: clip.sourceExport,
  filters: 'Existing FSD TemporalRoad and alignNextSurface, unchanged; actor display threshold 0.55.',
  atlasEncoding: 'RGB = original filtered belief, support, coverage; no color conversion. Eight by five frames.',
  decodedAtlasSha256: { current: sha256(sourceAtlas), next: sha256(nextAtlas) }, sources, files
}, null, 2));
console.log(JSON.stringify({ scene: clip.scene, frames: frames.length, atlas: [atlasWidth, atlasHeight], files }, null, 2));
