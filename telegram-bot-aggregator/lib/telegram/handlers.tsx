import type { TelegramMessage, CallbackQuery, InlineKeyboardMarkup } from "./types";
import { sendMessage, answerCallbackQuery, editMessageText, sendPhoto, sendChatAction } from "./api";

// User state storage (in production use Redis/database)
const userStates = new Map<number, { tool: string; step: string; data?: Record<string, unknown> }>();

// Main menu keyboard
function getMainMenuKeyboard(): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: "📹 Скачать видео", callback_data: "tool_video" },
        { text: "🖼 Удалить фон", callback_data: "tool_removebg" },
      ],
      [
        { text: "🤖 AI Чат", callback_data: "tool_ai" },
        { text: "🎨 Генерация картинок", callback_data: "tool_imagine" },
      ],
      [
        { text: "📱 QR-код", callback_data: "tool_qr" },
        { text: "🌐 Переводчик", callback_data: "tool_translate" },
      ],
      [
        { text: "📁 Конвертер файлов", callback_data: "tool_convert" },
        { text: "🌤 Погода", callback_data: "tool_weather" },
      ],
      [
        { text: "ℹ️ Помощь", callback_data: "help" },
      ],
    ],
  };
}

function getBackKeyboard(): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [{ text: "◀️ Назад в меню", callback_data: "menu" }],
    ],
  };
}

const WELCOME_MESSAGE = `
<b>🤖 Добро пожаловать в BotHub!</b>

Я - агрегатор полезных ботов. Выберите инструмент из меню ниже:

<b>📹 Скачать видео</b> - TikTok, YouTube, Instagram
<b>🖼 Удалить фон</b> - убрать фон с любого фото
<b>🤖 AI Чат</b> - общение с ChatGPT
<b>🎨 Генерация картинок</b> - создание изображений по описанию
<b>📱 QR-код</b> - создание QR-кодов
<b>🌐 Переводчик</b> - перевод текста
<b>📁 Конвертер</b> - конвертация файлов
<b>🌤 Погода</b> - прогноз погоды
`;

const HELP_MESSAGE = `
<b>ℹ️ Помощь</b>

<b>Как пользоваться:</b>
1. Выберите инструмент из меню
2. Следуйте инструкциям бота
3. Получите результат!

<b>Команды:</b>
/start - Главное меню
/menu - Открыть меню
/help - Эта справка

<b>Поддерживаемые платформы для видео:</b>
• TikTok
• YouTube  
• Instagram
• Twitter/X
• VK

<b>Контакт:</b>
По вопросам пишите @your_support
`;

