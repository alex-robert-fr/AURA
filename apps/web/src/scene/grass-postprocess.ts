import {
  type Camera,
  DefaultRenderingPipeline,
  DepthOfFieldEffectBlurLevel,
  ImageProcessingConfiguration,
  type Scene,
} from '@babylonjs/core';

export function createGrassPipeline(scene: Scene, camera: Camera): DefaultRenderingPipeline {
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

  return pipeline;
}
