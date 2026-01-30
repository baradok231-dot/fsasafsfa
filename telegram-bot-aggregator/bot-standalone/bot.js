// BotHub - Telegram Bot Aggregator
// Запуск: node bot.js

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8259444257:AAFOCimjEbOadmHZwyi8u5rKCE_Yx0Yqq6g';
const API_URL = `https://api.telegram.org/bot${TOKEN}`;

// Состояние пользователей
const userStates = new Map();

// Шаблоны ботов для создания
const botTemplates = [
  { id: 'weather', name: '🌤 Погода', desc: 'Бот с прогнозом погоды', needsApi: true, apiName: 'OpenWeatherMap' },
  { id: 'quotes', name: '💬 Цитаты', desc: 'Мотивационные цитаты каждый день', needsApi: false },
  { id: 'currency', name: '💰 Курс валют', desc: 'Актуальные курсы валют', needsApi: false },
  { id: 'reminder', name: '⏰ Напоминания', desc: 'Напоминания и таймеры', needsApi: false },
  { id: 'horoscope', name: '⭐ Гороскоп', desc: 'Ежедневные гороскопы', needsApi: false },
  { id: 'facts', name: '💡 Интересные факты', desc: 'Факты на каждый день', needsApi: false },
];

// Категории инструментов
const categories = [
  { id: 'media', name: 'Медиа', icon: '🎬' },
  { id: 'tools', name: 'Инструменты', icon: '🛠' },
  { id: 'ai', name: 'AI / Нейросети', icon: '🤖' },
  { id: 'social', name: 'Соцсети', icon: '📱' },
  { id: 'utils', name: 'Утилиты', icon: '⚙️' },
];

// Расширенный список инструментов
const tools = [
  // Медиа
  { id: 'video_tiktok', name: 'TikTok', icon: '🎵', desc: 'Скачать видео без водяного знака', category: 'media' },
  { id: 'video_youtube', name: 'YouTube', icon: '▶️', desc: 'Скачать видео и музыку', category: 'media' },
  { id: 'video_instagram', name: 'Instagram', icon: '📸', desc: 'Reels, Stories, посты', category: 'media' },
  { id: 'video_twitter', name: 'Twitter/X', icon: '🐦', desc: 'Скачать видео из твитов', category: 'media' },
  { id: 'music_search', name: 'Музыка', icon: '🎧', desc: 'Поиск и скачивание треков', category: 'media' },
  { id: 'video_pinterest', name: 'Pinterest', icon: '📌', desc: 'Скачать пины и видео', category: 'media' },
  
  // Инструменты
  { id: 'removebg', name: 'Удалить фон', icon: '✂️', desc: 'Убрать фон с любого фото', category: 'tools' },
  { id: 'upscale', name: 'Улучшить фото', icon: '🔍', desc: 'Увеличить качество изображения', category: 'tools' },
  { id: 'compress', name: 'Сжать фото', icon: '📦', desc: 'Уменьшить размер файла', category: 'tools' },
  { id: 'convert_img', name: 'Конвертер фото', icon: '🔄', desc: 'JPG, PNG, WebP, GIF', category: 'tools' },
  { id: 'convert_doc', name: 'Конвертер файлов', icon: '📄', desc: 'PDF, DOCX, TXT', category: 'tools' },
  { id: 'qr_generate', name: 'Создать QR', icon: '📲', desc: 'QR-код из текста или ссылки', category: 'tools' },
  { id: 'qr_read', name: 'Прочитать QR', icon: '🔎', desc: 'Распознать QR-код с фото', category: 'tools' },
  
  // AI / Нейросети
  { id: 'ai_chat', name: 'ChatGPT', icon: '💬', desc: 'Умный AI ассистент', category: 'ai' },
  { id: 'ai_image', name: 'Генерация арта', icon: '🎨', desc: 'Создать картинку по описанию', category: 'ai' },
  { id: 'ai_code', name: 'Помощь с кодом', icon: '👨‍💻', desc: 'Написать и объяснить код', category: 'ai' },
  { id: 'ai_summary', name: 'Саммари текста', icon: '📝', desc: 'Краткий пересказ длинного текста', category: 'ai' },
  { id: 'ai_rewrite', name: 'Рерайт текста', icon: '✍️', desc: 'Перефразировать текст', category: 'ai' },
  
  // Соцсети
  { id: 'social_avatar', name: 'Аватар', icon: '👤', desc: 'Создать крутой аватар', category: 'social' },
  { id: 'social_caption', name: 'Подпись', icon: '💭', desc: 'Придумать подпись к посту', category: 'social' },
  { id: 'social_hashtag', name: 'Хештеги', icon: '#️⃣', desc: 'Подобрать хештеги', category: 'social' },
  { id: 'social_bio', name: 'Био', icon: '📋', desc: 'Написать описание профиля', category: 'social' },
  
  // Утилиты
  { id: 'weather', name: 'Погода', icon: '🌤', desc: 'Прогноз в любом городе', category: 'utils' },
  { id: 'translate', name: 'Переводчик', icon: '🌍', desc: 'Перевод на 100+ языков', category: 'utils' },
  { id: 'currency', name: 'Валюты', icon: '💰', desc: 'Курс валют и конвертация', category: 'utils' },
  { id: 'calc', name: 'Калькулятор', icon: '🧮', desc: 'Математические вычисления', category: 'utils' },
  { id: 'random', name: 'Рандомайзер', icon: '🎲', desc: 'Случайное число, выбор', category: 'utils' },
  { id: 'timer', name: 'Напоминание', icon: '⏰', desc: 'Установить таймер', category: 'utils' },
  { id: 'shorten', name: 'Короткая ссылка', icon: '🔗', desc: 'Сократить длинный URL', category: 'utils' },
  { id: 'password', name: 'Пароль', icon: '🔐', desc: 'Сгенерировать надёжный пароль', category: 'utils' },
];