// Handle incoming messages
export async function handleMessage(message: TelegramMessage) {
  const chatId = message.chat.id;
  const text = message.text?.trim() || "";
  const photo = message.photo;
  
  console.log("[v0] handleMessage called, chatId:", chatId, "text:", text);

  // Check user state
  const state = userStates.get(chatId);

  // Handle commands
  if (text.startsWith("/")) {
    const command = text.split(" ")[0].toLowerCase();
    
    switch (command) {
      case "/start":
      case "/menu":
        userStates.delete(chatId);
        await sendMessage(chatId, WELCOME_MESSAGE, { reply_markup: getMainMenuKeyboard() });
        return;
      
      case "/help":
        await sendMessage(chatId, HELP_MESSAGE, { reply_markup: getBackKeyboard() });
        return;
      
      case "/video":
        userStates.set(chatId, { tool: "video", step: "waiting_url" });
        await sendMessage(chatId, "📹 <b>Скачивание видео</b>\n\nОтправьте ссылку на видео (TikTok, YouTube, Instagram, Twitter):", { reply_markup: getBackKeyboard() });
        return;
      
      case "/removebg":
        userStates.set(chatId, { tool: "removebg", step: "waiting_photo" });
        await sendMessage(chatId, "🖼 <b>Удаление фона</b>\n\nОтправьте фото, с которого нужно удалить фон:", { reply_markup: getBackKeyboard() });
        return;
      
      case "/ai":
        userStates.set(chatId, { tool: "ai", step: "chatting" });
        await sendMessage(chatId, "🤖 <b>AI Чат</b>\n\nЗадайте любой вопрос, и я отвечу с помощью искусственного интеллекта:", { reply_markup: getBackKeyboard() });
        return;
      
      case "/qr":
        userStates.set(chatId, { tool: "qr", step: "waiting_text" });
        await sendMessage(chatId, "📱 <b>QR-код генератор</b>\n\nОтправьте текст или ссылку для создания QR-кода:", { reply_markup: getBackKeyboard() });
        return;
      
      case "/translate":
        userStates.set(chatId, { tool: "translate", step: "waiting_text" });
        await sendMessage(chatId, "🌐 <b>Переводчик</b>\n\nОтправьте текст для перевода.\nФормат: <code>текст -> язык</code>\n\nПример: <code>Hello world -> русский</code>", { reply_markup: getBackKeyboard() });
        return;
      
      case "/weather":
        userStates.set(chatId, { tool: "weather", step: "waiting_city" });
        await sendMessage(chatId, "🌤 <b>Погода</b>\n\nВведите название города:", { reply_markup: getBackKeyboard() });
        return;
    }
  }

  // Handle state-based interactions
  if (state) {
    await handleToolInteraction(chatId, state, text, photo);
    return;
  }

  // Default response
  await sendMessage(chatId, "Используйте /menu чтобы открыть главное меню.", { reply_markup: getMainMenuKeyboard() });
}

// Handle callback queries (button presses)
export async function handleCallback(callback: CallbackQuery) {
  const chatId = callback.message?.chat.id;
  const messageId = callback.message?.message_id;
  const data = callback.data;

  console.log("[v0] handleCallback called, data:", data);

  if (!chatId || !messageId || !data) {
    await answerCallbackQuery(callback.id);
    return;
  }

  await answerCallbackQuery(callback.id);

  switch (data) {
    case "menu":
      userStates.delete(chatId);
      await editMessageText(chatId, messageId, WELCOME_MESSAGE, { reply_markup: getMainMenuKeyboard() });
      break;
    
    case "help":
      await editMessageText(chatId, messageId, HELP_MESSAGE, { reply_markup: getBackKeyboard() });
      break;
    
    case "tool_video":
      userStates.set(chatId, { tool: "video", step: "waiting_url" });
      await editMessageText(chatId, messageId, 
        "📹 <b>Скачивание видео</b>\n\nПоддерживаемые платформы:\n• TikTok\n• YouTube\n• Instagram\n• Twitter/X\n• VK\n\n<b>Отправьте ссылку на видео:</b>", 
        { reply_markup: getBackKeyboard() }
      );
      break;
    
    case "tool_removebg":
      userStates.set(chatId, { tool: "removebg", step: "waiting_photo" });
      await editMessageText(chatId, messageId, 
        "🖼 <b>Удаление фона</b>\n\nОтправьте фото, с которого нужно удалить фон.\n\nПоддерживаются форматы: JPG, PNG, WebP", 
        { reply_markup: getBackKeyboard() }
      );
      break;
    
    case "tool_ai":
      userStates.set(chatId, { tool: "ai", step: "chatting" });
      await editMessageText(chatId, messageId, 
        "🤖 <b>AI Чат</b>\n\nЯ использую передовые технологии ИИ для ответов.\n\n<b>Задайте любой вопрос:</b>", 
        { reply_markup: getBackKeyboard() }
      );
      break;
    
    case "tool_imagine":
      userStates.set(chatId, { tool: "imagine", step: "waiting_prompt" });
      await editMessageText(chatId, messageId, 
        "🎨 <b>Генерация изображений</b>\n\nОпишите картинку, которую хотите создать.\n\n<b>Пример:</b> <i>Космический кот на Луне в стиле киберпанк</i>", 
        { reply_markup: getBackKeyboard() }
      );
      break;
    
    case "tool_qr":
      userStates.set(chatId, { tool: "qr", step: "waiting_text" });
      await editMessageText(chatId, messageId, 
        "📱 <b>QR-код генератор</b>\n\nОтправьте текст или ссылку для создания QR-кода:", 
        { reply_markup: getBackKeyboard() }
      );
      break;
    
    case "tool_translate":
      userStates.set(chatId, { tool: "translate", step: "waiting_text" });
      await editMessageText(chatId, messageId, 
        "🌐 <b>Переводчик</b>\n\nОтправьте текст для перевода.\n\nФормат: <code>текст -> язык</code>\n\nПример: <code>Hello world -> русский</code>", 
        { reply_markup: getBackKeyboard() }
      );
      break;
    
    case "tool_convert":
      userStates.set(chatId, { tool: "convert", step: "waiting_file" });
      await editMessageText(chatId, messageId, 
        "📁 <b>Конвертер файлов</b>\n\nПоддерживаемые форматы:\n• Документы: PDF, DOCX, TXT\n• Изображения: PNG, JPG, WebP\n• Аудио: MP3, WAV, OGG\n\n<b>Отправьте файл для конвертации:</b>", 
        { reply_markup: getBackKeyboard() }
      );
      break;
    
    case "tool_weather":
      userStates.set(chatId, { tool: "weather", step: "waiting_city" });
      await editMessageText(chatId, messageId, 
        "🌤 <b>Погода</b>\n\nПолучите актуальный прогноз погоды для любого города.\n\n<b>Введите название города:</b>", 
        { reply_markup: getBackKeyboard() }
      );
      break;
  }
}

