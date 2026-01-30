// Tool definitions for the bot aggregator

export interface BotTool {
  id: string;
  name: string;
  emoji: string;
  description: string;
  usage: string;
  category: "video" | "image" | "audio" | "file" | "text" | "utility";
}

export const botTools: BotTool[] = [
  {
    id: "tiktok",
    name: "TikTok Downloader",
    emoji: "🎵",
    description: "Скачать видео из TikTok без водяного знака",
    usage: "Отправьте ссылку на TikTok видео",
    category: "video",
  },
  {
    id: "youtube",
    name: "YouTube Downloader",
    emoji: "📺",
    description: "Скачать видео или аудио с YouTube",
    usage: "Отправьте ссылку на YouTube видео",
    category: "video",
  },
  {
    id: "instagram",
    name: "Instagram Downloader",
    emoji: "📸",
    description: "Скачать Reels, Stories, посты из Instagram",
    usage: "Отправьте ссылку на Instagram контент",
    category: "video",
  },
  {
    id: "remove_bg",
    name: "Удаление фона",
    emoji: "🖼️",
    description: "Удалить фон с любого изображения",
    usage: "Отправьте фото для удаления фона",
    category: "image",
  },
  {
    id: "compress_image",
    name: "Сжатие изображений",
    emoji: "📉",
    description: "Сжать изображение без потери качества",
    usage: "Отправьте фото для сжатия",
    category: "image",
  },
  {
    id: "image_to_pdf",
    name: "Фото в PDF",
    emoji: "📄",
    description: "Конвертировать изображения в PDF",
    usage: "Отправьте одно или несколько фото",
    category: "file",
  },
  {
    id: "pdf_to_image",
    name: "PDF в изображения",
    emoji: "🖼️",
    description: "Конвертировать PDF в изображения",
    usage: "Отправьте PDF файл",
    category: "file",
  },
  {
    id: "audio_extract",
    name: "Извлечь аудио",
    emoji: "🎧",
    description: "Извлечь аудио из видео файла",
    usage: "Отправьте видео для извлечения аудио",
    category: "audio",
  },
  {
    id: "text_to_speech",
    name: "Текст в речь",
    emoji: "🗣️",
    description: "Преобразовать текст в голосовое сообщение",
    usage: "Напишите текст после команды",
    category: "text",
  },
  {
    id: "speech_to_text",
    name: "Речь в текст",
    emoji: "✍️",
    description: "Расшифровать голосовое сообщение в текст",
    usage: "Отправьте голосовое сообщение",
    category: "text",
  },
  {
    id: "qr_generate",
    name: "Генератор QR",
    emoji: "📱",
    description: "Создать QR-код из текста или ссылки",
    usage: "Напишите текст/ссылку для QR-кода",
    category: "utility",
  },
  {
    id: "qr_scan",
    name: "Сканер QR",
    emoji: "🔍",
    description: "Сканировать QR-код с изображения",
    usage: "Отправьте фото с QR-кодом",
    category: "utility",
  },
  {
    id: "translate",
    name: "Переводчик",
    emoji: "🌐",
    description: "Перевести текст на другой язык",
    usage: "Напишите текст для перевода",
    category: "text",
  },
  {
    id: "currency",
    name: "Конвертер валют",
    emoji: "💱",
    description: "Конвертировать валюты по актуальному курсу",
    usage: "Пример: 100 USD RUB",
    category: "utility",
  },
  {
    id: "weather",
    name: "Погода",
    emoji: "🌤️",
    description: "Узнать погоду в любом городе",
    usage: "Напишите название города",
    category: "utility",
  },
];

export function getToolById(id: string): BotTool | undefined {
  return botTools.find((tool) => tool.id === id);
}

export function getToolsByCategory(
  category: BotTool["category"]
): BotTool[] {
  return botTools.filter((tool) => tool.category === category);
}

export const categories = [
  { id: "video", name: "Видео", emoji: "🎬" },
  { id: "image", name: "Изображения", emoji: "🖼️" },
  { id: "audio", name: "Аудио", emoji: "🎵" },
  { id: "file", name: "Файлы", emoji: "📁" },
  { id: "text", name: "Текст", emoji: "📝" },
  { id: "utility", name: "Утилиты", emoji: "🛠️" },
] as const;