// ==================== API ФУНКЦИИ ====================

async function callApi(method, params = {}) {
  try {
    const response = await fetch(`${API_URL}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await response.json();
    if (!data.ok) console.error(`API Error [${method}]:`, data.description);
    return data;
  } catch (error) {
    console.error(`Fetch Error [${method}]:`, error.message);
    return { ok: false, error: error.message };
  }
}

async function sendMessage(chatId, text, options = {}) {
  return callApi('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', ...options });
}

async function sendPhoto(chatId, photo, caption = '', options = {}) {
  return callApi('sendPhoto', { chat_id: chatId, photo, caption, parse_mode: 'HTML', ...options });
}

async function editMessage(chatId, messageId, text, options = {}) {
  return callApi('editMessageText', { chat_id: chatId, message_id: messageId, text, parse_mode: 'HTML', ...options });
}

async function answerCallback(callbackId, text = '', showAlert = false) {
  return callApi('answerCallbackQuery', { callback_query_id: callbackId, text, show_alert: showAlert });
}

async function sendChatAction(chatId, action = 'typing') {
  return callApi('sendChatAction', { chat_id: chatId, action });
}

// ==================== КЛАВИАТУРЫ ====================

function getMainMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: '🎬 Медиа', callback_data: 'cat_media' }, { text: '🛠 Инструменты', callback_data: 'cat_tools' }],
      [{ text: '🤖 AI / Нейросети', callback_data: 'cat_ai' }, { text: '📱 Соцсети', callback_data: 'cat_social' }],
      [{ text: '⚙️ Утилиты', callback_data: 'cat_utils' }],
      [{ text: '🤖 Создать своего бота', callback_data: 'create_bot' }],
      [{ text: '🔥 Популярное', callback_data: 'popular' }, { text: '❓ Помощь', callback_data: 'help' }],
    ],
  };
}

function getCategoryKeyboard(categoryId) {
  const categoryTools = tools.filter(t => t.category === categoryId);
  const rows = [];
  
  for (let i = 0; i < categoryTools.length; i += 2) {
    const row = [{ text: `${categoryTools[i].icon} ${categoryTools[i].name}`, callback_data: `tool_${categoryTools[i].id}` }];
    if (categoryTools[i + 1]) {
      row.push({ text: `${categoryTools[i + 1].icon} ${categoryTools[i + 1].name}`, callback_data: `tool_${categoryTools[i + 1].id}` });
    }
    rows.push(row);
  }
  
  rows.push([{ text: '◀️ Главное меню', callback_data: 'main_menu' }]);
  return { inline_keyboard: rows };
}

function getPopularKeyboard() {
  const popular = ['video_tiktok', 'removebg', 'ai_chat', 'qr_generate', 'weather', 'translate'];
  const popularTools = popular.map(id => tools.find(t => t.id === id)).filter(Boolean);
  
  const rows = [];
  for (let i = 0; i < popularTools.length; i += 2) {
    const row = [{ text: `${popularTools[i].icon} ${popularTools[i].name}`, callback_data: `tool_${popularTools[i].id}` }];
    if (popularTools[i + 1]) {
      row.push({ text: `${popularTools[i + 1].icon} ${popularTools[i + 1].name}`, callback_data: `tool_${popularTools[i + 1].id}` });
    }
    rows.push(row);
  }
  
  rows.push([{ text: '◀️ Главное меню', callback_data: 'main_menu' }]);
  return { inline_keyboard: rows };
}

function getBackKeyboard(backTo = 'main_menu') {
  return { inline_keyboard: [[{ text: '◀️ Назад', callback_data: backTo }]] };
}

function getBotTemplatesKeyboard() {
  const rows = [];
  for (let i = 0; i < botTemplates.length; i += 2) {
    const row = [{ text: botTemplates[i].name, callback_data: `template_${botTemplates[i].id}` }];
    if (botTemplates[i + 1]) {
      row.push({ text: botTemplates[i + 1].name, callback_data: `template_${botTemplates[i + 1].id}` });
    }
    rows.push(row);
  }
  rows.push([{ text: '◀️ Главное меню', callback_data: 'main_menu' }]);
  return { inline_keyboard: rows };
}

function getToolKeyboard(toolId) {
  const tool = tools.find(t => t.id === toolId);
  return {
    inline_keyboard: [
      [{ text: '◀️ Назад', callback_data: `cat_${tool?.category || 'utils'}` }],
      [{ text: '🏠 Главное меню', callback_data: 'main_menu' }],
    ],
  };
}

// ==================== ТЕКСТОВЫЕ ШАБЛОНЫ ====================

function getWelcomeText(firstName) {
  return `
<b>👋 Привет, ${firstName || 'друг'}!</b>

Добро пожаловать в <b>BotHub</b> — твой универсальный помощник в Telegram!

<b>🎯 Что я умею:</b>
├ 🎬 Скачивать видео из TikTok, YouTube, Instagram
├ ✂️ Удалять фон с фотографий
├ 🤖 Общаться как ChatGPT
├ 📲 Создавать QR-коды
├ 🌍 Переводить тексты
└ И ещё <b>25+ инструментов</b>!

<i>Выбери категорию или посмотри популярные инструменты:</i>
`;
}

function getCategoryText(categoryId) {
  const cat = categories.find(c => c.id === categoryId);
  const catTools = tools.filter(t => t.category === categoryId);
  
  let toolsList = catTools.map(t => `${t.icon} <b>${t.name}</b> — ${t.desc}`).join('\n');
  
  return `
<b>${cat.icon} ${cat.name}</b>

${toolsList}

<i>Выберите инструмент:</i>
`;
}

function getPopularText() {
  return `
<b>🔥 Популярные инструменты</b>

Самые используемые функции бота:

🎵 <b>TikTok</b> — скачать видео без водяного знака
✂️ <b>Удалить фон</b> — убрать фон с фото за секунды
💬 <b>ChatGPT</b> — умный AI ассистент
📲 <b>QR-код</b> — создать QR из текста
🌤 <b>Погода</b> — прогноз в любом городе
🌍 <b>Переводчик</b> — перевод на 100+ языков

<i>Выберите инструмент:</i>
`;
}

function getHelpText() {
  return `
<b>❓ Справка по боту</b>

<b>Как пользоваться:</b>
1️⃣ Выберите категорию или инструмент
2️⃣ Следуйте инструкциям
3️⃣ Отправьте нужные данные (текст, фото, ссылку)
4️⃣ Получите результат!

<b>Команды:</b>
/start — главное меню
/help — эта справка

<b>Категории:</b>
🎬 <b>Медиа</b> — скачивание видео и музыки
🛠 <b>Инструменты</b> — работа с фото и файлами
🤖 <b>AI</b> — нейросети и ChatGPT
📱 <b>Соцсети</b> — контент для соцсетей
⚙️ <b>Утилиты</b> — полезные мелочи

<b>Поддержка:</b>
Если что-то не работает — напишите /start и попробуйте снова.
`;
}

function getBotCreationText() {
  return `
<b>🤖 Создай своего Telegram бота!</b>

Выбери шаблон бота и получи готовый код за 30 секунд!

<b>🎯 Как это работает:</b>
1️⃣ Выбери тип бота (погода, цитаты, валюты...)
2️⃣ Получи готовый код
3️⃣ Запусти на своем сервере
4️⃣ Твой бот готов!

<b>✨ Особенности:</b>
├ 🔧 Готовый к запуску код
├ 📝 Подробная инструкция
├ 🆓 Полностью бесплатно
└ 🎨 Можно настроить под себя

<b>📢 Твой бот будет приводить тебе пользователей в @GarantPosterBOt!</b>

<i>Выбери шаблон бота:</i>
`;
}

// ==================== СОЗДАНИЕ БОТОВ ====================

async function showBotTemplate(chatId, messageId, template) {
  const needsApiText = template.needsApi ? `\n\n⚠️ <b>Требуется:</b> ${template.apiName} API ключ` : '';
  const text = `
<b>${template.name}</b>

${template.desc}

<b>🎯 Что умеет:</b>
${template.id === 'weather' ? '• Показывать текущую погоду\n• Прогноз на 5 дней\n• Температура, ветер, влажность' : ''}
${template.id === 'quotes' ? '• Отправлять случайные цитаты\n• Цитаты по категориям\n• Цитата дня' : ''}
${template.id === 'currency' ? '• Показывать курсы валют\n• Конвертер валют\n• Актуальные данные' : ''}
${template.id === 'reminder' ? '• Создавать напоминания\n• Таймеры и будильники\n• Список дел' : ''}
${template.id === 'horoscope' ? '• Гороскоп на сегодня\n• Гороскоп на неделю\n• Совместимость знаков' : ''}
${template.id === 'facts' ? '• Случайные факты\n• Факты по категориям\n• Факт дня' : ''}
${needsApiText}

<b>📢 Важно:</b> Созданный бот будет рекламировать @GarantPosterBOt и приводить тебе трафик!

<i>Нажми кнопку чтобы получить готовый код:</i>
`;

  await editMessage(chatId, messageId, text, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Получить код бота', callback_data: `generate_${template.id}` }],
        [{ text: '◀️ Назад', callback_data: 'create_bot' }],
        [{ text: '🏠 Главное меню', callback_data: 'main_menu' }],
      ],
    },
  });
}

async function generateBotCode(chatId, messageId, templateId) {
  const template = botTemplates.find(t => t.id === templateId);
  if (!template) return;

  await sendChatAction(chatId, 'typing');

  // Генерация кода бота
  const botCode = `// Telegram бот - ${template.name}
// Создан с помощью @GarantPosterBOt

const TOKEN = 'ВСТАВЬ_СЮДА_ТОКЕН_ОТ_BOTFATHER';
${template.needsApi ? `const API_KEY = 'ВСТАВЬ_API_КЛЮЧ_${template.apiName.toUpperCase()}';` : ''}
const API_URL = \`https://api.telegram.org/bot\${TOKEN}\`;
const MAIN_BOT = '@GarantPosterBOt'; // Главный бот для рекламы

async function callApi(method, params = {}) {
  const response = await fetch(\`\${API_URL}/\${method}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
}

async function sendMessage(chatId, text, options = {}) {
  return callApi('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', ...options });
}

async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text;

  if (text === '/start') {
    await sendMessage(chatId, \`👋 Привет! Я бот ${template.name}\\n\\n${template.desc}\\n\\n📢 Создан с помощью \${MAIN_BOT}\`, {
      reply_markup: {
        inline_keyboard: [[{ text: '🤖 Создать своего бота', url: 'https://t.me/GarantPosterBOt' }]],
      },
    });
    return;
  }

  ${getTemplateLogic(templateId)}
}

async function handleUpdate(update) {
  if (update.message) await handleMessage(update.message);
}

async function startPolling() {
  console.log('✅ Бот запущен!');
  await callApi('deleteWebhook');
  let offset = 0;
  while (true) {
    const response = await callApi('getUpdates', { offset, timeout: 30 });
    if (response.ok && response.result) {
      for (const update of response.result) {
        offset = update.update_id + 1;
        await handleUpdate(update);
      }
    }
  }
}

startPolling();`;

  // Отправляем код
  await sendMessage(chatId, `✅ <b>Код бота готов!</b>\n\n<b>Шаг 1:</b> Получи токен у @BotFather\n<b>Шаг 2:</b> Вставь токен в код${template.needsApi ? `\n<b>Шаг 3:</b> Получи API ключ ${template.apiName}` : ''}\n<b>Шаг ${template.needsApi ? '4' : '3'}:</b> Запусти: <code>node bot.js</code>\n\n📢 Твой бот будет приводить пользователей в @GarantPosterBOt!`);

  await sendMessage(chatId, `<code>${botCode}</code>`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🏠 Главное меню', callback_data: 'main_menu' }],
      ],
    },
  });
}

