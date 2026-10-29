import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';
import { createStage, wrappedAsset, attachEgoLights } from './fsdStage.js';
import { RecordedSurface } from './RecordedSurface.js';
import { playbackFrame, smoothstep } from './playback.mjs';

const ONE = new THREE.Vector3(1, 1, 1), Z = new THREE.Vector3(0, 0, 1);
const url = name => `${import.meta.env.BASE_URL}fsd/${name}`;
const heading = q => Math.atan2(2 * (q.w * q.z + q.x * q.y), 1 - 2 * (q.y * q.y + q.z * q.z));

function disposeObjects(roots) {
  const geometries = new Set(), materials = new Set(), textures = new Set();
  for (const root of roots) root?.traverse(object => {
    if (object.geometry) geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : object.material ? [object.material] : []) materials.add(material);
  });
  for (const material of materials) for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
  geometries.forEach(item => item.dispose()); textures.forEach(item => item.dispose()); materials.forEach(item => item.dispose());
}

function normalizedActor(template) {
  const wrapper = wrappedAsset(cloneSkeleton(template)); wrapper.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(wrapper), size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
  wrapper.position.set(-center.x, -center.y, -bounds.min.z);
  const root = new THREE.Group(); root.add(wrapper); root.userData.nativeSize = size;
  root.traverse(object => {
    if (!object.isMesh) return;
    const copy = original => { const material = original.clone(); material.transparent = true; material.userData.sourceOpacity = original.opacity; return material; };
    object.material = Array.isArray(object.material) ? object.material.map(copy) : copy(object.material);
  });
  return root;
}

