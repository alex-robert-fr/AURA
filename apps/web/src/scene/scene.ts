import {
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from '@babylonjs/core';
import { type Era, useCityStore } from '../store/city-store';

const eraClearColor: Record<Era, Color4> = {
  genesis: new Color4(0.08, 0.09, 0.12, 1),
  industria: new Color4(0.04, 0.05, 0.08, 1),
  singularity: new Color4(0.05, 0.02, 0.08, 1),
};

export function createCityScene(canvas: HTMLCanvasElement): () => void {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
  const scene = new Scene(engine);
  scene.clearColor = eraClearColor[useCityStore.getState().era];

  const camera = new ArcRotateCamera(
    'camera',
    -Math.PI / 4,
    Math.PI / 3.2,
    24,
    Vector3.Zero(),
    scene,
  );
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 8;
  camera.upperRadiusLimit = 80;
  camera.lowerBetaLimit = 0.2;
  camera.upperBetaLimit = Math.PI / 2.2;

  const light = new HemisphericLight('light', new Vector3(0.4, 1, 0.2), scene);
  light.intensity = 0.85;
  light.groundColor = new Color3(0.15, 0.18, 0.25);

  const ground = MeshBuilder.CreateGround('ground', { width: 40, height: 40 }, scene);
  ground.position.y = 0;

  const placeholder = MeshBuilder.CreateBox('genesis-monument', { size: 1.5 }, scene);
  placeholder.position.y = 0.75;

  engine.renderEvenInBackground = false;

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

  const unsubscribeStore = useCityStore.subscribe((state, prev) => {
    if (state.era !== prev.era) {
      scene.clearColor = eraClearColor[state.era];
    }
  });

  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    stopRender();
    unsubscribeStore();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('resize', onResize);
    scene.dispose();
    engine.dispose();
  };
}