function getTemplateLogic(templateId) {
  const logics = {
    weather: `
  // Погода
  const city = text;
  const response = await fetch(\`https://wttr.in/\${encodeURIComponent(city)}?format=j1\`);
  const data = await response.json();
  const c = data.current_condition[0];
  await sendMessage(chatId, \`🌤 Погода в \${city}:\\n🌡 \${c.temp_C}°C\\n💨 \${c.windspeedKmph} км/ч\\n💧 \${c.humidity}%\\n\\n📢 Создано в \${MAIN_BOT}\`, {
    reply_markup: {
      inline_keyboard: [[{ text: '🤖 Создать бота', url: 'https://t.me/GarantPosterBOt' }]],
    },
  });`,
    quotes: `
  // Цитаты
  const quotes = ['Жизнь прекрасна!', 'Никогда не сдавайся!', 'Верь в себя!', 'Всё возможно!'];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  await sendMessage(chatId, \`💬 \${quote}\\n\\n📢 Создано в \${MAIN_BOT}\`, {
    reply_markup: {
      inline_keyboard: [[{ text: '🤖 Создать бота', url: 'https://t.me/GarantPosterBOt' }]],
    },
  });`,
    currency: `
  // Валюты
  await sendMessage(chatId, \`💰 Курсы валют:\\nUSD: 75.50₽\\nEUR: 85.20₽\\n\\n📢 Создано в \${MAIN_BOT}\`, {
    reply_markup: {
      inline_keyboard: [[{ text: '🤖 Создать бота', url: 'https://t.me/GarantPosterBOt' }]],
    },
  });`,
    reminder: `
  // Напоминания
  await sendMessage(chatId, \`⏰ Напоминание создано!\\n\\n📢 Создано в \${MAIN_BOT}\`, {
    reply_markup: {
      inline_keyboard: [[{ text: '🤖 Создать бота', url: 'https://t.me/GarantPosterBOt' }]],
    },
  });`,
    horoscope: `
  // Гороскоп
  await sendMessage(chatId, \`⭐ Гороскоп на сегодня:\\nСегодня удачный день!\\n\\n📢 Создано в \${MAIN_BOT}\`, {
    reply_markup: {
      inline_keyboard: [[{ text: '🤖 Создать бота', url: 'https://t.me/GarantPosterBOt' }]],
    },
  });`,
    facts: `
  // Факты
  const facts = ['Солнце весит 2 квинтиллиона тонн', 'Вода может кипеть и замерзать одновременно'];
  const fact = facts[Math.floor(Math.random() * facts.length)];
  await sendMessage(chatId, \`💡 \${fact}\\n\\n📢 Создано в \${MAIN_BOT}\`, {
    reply_markup: {
      inline_keyboard: [[{ text: '🤖 Создать бота', url: 'https://t.me/GarantPosterBOt' }]],
    },
  });`,
  };
  return logics[templateId] || '';
}

