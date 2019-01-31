import jpeg from "jpeg-js";
import request from "request";
import sharp from "sharp";
import { IMAGE_SIZE } from "../constants";

export function loadBuffer(url: string) {
  return new Promise<Buffer>(resolve => {
    request.get(url, { encoding: null }, (err, res, body) => {
      if (err) {
        throw err;
      }

      resolve(body);
    });
  });
}

export async function imageToPixels(buffer: Buffer) {
  const resizedBuffer = await sharp(buffer)
    .resize(IMAGE_SIZE, IMAGE_SIZE)
    .toBuffer();

  const image = jpeg.decode(resizedBuffer, true);

  const numChannels = 3;
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++) {
    for (let channel = 0; channel < numChannels; ++channel) {
      values[i * numChannels + channel] = image.data[i * 4 + channel];
    }
  }

  return values;
}

export async function loadAndProcessImage(url: string) {
  const buffer = await loadBuffer(url);

  return imageToPixels(buffer);
}
