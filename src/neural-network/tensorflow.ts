import * as tf from '@tensorflow/tfjs-node'
import * as mobilenet from '@tensorflow-models/mobilenet';
import { IMAGE_SIZE } from '../constants';

let model: mobilenet.MobileNet | null = null;

export async function loadModel(path: string) {
  model = await mobilenet.load()
}

export async function recognizeIsSamoyed(pixels: Int32Array) { 
  if (!model) {
    throw new Error('Model is not loaded')
  }
  
  const shape = [IMAGE_SIZE, IMAGE_SIZE, 3] as [number, number, number]
  const input = tf.tensor3d(pixels, shape, 'int32');

  const predictions = await model.classify(input, 10)
  return predictions[0].className.includes('Samoyed')
}