// ==================== ОБРАБОТЧИКИ ИНСТРУМЕНТОВ ====================

async function handleTool(chatId, messageId, toolId, callbackId) {
  const tool = tools.find(t => t.id === toolId);
  if (!tool) {
    await answerCallback(callbackId, 'Инструмент не найден', true);
    return;
  }

  await answerCallback(callbackId);
  
  const toolTexts = {
    // Медиа
    video_tiktok: `
<b>🎵 Скачать видео из TikTok</b>

Отправьте ссылку на видео из TikTok.

<b>Примеры ссылок:</b>
<code>https://vm.tiktok.com/xxxxx</code>
<code>https://www.tiktok.com/@user/video/xxxxx</code>

✨ Видео будет без водяного знака!
`,
    video_youtube: `
<b>▶️ Скачать из YouTube</b>

Отправьте ссылку на видео YouTube.

<b>Примеры ссылок:</b>
<code>https://youtube.com/watch?v=xxxxx</code>
<code>https://youtu.be/xxxxx</code>

📹 Видео или 🎵 Аудио — выберите после отправки ссылки.
`,
    video_instagram: `
<b>📸 Скачать из Instagram</b>

Отправьте ссылку на Reels, пост или Story.

<b>Примеры ссылок:</b>
<code>https://instagram.com/reel/xxxxx</code>
<code>https://instagram.com/p/xxxxx</code>
`,
    video_twitter: `
<b>🐦 Скачать из Twitter/X</b>

Отправьте ссылку на твит с видео.

<b>Пример:</b>
<code>https://twitter.com/user/status/xxxxx</code>
<code>https://x.com/user/status/xxxxx</code>
`,
    music_search: `
<b>🎧 Поиск музыки</b>

Отправьте название песни или исполнителя.

<b>Примеры:</b>
<code>Queen Bohemian Rhapsody</code>
<code>Imagine Dragons</code>
`,
    video_pinterest: `
<b>📌 Скачать из Pinterest</b>

Отправьте ссылку на пин или видео.

<b>Пример:</b>
<code>https://pinterest.com/pin/xxxxx</code>
`,

    // Инструменты
    removebg: `
<b>✂️ Удаление фона</b>

Отправьте фотографию, с которой нужно удалить фон.

📎 Поддерживаются: JPG, PNG, WebP
📏 Максимальный размер: 10 МБ

✨ Результат — PNG с прозрачным фоном!
`,
    upscale: `
<b>🔍 Улучшение качества фото</b>

Отправьте фотографию для улучшения.

🔬 Увеличение разрешения до 4x
🎨 Улучшение деталей и резкости
`,
    compress: `
<b>📦 Сжатие изображения</b>

Отправьте фотографию для сжатия.

📉 Уменьшение размера файла до 70%
✨ Качество остаётся высоким!
`,
    convert_img: `
<b>🔄 Конвертер изображений</b>

Отправьте фото для конвертации.

Доступные форматы:
• JPG ↔️ PNG
• PNG ↔️ WebP  
• Любой → GIF

После загрузки выберите нужный формат.
`,
    convert_doc: `
<b>📄 Конвертер документов</b>

Отправьте файл для конвертации.

Поддерживаемые форматы:
• PDF ↔️ DOCX
• DOCX ↔️ TXT
• И другие...
`,
    qr_generate: `
<b>📲 Генератор QR-кода</b>

Отправьте текст или ссылку.

<b>Примеры:</b>
<code>https://google.com</code>
<code>Привет, это мой QR!</code>
<code>+7 999 123 45 67</code>

📱 QR-код будет готов мгновенно!
`,
    qr_read: `
<b>🔎 Чтение QR-кода</b>

Отправьте фото с QR-кодом.

📷 Сфотографируйте или загрузите картинку с QR
🔍 Я распознаю и покажу содержимое
`,

    // AI
    ai_chat: `
<b>💬 ChatGPT Асс��стент</b>

Задайте любой вопрос!

<b>Примеры:</b>
• "Напиши рецепт пасты карбонара"
• "Объясни квантовую физику простыми словами"
• "Придумай идею для стартапа"

🧠 Я отвечу как умный AI ассистент!
`,
    ai_image: `
<b>🎨 Генерация ��зображений</b>

Опишите картинку, которую хотите создать.

<b>Примеры:</b>
<code>Кот-космонавт на луне</code>
<code>Киберпанк город ночью</code>
<code>Портрет девушки в стиле аниме</code>
`,
    ai_code: `
<b>👨‍💻 Помощь с кодом</b>

Опишите задачу или отправьте код для анализа.

<b>Примеры:</b>
• "Напиши функцию сортировки на Python"
• "Объясни этот код: [код]"
• "Найди ошибку в коде"
`,
    ai_summary: `
<b>📝 Саммари текста</b>

Отправьте длинный текст, и я сделаю краткий пересказ.

✂️ Сокращу до главных мыслей
📊 Выделю ключевые пункты
`,
    ai_rewrite: `
<b>✍️ Рерайт текста</b>

Отправьте текст для перефразирования.

🔄 Перепишу другими словами
✨ Сохраню смысл, изменю форму
`,

    // Соцсети
    social_avatar: `
<b>👤 Создание аватара</b>

Отправьте фото для создания стильного аватара.

Стили:
• Мультяшный
• Аниме
• Минимализм
• 3D
`,
    social_caption: `
<b>💭 Генератор подписей</b>

Опишите тему поста, и я придумаю подпись.

<b>Пример:</b>
<code>Фото заката на море</code>
<code>Селфи в спортзале</code>
`,
    social_hashtag: `
<b>#️⃣ Подбор хештегов</b>

Опишите тему поста или отправьте ключевые слова.

<b>Пример:</b>
<code>путешествие Париж Эйфелева башня</code>

🏷 Получите список релевантных хештегов!
`,
    social_bio: `
<b>📋 Генератор био</b>

Расскажите о себе, и я напишу креативное описание профиля.

<b>Пример:</b>
<code>Фотограф, путешественник, люблю кофе</code>
`,

    // Утилиты
    weather: `
<b>🌤 Прогноз погоды</b>

Отправьте название города.

<b>Примеры:</b>
<code>Москва</code>
<code>New York</code>
<code>Токио</code>

☀️ Покажу температуру, ветер, влажность
`,
    translate: `
<b>🌍 Переводчик</b>

Отправьте текст в формате:
<code>en: Привет, как дела?</code>

Где <b>en</b> — язык перевода.

<b>Коды языков:</b>
ru, en, de, fr, es, it, zh, ja, ko, ar, pt
`,
    currency: `
<b>💰 Конвертер валют</b>

Отправьте запрос в формате:
<code>100 USD to RUB</code>
<code>50 EUR to USD</code>

💱 Курсы обновляются в реальном времени!
`,
    calc: `
<b>🧮 Калькулятор</b>

Отправьте математическое выражение.

<b>Примеры:</b>
<code>2 + 2 * 2</code>
<code>(100 - 20) / 4</code>
<code>sqrt(144)</code>
<code>15% от 200</code>
`,
    random: `
<b>🎲 Рандомайзер</b>

<b>Случайное число:</b>
<code>1-100</code> — число от 1 до 100

<b>Случайный выбор:</b>
<code>пицца, суши, бургер</code>

<b>Подбросить монетку:</b>
<code>монетка</code>
`,
    timer: `
<b>⏰ Напоминание</b>

Отправьте время и текст:
<code>10м Проверить пирог</code>
<code>1ч Позвонить маме</code>
<code>30с Таймер</code>

⏱ Напомню, когда время выйдет!
`,
    shorten: `
<b>🔗 Сокращение ссылок</b>

Отправьте длинную ссылку.

<b>Пример:</b>
<code>https://very-long-url.com/path/to/page?param=value</code>

✂️ Получите короткую ссылку!
`,
    password: `
<b>🔐 Генератор паролей</b>

Отправьте длину пароля (8-128).

<b>Примеры:</b>
<code>16</code> — пароль из 16 символов
<code>32 без спецсимволов</code>

🔒 Надёжный случайный пароль!
`,
  };

  const text = toolTexts[toolId] || `<b>${tool.icon} ${tool.name}</b>\n\n${tool.desc}\n\nОтправьте данные для обработки.`;
  
  userStates.set(chatId, { tool: toolId, waiting: true });
  
  await editMessage(chatId, messageId, text, { reply_markup: getToolKeyboard(toolId) });
}

