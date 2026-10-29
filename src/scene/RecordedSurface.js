import * as THREE from 'three';

// The FSD TemporalSurface material, adapted only to read lossless atlases instead
// of uploading the same two RGBA buffers at every recorded keyframe.
export class RecordedSurface {
  constructor(scene, recording, current, next) {
    const { width, height, minimum, step, atlasColumns, atlasRows } = recording;
    this.uniforms = {
      roadPrevious: { value: current }, roadCurrent: { value: next },
      roadBlend: { value: 0 }, roadIndex: { value: 0 },
      roadAtlasSize: { value: new THREE.Vector2(atlasColumns, atlasRows) },
      roadFrameSize: { value: new THREE.Vector2(width, height) }
    };
    this.material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, side: THREE.DoubleSide, transparent: true, depthWrite: false });
    this.material.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.vertexShader = 'varying vec2 roadUv; varying vec3 roadPosition;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nroadUv=uv;roadPosition=(modelMatrix*vec4(position,1.0)).xyz;');
      shader.fragmentShader = `uniform sampler2D roadPrevious; uniform sampler2D roadCurrent;
        uniform float roadBlend; uniform float roadIndex;
        uniform vec2 roadAtlasSize; uniform vec2 roadFrameSize;
        varying vec2 roadUv; varying vec3 roadPosition;
        vec2 atlasUv() {
          vec2 tile=vec2(mod(roadIndex,roadAtlasSize.x),floor(roadIndex/roadAtlasSize.x));
          vec2 localUv=clamp(roadUv,.5/roadFrameSize,1.0-.5/roadFrameSize);
          return (tile+localUv)/roadAtlasSize;
        }\n` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
        vec4 a=texture2D(roadPrevious,atlasUv()),b=texture2D(roadCurrent,atlasUv());
        float support=mix(a.g,b.g,roadBlend);
        float belief=mix(a.r*a.g,b.r*b.g,roadBlend)/max(.0001,support);
        float road=smoothstep(.40,.60,belief);
        diffuseColor.rgb=mix(vec3(.065,.070,.078),vec3(.012,.014,.018),road);
        float coverage=mix(a.b,b.b,roadBlend);
        diffuseColor.a*=coverage*(1.0-smoothstep(18.0,38.0,length(roadPosition.xy)));
        if(diffuseColor.a<.002)discard;
      `);
    };
    this.group = new THREE.Group(); this.group.matrixAutoUpdate = false;
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(width * step, height * step), this.material);
    this.mesh.position.set(minimum + width * step / 2, minimum + height * step / 2, 0);
    this.group.add(this.mesh); scene.add(this.group);
  }
  update(matrix, ground, index, blend) {
    const m = matrix.elements;
    this.group.matrix.fromArray([
      m[0], m[1], 0, 0, m[4], m[5], 0, 0, 0, 0, 1, 0,
      m[12] + m[8] * ground, m[13] + m[9] * ground, 0, 1
    ]);
    this.group.matrixWorldNeedsUpdate = true;
    this.uniforms.roadIndex.value = index; this.uniforms.roadBlend.value = blend;
  }
}
