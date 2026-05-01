import {
  ArcRotateCamera,
  Color3,
  Color4,
  DirectionalLight,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from '@babylonjs/core';
import { useCityStore } from '../store/city-store';
import { createDirtGround } from './dirt-ground';
import { attachFpsCounter } from './fps-counter';
import { animatePaletteTo } from './grass-era-transition';
import { createGrassField } from './grass-field';
import { type GrassPalette, eraGrassPalette } from './grass-palette';
import { createGrassPipeline } from './grass-postprocess';

const ERA_TRANSITION_MS = 2000;
const SUN_DIRECTION = new Vector3(-0.4, -1, -0.3);

export function createCityScene(canvas: HTMLCanvasElement): () => void {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
  const scene = new Scene(engine);

  const initialPalette = eraGrassPalette[useCityStore.getState().era];
  scene.clearColor = initialPalette.sky.clone();

  const camera = new ArcRotateCamera(
    'camera',
    -Math.PI / 4,
    Math.PI / 2.4,
    14,
    new Vector3(0, 0.6, 0),
    scene,
  );
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 4;
  camera.upperRadiusLimit = 40;
  camera.lowerBetaLimit = 0.6;
  camera.upperBetaLimit = Math.PI / 2.15;
  camera.minZ = 0.1;

  const sun = new DirectionalLight('sun', SUN_DIRECTION.normalizeToNew(), scene);
  sun.intensity = 1;
  sun.diffuse = initialPalette.sun.clone();
  sun.specular = new Color3(0, 0, 0);

  const ambient = new HemisphericLight('ambient', new Vector3(0, 1, 0), scene);
  ambient.intensity = 0.35;
  ambient.diffuse = new Color3(0.7, 0.78, 0.85);
  ambient.groundColor = new Color3(0.2, 0.22, 0.2);

  const dirtGround = createDirtGround(scene, initialPalette);
  const grassField = createGrassField(scene, initialPalette, SUN_DIRECTION);

  const placeholder = MeshBuilder.CreateBox('genesis-monument', { size: 1.5 }, scene);
  placeholder.position.y = 0.75;

  const pipeline = createGrassPipeline(scene, camera);

  engine.renderEvenInBackground = false;

  const detachFpsCounter = attachFpsCounter(scene, engine);

  const renderTick = () => scene.render();
  const startRender = () => engine.runRenderLoop(renderTick);
  const stopRender = () => engine.stopRenderLoop();

  if (!document.hidden) startRender();

  const onVisibilityChange = () => {
    if (document.hidden) stopRender();
    else startRender();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  const onResize = () => engine.resize();
  window.addEventListener('resize', onResize);

  let currentPalette: GrassPalette = initialPalette;
  let cancelEraTransition: (() => void) | null = null;

  const applyPalette = (p: GrassPalette): void => {
    currentPalette = p;
    grassField.setPalette(p);
    dirtGround.setPalette(p);
    sun.diffuse = p.sun.clone();
    scene.clearColor = new Color4(p.sky.r, p.sky.g, p.sky.b, p.sky.a);
  };

  const unsubscribeStore = useCityStore.subscribe((state, prev) => {
    if (state.era === prev.era) return;
    cancelEraTransition?.();
    const result = animatePaletteTo(
      scene,
      currentPalette,
      eraGrassPalette[state.era],
      ERA_TRANSITION_MS,
      { apply: applyPalette },
    );
    cancelEraTransition = result.cancel;
  });

  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    stopRender();
    cancelEraTransition?.();
    unsubscribeStore();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('resize', onResize);
    detachFpsCounter();
    pipeline.dispose();
    grassField.dispose();
    dirtGround.dispose();
    placeholder.dispose();
    sun.dispose();
    ambient.dispose();
    scene.dispose();
    engine.dispose();
  };
}