// Handle tool-specific interactions
async function handleToolInteraction(
  chatId: number, 
  state: { tool: string; step: string; data?: Record<string, unknown> },
  text: string,
  photo?: TelegramMessage["photo"]
) {
  console.log("[v0] handleToolInteraction, tool:", state.tool, "step:", state.step);

  switch (state.tool) {
    case "video":
      await handleVideoTool(chatId, text);
      break;
    
    case "removebg":
      await handleRemoveBgTool(chatId, photo);
      break;
    
    case "ai":
      await handleAiTool(chatId, text);
      break;
    
    case "imagine":
      await handleImagineTool(chatId, text);
      break;
    
    case "qr":
      await handleQrTool(chatId, text);
      break;
    
    case "translate":
      await handleTranslateTool(chatId, text);
      break;
    
    case "weather":
      await handleWeatherTool(chatId, text);
      break;
    
    case "convert":
      await sendMessage(chatId, "📁 Отправьте файл для конвертации", { reply_markup: getBackKeyboard() });
      break;
  }
}

// Video download tool
async function handleVideoTool(chatId: number, url: string) {
  if (!url || !url.startsWith("http")) {
    await sendMessage(chatId, "❌ Пожалуйста, отправьте корректную ссылку на видео.", { reply_markup: getBackKeyboard() });
    return;
  }

  await sendChatAction(chatId, "typing");
  
  // Detect platform
  let platform = "unknown";
  if (url.includes("tiktok.com")) platform = "TikTok";
  else if (url.includes("youtube.com") || url.includes("youtu.be")) platform = "YouTube";
  else if (url.includes("instagram.com")) platform = "Instagram";
  else if (url.includes("twitter.com") || url.includes("x.com")) platform = "Twitter";
  else if (url.includes("vk.com")) platform = "VK";

  await sendMessage(chatId, 
    `⏳ <b>Обрабатываю видео с ${platform}...</b>\n\n` +
    `🔗 ${url}\n\n` +
    `<i>Для полноценной работы требуется подключение API видео-сервиса. ` +
    `Сейчас функция в разработке.</i>`,
    { reply_markup: getBackKeyboard() }
  );
}