export function createFsdScene(host, { paused: initialPaused = false, onReady, onError } = {}) {
  const { renderer, scene, camera, environment } = createStage(host);
  let disposed = false, paused = initialPaused, inView = true, loaded = false;
  let animation = 0, previousStamp = 0, lastDraw = 0, elapsed = 0;
  const query = new URLSearchParams(location.search);
  if (query.has('still')) { paused = true; elapsed = Number(query.get('t') || 0); }
  const actors = new Map(), roots = [], atlases = [];
  const loader = new GLTFLoader(), textureLoader = new THREE.TextureLoader();
  let recording, settings, frames, ego, surface, wheels = [];
  const egoMatrix = new THREE.Matrix4(), egoInverse = new THREE.Matrix4(), roadRelative = new THREE.Matrix4();
  const posePosition = new THREE.Vector3(), poseRotation = new THREE.Quaternion();
  const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3(), wheelRotation = new THREE.Quaternion();
  const localPosition = new THREE.Vector3(), localRotation = new THREE.Quaternion();

  function resize() {
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height || disposed) return;
    renderer.setSize(width, height, false); camera.aspect = width / height;
    // Retain the original following-camera composition; bound portrait FOV.
    camera.fov = THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(2 * Math.atan(36 / (2 * 32 * camera.aspect))), 28, 65);
    camera.filmOffset = 36 * .0059912852011621; camera.updateProjectionMatrix();
    if (loaded) draw();
  }

  function draw() {
    if (!loaded || disposed) return;
    const { time, index, nextIndex, blend } = playbackFrame(frames, recording.duration, elapsed);
    const a = frames[index], b = frames[nextIndex];
    posePosition.lerpVectors(a.p, b.p, blend); poseRotation.slerpQuaternions(a.q, b.q, blend);
    egoMatrix.compose(posePosition, poseRotation, ONE); egoInverse.copy(egoMatrix).invert();
    roadRelative.multiplyMatrices(egoInverse, a.matrix); surface.update(roadRelative, a.ground, index, blend);
    for (const actor of actors.values()) actor.visible = false;
    for (const observation of a.actors) {
      let root = actors.get(observation.id);
      if (!root) { root = normalizedActor(roots[observation.label + 1]); actors.set(observation.id, root); scene.add(root); }
      const next = b.byTrack.get(observation.id);
      const matches = next && observation.position.distanceTo(next.position) <= 2 + 20 * (b.time - a.time);
      if (matches) { p.lerpVectors(observation.position, next.position, blend); q.slerpQuaternions(observation.rotation, next.rotation, blend); s.lerpVectors(observation.size, next.size, blend); }
      else { p.copy(observation.position); q.copy(observation.rotation); s.copy(observation.size); }
      localPosition.copy(p).applyMatrix4(egoInverse); localRotation.copy(poseRotation).invert().multiply(q);
      root.position.set(localPosition.x, localPosition.y, 0); root.quaternion.setFromAxisAngle(Z, heading(localRotation)); root.scale.copy(s).divide(root.userData.nativeSize);
      const opacity = 1 - smoothstep(18, 38, Math.hypot(localPosition.x, localPosition.y));
      root.visible = opacity > .005;
      root.traverse(object => { for (const material of Array.isArray(object.material) ? object.material : object.material ? [object.material] : []) material.opacity = material.userData.sourceOpacity * opacity; });
    }
    const distance = THREE.MathUtils.lerp(a.distance, b.distance, blend);
    wheelRotation.setFromAxisAngle(Z, distance / .455);
    for (const wheel of wheels) wheel.quaternion.copy(wheel.userData.baseQ).multiply(wheelRotation);
    ego.position.set(0, 0, 0);
    const pitch = THREE.MathUtils.degToRad(settings.camera.pitch_deg);
    camera.position.set(settings.camera.position_m[0], 0, settings.camera.position_m[2]);
    camera.lookAt(camera.position.x + Math.cos(pitch), 0, camera.position.z - Math.sin(pitch));
    renderer.render(scene, camera);
    host.dataset.frame = String(index); host.dataset.time = time.toFixed(3); host.dataset.loops = String(Math.floor(elapsed / recording.duration));
    host.dataset.paused = String(paused);
  }

  function frame(stamp) {
    if (disposed) return;
    animation = requestAnimationFrame(frame);
    if (!inView || document.hidden || paused) { previousStamp = 0; return; }
    if (stamp - lastDraw < 1000 / 30) return;
    if (previousStamp) elapsed += Math.min((stamp - previousStamp) / 1000, .15);
    previousStamp = stamp; lastDraw = stamp; draw();
  }
  const observer = new ResizeObserver(resize); observer.observe(host);
  const intersection = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; previousStamp = 0; }); intersection.observe(host);
  const lost = event => { event.preventDefault(); paused = true; onError?.(new Error('WebGL context was lost')); };
  renderer.domElement.addEventListener('webglcontextlost', lost);

  async function initialize() {
    try {
      const read = async name => { const response = await fetch(url(name)); if (!response.ok) throw new Error(`Scene asset unavailable: ${name}`); return response.json(); };
      const result = await Promise.all([
        read('recording.json'), read('manifest.json'), loader.loadAsync(url('cybertruck.glb')),
        loader.loadAsync(url('detected-car.glb')), loader.loadAsync(url('detected-human.glb')),
        textureLoader.loadAsync(url('surfaces.png')), textureLoader.loadAsync(url('surfaces-next.png'))
      ]);
      recording = result[0]; settings = result[1]; roots.push(...result.slice(2, 5).map(gltf => gltf.scene)); atlases.push(...result.slice(5));
      if (disposed) { disposeObjects(roots); atlases.forEach(texture => texture.dispose()); return; }
      atlases.forEach(texture => { texture.flipY = false; texture.colorSpace = THREE.NoColorSpace; texture.minFilter = texture.magFilter = THREE.LinearFilter; texture.generateMipmaps = false; texture.needsUpdate = true; });
      frames = recording.frames.map(data => {
        const matrix = new THREE.Matrix4().fromArray(data.pose), p = new THREE.Vector3(), q = new THREE.Quaternion(), scale = new THREE.Vector3(); matrix.decompose(p, q, scale);
        const observations = data.actors.map(actor => {
          const [x, y, z, length, width, height, yaw] = actor.box;
          return { ...actor, position: new THREE.Vector3(x, y, z - height / 2).applyMatrix4(matrix), rotation: q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(Z, yaw)), size: new THREE.Vector3(length, width, height) };
        });
        return { ...data, matrix, p, q, actors: observations, byTrack: new Map(observations.map(actor => [actor.id, actor])) };
      });
      let distance = 0; frames.forEach((f, i) => { if (i) distance += f.p.distanceTo(frames[i - 1].p); f.distance = distance; });
      ego = wrappedAsset(roots[0]); scene.add(ego); attachEgoLights(ego, settings);
      ego.traverse(object => { if (object.isMesh && /wheel/i.test(object.name)) { object.userData.baseQ = object.quaternion.clone(); wheels.push(object); } });
      surface = new RecordedSurface(scene, recording, ...atlases); loaded = true; resize();
      await renderer.compileAsync(scene, camera);
      if (disposed) return;
      draw(); host.dataset.ready = 'true'; onReady?.(); animation = requestAnimationFrame(frame);
    } catch (error) { if (!disposed) { host.dataset.error = error.message; onError?.(error); } }
  }
  initialize();
  return {
    setPaused(value) { paused = value; previousStamp = 0; if (loaded) draw(); },
    dispose() {
      disposed = true; cancelAnimationFrame(animation); observer.disconnect(); intersection.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      disposeObjects([scene, ...roots]); atlases.forEach(texture => texture.dispose()); environment.dispose();
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    }
  };
}