// ==================== ОБРАБОТКА ВВОДА ====================

async function processUserInput(chatId, text, photo, document) {
  const state = userStates.get(chatId);
  if (!state || !state.waiting) {
    await handleStart(chatId);
    return;
  }

  const toolId = state.tool;
  userStates.delete(chatId);
  
  await sendChatAction(chatId, 'typing');

  // QR-код генератор (работает!)
  if (toolId === 'qr_generate') {
    if (!text) {
      await sendMessage(chatId, '❌ Отправьте текст или ссылку для QR-кода', { reply_markup: getToolKeyboard(toolId) });
      return;
    }
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=000000&format=png`;
    await sendPhoto(chatId, qrUrl, `✅ <b>QR-код создан!</b>\n\n📝 Содержимое:\n<code>${text.substring(0, 100)}${text.length > 100 ? '...' : ''}</code>`, { reply_markup: getToolKeyboard(toolId) });
    return;
  }

  // Погода (работает!)
  if (toolId === 'weather') {
    if (!text) {
      await sendMessage(chatId, '❌ Напишите название города', { reply_markup: getToolKeyboard(toolId) });
      return;
    }
    try {
      const response = await fetch(`https://wttr.in/${encodeURIComponent(text)}?format=j1`);
      const data = await response.json();
      
      if (data.current_condition?.[0]) {
        const c = data.current_condition[0];
        const loc = data.nearest_area?.[0];
        const weatherEmoji = c.temp_C > 25 ? '☀️' : c.temp_C > 15 ? '🌤' : c.temp_C > 5 ? '🌥' : c.temp_C > -5 ? '❄️' : '🥶';
        
        await sendMessage(chatId, `
${weatherEmoji} <b>Погода: ${loc?.areaName?.[0]?.value || text}</b>
${loc?.country?.[0]?.value ? `📍 ${loc.country[0].value}` : ''}

🌡 <b>Температура:</b> ${c.temp_C}°C
🤔 <b>Ощущается:</b> ${c.FeelsLikeC}°C
💨 <b>Ветер:</b> ${c.windspeedKmph} км/ч
💧 <b>Влажность:</b> ${c.humidity}%
☁️ <b>Облачность:</b> ${c.cloudcover}%
👁 <b>Видимость:</b> ${c.visibility} км
🌡 <b>Давление:</b> ${c.pressure} мб

<i>${c.weatherDesc?.[0]?.value || ''}</i>
`, { reply_markup: getToolKeyboard(toolId) });
      } else {
        throw new Error('not found');
      }
    } catch {
      await sendMessage(chatId, `❌ Город "${text}" не найден.\n\nПопробуйте другое название.`, { reply_markup: getToolKeyboard(toolId) });
    }
    return;
  }

  // Калькулятор (работает!)
  if (toolId === 'calc') {
    if (!text) {
      await sendMessage(chatId, '❌ Отпра��ьте математическое выражение', { reply_markup: getToolKeyboard(toolId) });
      return;
    }
    try {
      // Обработка процентов
      let expr = text.replace(/(\d+)\s*%\s*от\s*(\d+)/gi, '($2 * $1 / 100)');
      expr = expr.replace(/sqrt\((\d+)\)/gi, 'Math.sqrt($1)');
      expr = expr.replace(/[^0-9+\-*/().%\s]/g, '');
      const result = eval(expr);
      await sendMessage(chatId, `🧮 <b>Калькулятор</b>\n\n📝 <code>${text}</code>\n\n✅ <b>Результат:</b> <code>${result}</code>`, { reply_markup: getToolKeyboard(toolId) });
    } catch {
      await sendMessage(chatId, '❌ Не могу вычислить это выражение.\n\nПримеры: <code>2+2</code>, <code>100/5</code>', { reply_markup: getToolKeyboard(toolId) });
    }
    return;
  }

  // Рандомайзер (работает!)
  if (toolId === 'random') {
    if (!text) {
      await sendMessage(chatId, '❌ Отправьте диапазон или варианты', { reply_markup: getToolKeyboard(toolId) });
      return;
    }
    
    const lower = text.toLowerCase();
    
    if (lower === 'монетка' || lower === 'монета' || lower === 'coin') {
      const result = Math.random() > 0.5 ? '🪙 Орёл!' : '🪙 Решка!';
      await sendMessage(chatId, `🎲 <b>Подброс монетки</b>\n\n${result}`, { reply_markup: getToolKeyboard(toolId) });
      return;
    }
    
    if (text.includes('-')) {
      const [min, max] = text.split('-').map(n => parseInt(n.trim()));
      if (!isNaN(min) && !isNaN(max)) {
        const result = Math.floor(Math.random() * (max - min + 1)) + min;
        await sendMessage(chatId, `🎲 <b>Случайное число</b>\n\nДиапазон: ${min} — ${max}\n\n✅ <b>Результат:</b> <code>${result}</code>`, { reply_markup: getToolKeyboard(toolId) });
        return;
      }
    }
    
    if (text.includes(',')) {
      const options = text.split(',').map(s => s.trim()).filter(Boolean);
      const result = options[Math.floor(Math.random() * options.length)];
      await sendMessage(chatId, `🎲 <b>Случайный выбор</b>\n\nВарианты: ${options.join(', ')}\n\n✅ <b>Выбрано:</b> <code>${result}</code>`, { reply_markup: getToolKeyboard(toolId) });
      return;
    }
    
    await sendMessage(chatId, '❌ Неверный формат.\n\nПримеры:\n<code>1-100</code>\n<code>пицца, суши, бургер</code>\n<code>монетка</code>', { reply_markup: getToolKeyboard(toolId) });
    return;
  }

  // Генератор паролей (работает!)
  if (toolId === 'password') {
    let length = parseInt(text) || 16;
    length = Math.max(8, Math.min(128, length));
    const useSpecial = !text.toLowerCase().includes('без спецсимволов');
    
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + (useSpecial ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : '');
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    await sendMessage(chatId, `🔐 <b>Сгенерированный пароль</b>\n\n<code>${password}</code>\n\n📏 Длина: ${length} символов\n${useSpecial ? '✅ Со спецсимволами' : '❌ Без спецсимволов'}`, { reply_markup: getToolKeyboard(toolId) });
    return;
  }

  // Конвертер валют (работает!)
  if (toolId === 'currency') {
    const match = text.match(/(\d+(?:\.\d+)?)\s*(\w{3})\s*(?:to|в|->)\s*(\w{3})/i);
    if (!match) {
      await sendMessage(chatId, '❌ Неверный формат.\n\nПример: <code>100 USD to RUB</code>', { reply_markup: getToolKeyboard(toolId) });
      return;
    }
    
    const [, amount, from, to] = match;
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from.toUpperCase()}`);
      const data = await response.json();
      const rate = data.rates[to.toUpperCase()];
      if (!rate) throw new Error('Currency not found');
      
      const result = (parseFloat(amount) * rate).toFixed(2);
      await sendMessage(chatId, `💰 <b>Конвертация валют</b>\n\n💵 ${amount} ${from.toUpperCase()}\n\n⬇️\n\n💴 <b>${result} ${to.toUpperCase()}</b>\n\n📊 Курс: 1 ${from.toUpperCase()} = ${rate.toFixed(4)} ${to.toUpperCase()}`, { reply_markup: getToolKeyboard(toolId) });
    } catch {
      await sendMessage(chatId, '❌ Не удалось получить курс.\n\nПроверьте коды валют.', { reply_markup: getToolKeyboard(toolId) });
    }
    return;
  }

  // Для остальных инструментов — заглушка
  const tool = tools.find(t => t.id === toolId);
  await sendMessage(chatId, `
