import * as tf from '@tensorflow/tfjs-node'
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;

export async function loadModel(path: string) {
  model = await mobilenet.load()
}

export async function recognizeIsSamoyed(pixels: Int32Array) { 
  if (!model) {
    throw new Error('Module is not loaded')
  }

  const input = tf.tensor3d(pixels, [224, 224, 3], 'int32');
  const predictions = await model.classify(input, 10)

  return predictions[0].className.includes('Samoyed')
}