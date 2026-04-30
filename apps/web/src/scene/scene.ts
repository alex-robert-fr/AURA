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

export function createCityScene(canvas: HTMLCanvasElement): () => void {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.04, 0.05, 0.08, 1);

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

  const light = new HemisphericLight('light', new Vector3(0.4, 1, 0.2), scene);
  light.intensity = 0.85;
  light.groundColor = new Color3(0.15, 0.18, 0.25);

  const ground = MeshBuilder.CreateGround('ground', { width: 40, height: 40 }, scene);
  ground.position.y = 0;

  const placeholder = MeshBuilder.CreateBox('genesis-monument', { size: 1.5 }, scene);
  placeholder.position.y = 0.75;

  engine.runRenderLoop(() => scene.render());

  const onResize = () => engine.resize();
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
    scene.dispose();
    engine.dispose();
  };
}