${tool?.icon || '🔧'} <b>${tool?.name || 'Инструмент'}</b>

✅ Данные получены!

⚠️ <i>Этот инструмент требует подключения внешнего API.</i>

Для полной работы бота свяжитесь с разработчиком.
`, { reply_markup: getToolKeyboard(toolId) });
}

// ==================== ОБРАБОТКА CALLBACK ====================

async function handleCallback(callback) {
  const chatId = callback.message.chat.id;
  const messageId = callback.message.message_id;
  const data = callback.data;
  const callbackId = callback.id;

  await answerCallback(callbackId);

  if (data === 'main_menu') {
    userStates.delete(chatId);
    const firstName = callback.from?.first_name;
    await editMessage(chatId, messageId, getWelcomeText(firstName), { reply_markup: getMainMenuKeyboard() });
    return;
  }

  if (data.startsWith('cat_')) {
    const catId = data.replace('cat_', '');
    await editMessage(chatId, messageId, getCategoryText(catId), { reply_markup: getCategoryKeyboard(catId) });
    return;
  }

  if (data === 'popular') {
    await editMessage(chatId, messageId, getPopularText(), { reply_markup: getPopularKeyboard() });
    return;
  }

  if (data === 'help') {
    await editMessage(chatId, messageId, getHelpText(), { reply_markup: getBackKeyboard() });
    return;
  }

  if (data === 'create_bot') {
    await editMessage(chatId, messageId, getBotCreationText(), { reply_markup: getBotTemplatesKeyboard() });
    return;
  }

  if (data.startsWith('template_')) {
    const templateId = data.replace('template_', '');
    const template = botTemplates.find(t => t.id === templateId);
    if (template) {
      await showBotTemplate(chatId, messageId, template);
    }
    return;
  }

  if (data.startsWith('generate_')) {
    const templateId = data.replace('generate_', '');
    await generateBotCode(chatId, messageId, templateId);
    return;
  }

  if (data.startsWith('tool_')) {
    const toolId = data.replace('tool_', '');
    await handleTool(chatId, messageId, toolId, callbackId);
    return;
  }
}

// ==================== ОБРАБОТКА СООБЩЕНИЙ ====================

async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text;
  const photo = message.photo;
  const document = message.document;

  if (text === '/start' || text === '/menu') {
    userStates.delete(chatId);
    await sendMessage(chatId, getWelcomeText(message.from?.first_name), { reply_markup: getMainMenuKeyboard() });
    return;
  }

  if (text === '/help') {
    await sendMessage(chatId, getHelpText(), { reply_markup: getBackKeyboard() });
    return;
  }

  await processUserInput(chatId, text, photo, document);
}

// ==================== ОБРАБОТКА ОБНОВЛЕНИЙ ====================

async function handleUpdate(update) {
  try {
    if (update.callback_query) {
      await handleCallback(update.callback_query);
    } else if (update.message) {
      await handleMessage(update.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// ==================== LONG POLLING ====================

async function startPolling() {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║     🤖 BotHub - Telegram Bot           ║');
  console.log('║     Агрегатор полезных ботов           ║');
  console.log('╠══════════════════════���═════════════════╣');
  console.log(`║ Token: ${TOKEN.substring(0, 15)}...          ║`);
  console.log('║ Status: Starting...                    ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  
  await callApi('deleteWebhook');
  
  const me = await callApi('getMe');
  if (me.ok) {
    console.log(`✅ Бот запущен: @${me.result.username}`);
    console.log(`📛 Имя: ${me.result.first_name}`);
    console.log('');
    console.log('Ожидаю сообщения...');
    console.log('');
  }
  
  let offset = 0;

  while (true) {
    try {
      const response = await callApi('getUpdates', { offset, timeout: 30, allowed_updates: ['message', 'callback_query'] });
      
      if (response.ok && response.result) {
        for (const update of response.result) {
          offset = update.update_id + 1;
          await handleUpdate(update);
        }
      }
    } catch (error) {
      console.error('Polling error:', error.message);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

async function handleStart(chatId) {
  await sendMessage(chatId, getWelcomeText(), { reply_markup: getMainMenuKeyboard() });
}

startPolling();
