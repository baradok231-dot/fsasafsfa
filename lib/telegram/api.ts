import type { InlineKeyboardMarkup } from "./types";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendMessage(
  chatId: number,
  text: string,
  options?: {
    reply_markup?: InlineKeyboardMarkup;
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2";
  }
) {
  const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: options?.parse_mode || "HTML",
      reply_markup: options?.reply_markup,
    }),
  });
  return response.json();
}

export async function sendPhoto(
  chatId: number,
  photo: string,
  options?: {
    caption?: string;
    reply_markup?: InlineKeyboardMarkup;
  }
) {
  const response = await fetch(`${TELEGRAM_API}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      photo,
      caption: options?.caption,
      parse_mode: "HTML",
      reply_markup: options?.reply_markup,
    }),
  });
  return response.json();
}

export async function sendVideo(
  chatId: number,
  video: string,
  options?: {
    caption?: string;
    reply_markup?: InlineKeyboardMarkup;
  }
) {
  const response = await fetch(`${TELEGRAM_API}/sendVideo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      video,
      caption: options?.caption,
      parse_mode: "HTML",
      reply_markup: options?.reply_markup,
    }),
  });
  return response.json();
}

export async function sendDocument(
  chatId: number,
  document: string,
  options?: {
    caption?: string;
    reply_markup?: InlineKeyboardMarkup;
  }
) {
  const response = await fetch(`${TELEGRAM_API}/sendDocument`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      document,
      caption: options?.caption,
      parse_mode: "HTML",
      reply_markup: options?.reply_markup,
    }),
  });
  return response.json();
}

export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string
) {
  const response = await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text,
    }),
  });
  return response.json();
}

export async function editMessageText(
  chatId: number,
  messageId: number,
  text: string,
  options?: {
    reply_markup?: InlineKeyboardMarkup;
    parse_mode?: "HTML" | "Markdown" | "MarkdownV2";
  }
) {
  const response = await fetch(`${TELEGRAM_API}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: options?.parse_mode || "HTML",
      reply_markup: options?.reply_markup,
    }),
  });
  return response.json();
}

export async function getFile(fileId: string) {
  const response = await fetch(`${TELEGRAM_API}/getFile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId }),
  });
  return response.json();
}

export function getFileUrl(filePath: string) {
  return `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
}

export async function sendChatAction(
  chatId: number,
  action:
    | "typing"
    | "upload_photo"
    | "upload_video"
    | "upload_document"
    | "upload_audio"
) {
  const response = await fetch(`${TELEGRAM_API}/sendChatAction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      action,
    }),
  });
  return response.json();
}
