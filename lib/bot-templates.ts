export interface BotTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: string
  features: string[]
  requiredApi?: string
  apiPlaceholder?: string
  customizable: {
    welcomeMessage: boolean
    botName: boolean
    buttonLabels: boolean
  }
}

export const BOT_TEMPLATES: BotTemplate[] = [
  {
    id: "weather",
    name: "Погода",
    description: "Бот показывает текущую погоду и прогноз по городу",
    icon: "Cloud",
    category: "Утилиты",
    features: [
      "Текущая погода по городу",
      "Прогноз на 5 дней",
      "Температура, влажность, ветер",
      "Автоматическое определение города",
    ],
    requiredApi: "OpenWeatherMap API Key",
    apiPlaceholder: "Получите бесплатно на openweathermap.org",
    customizable: {
      welcomeMessage: true,
      botName: true,
      buttonLabels: true,
    },
  },
  {
    id: "quotes",
    name: "Цитаты",
    description: "Бот отправляет мотивационные цитаты и афоризмы",
    icon: "Quote",
    category: "Развлечения",
    features: [
      "Случайные цитаты",
      "Цитаты по категориям",
      "Цитаты дня",
      "Сохранение избранных",
    ],
    customizable: {
      welcomeMessage: true,
      botName: true,
      buttonLabels: true,
    },
  },
  {
    id: "currency",
    name: "Курс валют",
    description: "Бот показывает актуальные курсы валют и конвертер",
    icon: "DollarSign",
    category: "Финансы",
    features: [
      "Курсы основных валют",
      "Конвертер валют",
      "История курсов",
      "Уведомления об изменениях",
    ],
    customizable: {
      welcomeMessage: true,
      botName: true,
      buttonLabels: true,
    },
  },
  {
    id: "reminder",
    name: "Напоминания",
    description: "Бот для создания напоминаний и заметок",
    icon: "Bell",
    category: "Продуктивность",
    features: [
      "Создание напоминаний",
      "Повторяющиеся события",
      "Список дел",
      "Уведомления",
    ],
    customizable: {
      welcomeMessage: true,
      botName: true,
      buttonLabels: true,
    },
  },
  {
    id: "horoscope",
    name: "Гороскоп",
    description: "Бот с ежедневными гороскопами по знакам зодиака",
    icon: "Star",
    category: "Развлечения",
    features: [
      "Гороскоп на сегодня",
      "Гороскоп на неделю",
      "Совместимость знаков",
      "Лунный календарь",
    ],
    customizable: {
      welcomeMessage: true,
      botName: true,
      buttonLabels: true,
    },
  },
  {
    id: "facts",
    name: "Интересные факты",
    description: "Бот с интересными фактами на каждый день",
    icon: "Lightbulb",
    category: "Образование",
    features: [
      "Случайные факты",
      "Факты по категориям",
      "Факт дня",
      "Викторина",
    ],
    customizable: {
      welcomeMessage: true,
      botName: true,
      buttonLabels: true,
    },
  },
]

// Твой главный бот для рекламы
export const MAIN_BOT_CONFIG = {
  username: "@BotFactory_Bot", // Замени на юзернейм своего бота
  name: "BotFactory",
  link: "https://t.me/BotFactory_Bot",
  promoMessages: [
    "Создай своего бота бесплатно",
    "Хочешь такого же бота? Создай за 5 минут!",
    "Powered by BotFactory - создай бота без кода",
  ],
}
