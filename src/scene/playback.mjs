export function playbackFrame(frames, duration, elapsed) {
  if (!frames.length || !(duration > 0)) throw new Error('Recording has no playable frames');
  const time = ((elapsed % duration) + duration) % duration;
  let index = 0;
  while (index + 1 < frames.length && frames[index + 1].time <= time) index++;
  const nextIndex = Math.min(index + 1, frames.length - 1);
  const span = frames[nextIndex].time - frames[index].time;
  return { time, index, nextIndex, blend: span > 0 ? Math.min(1, Math.max(0, (time - frames[index].time) / span)) : 0 };
}

export function smoothstep(start, end, value) {
  const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}
