import http from 'http'
import TelegramBot from "node-telegram-bot-api";

export function findAppropriatePhoto(photos: TelegramBot.PhotoSize[]) {
  // telegram automatically cropped bigger photos to 320
  const croppedPhoto = photos.find(photo => photo.width === 320)
  if (croppedPhoto) {
    return croppedPhoto.file_id
  }

  return photos[photos.length - 1].file_id
}

export const runFakeServer = () => {
  if (process.env.NOW_URL) {
    // Mock web server for cloud provider
    http.createServer(() => { /* fake */ }).listen(8080);
  }
};