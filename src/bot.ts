import TelegramBot from "node-telegram-bot-api";
import { recognizeIsSamoyed } from "./neural-network/tensorflow";
import { loadAndProcessImage } from "./utils/image-processor";
import { findAppropriatePhoto, runFakeServer } from "./utils/telegram-helpers";
import { messages } from "./constants/messages";

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN env should be provided");
}

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: !process.env.NOW_URL,
  webHook: process.env.NOW_URL ? ({ port: 443 } as any) : false
});

bot.on("photo", async message => {
  if (!message.photo) {
    return bot.sendMessage(message.chat.id, messages.WTF);
  }

  const fileId = findAppropriatePhoto(message.photo);
  const fileLink = await bot.getFileLink(fileId);
  const pixels = await loadAndProcessImage(fileLink);

  const isSamoyed = await recognizeIsSamoyed(pixels);

  bot.sendMessage(
    message.chat.id,
    isSamoyed ? messages.IS_SAMOYED : messages.NOT_SAMOYED,
    {
      reply_to_message_id: message.message_id
    }
  );
});

if (process.env.NOW_URL) {
  console.log("starting bot...", process.env.TELEGRAM_BOT_TOKEN);
  bot
    .setWebHook(`${process.env.NOW_URL}/bot${process.env.TELEGRAM_BOT_TOKEN}`)
    .then(() => console.log("Telegram bot started"));

  runFakeServer();
}
