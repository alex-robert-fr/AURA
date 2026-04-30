import { Effect, type Scene, ShaderMaterial, type Vector3 } from '@babylonjs/core';
import type { GrassPalette } from './grass-palette';

const SHADER_NAME = 'auraGrassBlade';
let registered = false;

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

varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vWorldPos;

void main(void) {
  mat4 finalWorld = mat4(world0, world1, world2, world3);
  vec4 worldPos = finalWorld * vec4(position, 1.0);
  gl_Position = viewProjection * worldPos;
  vWorldPos = worldPos.xyz;
  vUv = uv;
  vNormalW = normalize((finalWorld * vec4(normal, 0.0)).xyz);
}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vWorldPos;

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

  vec3 n = normalize(vNormalW);
  float ndl = clamp(dot(n, nLight), 0.0, 1.0);
  vec3 diffuse = grad * lightColor * (0.7 + 0.3 * ndl);

  float backlit = pow(clamp(dot(-nLight, viewDir), 0.0, 1.0), 2.5);
  diffuse += tipColor * lightColor * backlit * 0.65 * h;

  gl_FragColor = vec4(diffuse, 1.0);
}
`;

function registerShaders(): void {
  if (registered) return;
  Effect.ShadersStore[`${SHADER_NAME}VertexShader`] = vertexShader;
  Effect.ShadersStore[`${SHADER_NAME}FragmentShader`] = fragmentShader;
  registered = true;
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
      ],
    },
  );

  material.backFaceCulling = false;

  const setPalette = (p: GrassPalette): void => {
    material.setColor3('baseColor', p.base);
    material.setColor3('tipColor', p.tip);
    material.setColor3('lightColor', p.sun);
  };

  const setLightDirection = (dir: Vector3): void => {
    material.setVector3('lightDir', dir.normalizeToNew());
  };

  setPalette(palette);
  setLightDirection(lightDirection);

  return {
    material,
    setPalette,
    setLightDirection,
    dispose: () => material.dispose(true, true),
  };
}
