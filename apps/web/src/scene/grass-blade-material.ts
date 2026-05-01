import { Effect, type Scene, ShaderMaterial, Vector3 } from '@babylonjs/core';
import type { GrassPalette } from './grass-palette';

const SHADER_NAME = 'auraGrassBlade';

const vertexShader = `
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec4 world0;
attribute vec4 world1;
attribute vec4 world2;
attribute vec4 world3;

uniform mat4 viewProjection;
uniform float time;

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vWorldPos;
varying float vWindTilt;

void main(void) {
  mat4 finalWorld = mat4(world0, world1, world2, world3);
  vec4 worldPos = finalWorld * vec4(position, 1.0);

  float windInfluence = uv.y * uv.y;
  float phase = worldPos.x * 0.22 + worldPos.z * 0.18;
  float wave = sin(time * 1.1 + phase) * 0.7 + sin(time * 2.3 + phase * 1.7) * 0.3;
  worldPos.x += wave * 0.09 * windInfluence;
  worldPos.z += wave * 0.05 * windInfluence;

  gl_Position = viewProjection * worldPos;
  vWorldPos = worldPos.xyz;
  vUv = uv;
  vNormalW = normalize((finalWorld * vec4(normal, 0.0)).xyz);
  vWindTilt = wave * windInfluence;
}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vWorldPos;
varying float vWindTilt;

uniform vec3 baseColor;
uniform vec3 tipColor;
uniform vec3 lightDir;
uniform vec3 lightColor;
uniform vec3 cameraPosition;

void main(void) {
  vec3 nLight = normalize(-lightDir);
  vec3 viewDir = normalize(cameraPosition - vWorldPos);

  float h = smoothstep(0.0, 1.0, vUv.y);
  vec3 grad = mix(baseColor, tipColor, h);
  grad *= mix(0.78, 1.0, smoothstep(0.0, 0.25, vUv.y));

  vec3 n = normalize(vNormalW + vec3(vWindTilt * 1.6, 0.0, vWindTilt * 0.8));
  float ndl = clamp(dot(n, nLight), 0.0, 1.0);
  vec3 diffuse = grad * lightColor * (0.7 + 0.3 * ndl);

  float backlit = pow(clamp(dot(-nLight, viewDir), 0.0, 1.0), 2.5);
  diffuse += tipColor * lightColor * backlit * 0.65 * h;

  vec3 halfDir = normalize(viewDir + nLight);
  float spec = pow(clamp(dot(n, halfDir), 0.0, 1.0), 28.0);
  float specMask = smoothstep(0.35, 1.0, vUv.y);
  diffuse += lightColor * spec * specMask * 0.85;

  gl_FragColor = vec4(diffuse, 1.0);
}
`;

function registerShaders(): void {
  if (Effect.ShadersStore[`${SHADER_NAME}VertexShader`]) return;
  Effect.ShadersStore[`${SHADER_NAME}VertexShader`] = vertexShader;
  Effect.ShadersStore[`${SHADER_NAME}FragmentShader`] = fragmentShader;
}

export interface GrassBladeMaterial {
  material: ShaderMaterial;
  setPalette: (palette: GrassPalette) => void;
  setLightDirection: (dir: Vector3) => void;
  dispose: () => void;
}

export function createGrassBladeMaterial(
  scene: Scene,
  palette: GrassPalette,
  lightDirection: Vector3,
): GrassBladeMaterial {
  registerShaders();

  const material = new ShaderMaterial(
    'grass-blade-material',
    scene,
    { vertex: SHADER_NAME, fragment: SHADER_NAME },
    {
      attributes: ['position', 'normal', 'uv', 'world0', 'world1', 'world2', 'world3'],
      uniforms: [
        'viewProjection',
        'cameraPosition',
        'baseColor',
        'tipColor',
        'lightDir',
        'lightColor',
        'time',
      ],
    },
  );

  material.backFaceCulling = true;

  const setPalette = (p: GrassPalette): void => {
    material.setColor3('baseColor', p.base);
    material.setColor3('tipColor', p.tip);
    material.setColor3('lightColor', p.sun);
  };

  const lightDirNorm = new Vector3();
  const setLightDirection = (dir: Vector3): void => {
    dir.normalizeToRef(lightDirNorm);
    material.setVector3('lightDir', lightDirNorm);
  };

  setPalette(palette);
  setLightDirection(lightDirection);

  const startedAt = performance.now();
  const WIND_INTERVAL_MS = 33;
  let lastTick = 0;
  material.setFloat('time', 0);
  const tickObserver = scene.onBeforeRenderObservable.add(() => {
    const now = performance.now();
    if (now - lastTick < WIND_INTERVAL_MS) return;
    lastTick = now;
    material.setFloat('time', (now - startedAt) * 0.001);
  });

  return {
    material,
    setPalette,
    setLightDirection,
    dispose: () => {
      if (tickObserver) scene.onBeforeRenderObservable.remove(tickObserver);
      material.dispose(true, true);
    },
  };
}