// Remove background tool
async function handleRemoveBgTool(chatId: number, photo?: TelegramMessage["photo"]) {
  if (!photo || photo.length === 0) {
    await sendMessage(chatId, "❌ Пожалуйста, отправьте фотографию.", { reply_markup: getBackKeyboard() });
    return;
  }

  await sendChatAction(chatId, "upload_photo");

  await sendMessage(chatId, 
    `⏳ <b>Обрабатываю изображение...</b>\n\n` +
    `<i>Для полноценной работы требуется подключение Remove.bg API. ` +
    `Сейчас функция в разработке.</i>`,
    { reply_markup: getBackKeyboard() }
  );
}

// AI Chat tool
async function handleAiTool(chatId: number, text: string) {
  if (!text) {
    await sendMessage(chatId, "❌ Пожалуйста, напишите ваш вопрос.", { reply_markup: getBackKeyboard() });
    return;
  }

  await sendChatAction(chatId, "typing");

  // Simple response for now
  await sendMessage(chatId, 
    `🤖 <b>AI ответ:</b>\n\n` +
    `Вы спросили: "${text}"\n\n` +
    `<i>Для полноценной работы AI чата требуется подключение OpenAI API. ` +
    `Сейчас функция в разработке.</i>`,
    { reply_markup: getBackKeyboard() }
  );
}

// Image generation tool
async function handleImagineTool(chatId: number, prompt: string) {
  if (!prompt) {
    await sendMessage(chatId, "❌ Пожалуйста, опишите изображение.", { reply_markup: getBackKeyboard() });
    return;
  }

  await sendChatAction(chatId, "upload_photo");

  await sendMessage(chatId, 
    `🎨 <b>Генерирую изображение...</b>\n\n` +
    `Запрос: "${prompt}"\n\n` +
    `<i>Для полноценной работы требуется подключение DALL-E или Midjourney API. ` +
    `Сейчас функция в разработке.</i>`,
    { reply_markup: getBackKeyboard() }
  );
}

// QR code tool - WORKING
async function handleQrTool(chatId: number, text: string) {
  if (!text) {
    await sendMessage(chatId, "❌ Пожалуйста, отправьте текст или ссылку.", { reply_markup: getBackKeyboard() });
    return;
  }

  await sendChatAction(chatId, "upload_photo");

  // Generate QR code using free API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}`;

  await sendPhoto(chatId, qrUrl, {
    caption: `📱 <b>QR-код создан!</b>\n\nСодержимое: <code>${text}</code>`,
    reply_markup: getBackKeyboard(),
  });
  
  userStates.delete(chatId);
}

// Translate tool
async function handleTranslateTool(chatId: number, text: string) {
  if (!text) {
    await sendMessage(chatId, "❌ Пожалуйста, отправьте текст для перевода.", { reply_markup: getBackKeyboard() });
    return;
  }

  await sendChatAction(chatId, "typing");

  await sendMessage(chatId, 
    `🌐 <b>Перевод:</b>\n\n` +
    `Текст: "${text}"\n\n` +
    `<i>Для полноценной работы требуется подключение Google Translate API. ` +
    `Сейчас функция в разработке.</i>`,
    { reply_markup: getBackKeyboard() }
  );
}

// Weather tool
async function handleWeatherTool(chatId: number, city: string) {
  if (!city) {
    await sendMessage(chatId, "❌ Пожалуйста, введите название города.", { reply_markup: getBackKeyboard() });
    return;
  }

  await sendChatAction(chatId, "typing");

  await sendMessage(chatId, 
    `🌤 <b>Погода в городе ${city}:</b>\n\n` +
    `<i>Для полноценной работы требуется подключение OpenWeatherMap API. ` +
    `Сейчас функция в разработке.</i>`,
    { reply_markup: getBackKeyboard() }
  );
}
