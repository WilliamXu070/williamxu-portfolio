import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { playbackFrame } from '../src/scene/playback.mjs';

const folder = new URL('../public/fsd/', import.meta.url);
const recording = JSON.parse(await readFile(new URL('recording.json', folder), 'utf8'));

test('recording retains chronological source observations and finite geometry', () => {
  assert.equal(recording.frames.length, 40);
  let previous = -1;
  for (const frame of recording.frames) {
    assert.ok(frame.time > previous && frame.time < recording.duration);
    assert.equal(frame.pose.length, 16); assert.ok(frame.pose.every(Number.isFinite));
    assert.equal(new Set(frame.actors.map(actor => actor.id)).size, frame.actors.length);
    for (const actor of frame.actors) { assert.equal(actor.box.length, 7); assert.ok(actor.box.every(Number.isFinite)); assert.ok(actor.box.slice(3, 6).every(size => size > 0)); assert.ok(actor.score >= .55); }
    previous = frame.time;
  }
  assert.ok(recording.width * recording.atlasColumns <= 2048);
  assert.ok(recording.height * recording.atlasRows <= 2048);
});

test('playback holds the last observation and loops without blending to unrelated geometry', () => {
  const tail = playbackFrame(recording.frames, recording.duration, recording.duration - .001);
  assert.equal(tail.index, 39); assert.equal(tail.nextIndex, 39); assert.equal(tail.blend, 0);
  const wrapped = playbackFrame(recording.frames, recording.duration, recording.duration + .1);
  assert.equal(wrapped.index, 0); assert.equal(wrapped.nextIndex, 1); assert.ok(wrapped.blend > 0 && wrapped.blend < 1);
  const boundary = playbackFrame(recording.frames, recording.duration, recording.frames[15].time);
  assert.equal(boundary.index, 15); assert.ok(Math.abs(boundary.blend) < 1e-10);
});

test('public scene assets match the retained export hashes', async () => {
  const provenance = JSON.parse(await readFile(new URL('provenance.json', folder), 'utf8'));
  for (const [name, expected] of Object.entries(provenance.files)) {
    const bytes = await readFile(new URL(name, folder));
    assert.equal(bytes.length, expected.bytes, name);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), expected.sha256, name);
  }
});
