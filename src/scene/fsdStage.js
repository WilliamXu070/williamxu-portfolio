// Adapted from William's FSD simulator/runtime-scene.js. Asset provenance is in
// public/fsd/ATTRIBUTION.md. Keep the source materials, environment and lights.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function createStage(viewport) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.05;
  viewport.prepend(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(.027, .027, .032);
  scene.fog = new THREE.Fog(scene.background, 125, 340);
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 1500);
  camera.up.set(0, 0, 1);
  const sun = new THREE.DirectionalLight(0xe4e9f1, 2.2);
  sun.position.set(-30, -50, 80); scene.add(sun);
  const fill = new THREE.HemisphereLight(0xc7d6e8, 0x252830, 1.6);
  fill.position.set(0, 0, 1); scene.add(fill);
  const pmrem = new THREE.PMREMGenerator(renderer), studio = new RoomEnvironment();
  const environment = pmrem.fromScene(studio, .04);
  scene.environment = environment.texture;
  scene.environmentIntensity = .45;
  studio.dispose(); pmrem.dispose();
  return { renderer, scene, camera, environment };
}

export function wrappedAsset(gltf) {
  const root = new THREE.Group(); gltf.rotation.x = Math.PI / 2; root.add(gltf);
  gltf.traverse(object => { if (object.isMesh && /BoneShape|custom_shape|WGT-/i.test(object.name)) object.visible = false; });
  return root;
}

export function attachEgoLights(ego, manifest) {
  for (const info of manifest.lights) {
    const red = info.name.includes('Tail');
    const lamp = new THREE.SpotLight(new THREE.Color(...info.color), red ? 95 : 1550, red ? 10 : 45,
      THREE.MathUtils.degToRad(info.cone_degrees / 2), .8, 2);
    lamp.position.fromArray(info.local_position);
    lamp.target.position.copy(lamp.position).add(new THREE.Vector3(red ? -.8 : 1, 0, red ? -.6 : -.2).multiplyScalar(10));
    ego.add(lamp, lamp.target);
  }
}
