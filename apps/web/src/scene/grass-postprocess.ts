import {
  type ArcRotateCamera,
  DefaultRenderingPipeline,
  DepthOfFieldEffectBlurLevel,
  ImageProcessingConfiguration,
  type Scene,
} from '@babylonjs/core';

const IDLE_DELAY_MS = 1000;

export interface GrassPostprocess {
  dispose: () => void;
}

export function createGrassPipeline(scene: Scene, camera: ArcRotateCamera): GrassPostprocess {
  const pipeline = new DefaultRenderingPipeline('grass-pipeline', true, scene, [camera]);

  pipeline.depthOfFieldEnabled = true;
  pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Low;
  pipeline.depthOfField.focalLength = 50;
  pipeline.depthOfField.focusDistance = 18000;
  pipeline.depthOfField.fStop = 2.2;
  pipeline.depthOfField.lensSize = 50;

  pipeline.imageProcessingEnabled = true;
  pipeline.imageProcessing.toneMappingEnabled = true;
  pipeline.imageProcessing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
  pipeline.imageProcessing.contrast = 1.1;
  pipeline.imageProcessing.exposure = 1;

  pipeline.fxaaEnabled = true;

  let lastAlpha = camera.alpha;
  let lastBeta = camera.beta;
  let lastRadius = camera.radius;
  let lastChangeAt = performance.now();
  let dofActive = true;

  const observer = scene.onBeforeRenderObservable.add(() => {
    const moved =
      camera.alpha !== lastAlpha || camera.beta !== lastBeta || camera.radius !== lastRadius;

    if (moved) {
      lastAlpha = camera.alpha;
      lastBeta = camera.beta;
      lastRadius = camera.radius;
      lastChangeAt = performance.now();
      if (!dofActive) {
        pipeline.depthOfFieldEnabled = true;
        dofActive = true;
      }
      return;
    }

    if (dofActive && performance.now() - lastChangeAt > IDLE_DELAY_MS) {
      pipeline.depthOfFieldEnabled = false;
      dofActive = false;
    }
  });

  return {
    dispose: () => {
      scene.onBeforeRenderObservable.remove(observer);
      pipeline.dispose();
    },
  };
}
