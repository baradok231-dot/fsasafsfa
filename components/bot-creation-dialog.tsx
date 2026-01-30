"use client"

import { useState } from "react"
import { type BotTemplate, MAIN_BOT_CONFIG } from "@/lib/bot-templates"
import { cn } from "@/lib/utils"
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Cloud,
  Quote,
  DollarSign,
  Bell,
  Star,
  Lightbulb,
  type LucideIcon,
  AlertCircle,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Cloud,
  Quote,
  DollarSign,
  Bell,
  Star,
  Lightbulb,
}

interface BotCreationDialogProps {
  template: BotTemplate | null
  isOpen: boolean
  onClose: () => void
}

export function BotCreationDialog({ template, isOpen, onClose }: BotCreationDialogProps) {
  const [step, setStep] = useState(1)
  const [botToken, setBotToken] = useState("")
  const [welcomeMessage, setWelcomeMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const [apiKey, setApiKey] = useState("")

  if (!isOpen || !template) return null

  const Icon = iconMap[template.icon] || Cloud

  const generateBotCode = () => {
    const promoMessage = MAIN_BOT_CONFIG.promoMessages[Math.floor(Math.random() * MAIN_BOT_CONFIG.promoMessages.length)]
    
    return `// ${template.name} Bot - Created with BotFactory
// Telegram: ${MAIN_BOT_CONFIG.link}

const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = '${botToken || "YOUR_BOT_TOKEN"}';
${template.requiredApi ? `const API_KEY = '${apiKey || "YOUR_API_KEY"}';` : ''}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Приветственное сообщение
const WELCOME_MESSAGE = \`${welcomeMessage || `Привет! Я бот "${template.name}". Выберите действие:`}

${promoMessage}
${MAIN_BOT_CONFIG.link}\`;

// Обработка команды /start
bot.onText(/\\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, WELCOME_MESSAGE, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: '${template.name === "Погода" ? "Узнать погоду" : template.name === "Цитаты" ? "Получить цитату" : template.name === "Курс валют" ? "Курсы валют" : "Начать"}', callback_data: 'main_action' }],
        [{ text: 'Создать своего бота', url: '${MAIN_BOT_CONFIG.link}' }]
      ]
    }
  });
});

${template.id === 'weather' ? `
// Погода
bot.on('callback_query', async (query) => {
  if (query.data === 'main_action') {
    bot.sendMessage(query.message.chat.id, 'Введите название города:');
  }
});

bot.on('message', async (msg) => {
  if (!msg.text?.startsWith('/')) {
    const city = msg.text;
    try {
      const response = await fetch(\`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${API_KEY}&units=metric&lang=ru\`);
      const data = await response.json();
      
      if (data.cod === 200) {
        const weather = \`Погода в \${data.name}:
Температура: \${data.main.temp}°C
Ощущается как: \${data.main.feels_like}°C
Влажность: \${data.main.humidity}%
Ветер: \${data.wind.speed} м/с
\${data.weather[0].description}

Powered by BotFactory\`;
        
        bot.sendMessage(msg.chat.id, weather, {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Создать своего бота', url: '${MAIN_BOT_CONFIG.link}' }]
            ]
          }
        });
      } else {
        bot.sendMessage(msg.chat.id, 'Город не найден. Попробуйте еще раз.');
      }
    } catch (error) {
      bot.sendMessage(msg.chat.id, 'Ошибка получения погоды.');
    }
  }
});
` : template.id === 'quotes' ? `
// Цитаты
const quotes = [
  "Успех — это способность идти от неудачи к неудаче, не теряя энтузиазма. — Уинстон Черчилль",
  "Единственный способ делать великие дела — любить то, что вы делаете. — Стив Джобс",
  "Будьте тем изменением, которое вы хотите видеть в мире. — Махатма Ганди",
  "Жизнь — это то, что с тобой происходит, пока ты строишь другие планы. — Джон Леннон",
  "Не бойся идти медленно, бойся стоять на месте. — Китайская пословица"
];

bot.on('callback_query', async (query) => {
  if (query.data === 'main_action') {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    bot.sendMessage(query.message.chat.id, quote + '\\n\\nPowered by BotFactory', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Еще цитата', callback_data: 'main_action' }],
          [{ text: 'Создать своего бота', url: '${MAIN_BOT_CONFIG.link}' }]
        ]
      }
    });
  }
});
` : template.id === 'currency' ? `
// Курсы валют
bot.on('callback_query', async (query) => {
  if (query.data === 'main_action') {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      const rates = \`Курсы валют (к USD):
EUR: \${data.rates.EUR.toFixed(4)}
RUB: \${data.rates.RUB.toFixed(2)}
GBP: \${data.rates.GBP.toFixed(4)}
CNY: \${data.rates.CNY.toFixed(4)}

Powered by BotFactory\`;
      
      bot.sendMessage(query.message.chat.id, rates, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Обновить', callback_data: 'main_action' }],
            [{ text: 'Создать своего бота', url: '${MAIN_BOT_CONFIG.link}' }]
          ]
        }
      });
    } catch (error) {
      bot.sendMessage(query.message.chat.id, 'Ошибка получения курсов.');
    }
  }
});
` : `
// Основной функционал
bot.on('callback_query', async (query) => {
  if (query.data === 'main_action') {
    bot.sendMessage(query.message.chat.id, 'Функция в разработке!\\n\\nPowered by BotFactory', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Создать своего бота', url: '${MAIN_BOT_CONFIG.link}' }]
        ]
      }
    });
  }
});
`}

console.log('Бот запущен!');
`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generateBotCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleClose = () => {
    setStep(1)
    setBotToken("")
    setWelcomeMessage("")
    setApiKey("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Создание бота: {template.name}</h2>
              <p className="text-sm text-muted-foreground">Шаг {step} из 3</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-2 px-6 pt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                s <= step ? "bg-primary" : "bg-secondary"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Получите токен бота</h3>
              <div className="rounded-lg bg-secondary/50 p-4">
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">1</span>
                    <span>Откройте @BotFather в Telegram</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">2</span>
                    <span>Отправьте команду /newbot</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">3</span>
                    <span>Придумайте имя и юзернейм для бота</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">4</span>
                    <span>Скопируйте полученный токен</span>
                  </li>
                </ol>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Токен бота
                </label>
                <input
                  type="text"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                  className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Открыть BotFather
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Настройте бота</h3>
              
              {template.requiredApi && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {template.requiredApi}
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={template.apiPlaceholder}
                    className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {template.apiPlaceholder}
                  </p>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Приветственное сообщение
                </label>
                <textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder={`Привет! Я бот "${template.name}". Выберите действие:`}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-input px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Реклама BotFactory</p>
                  <p className="mt-1">
                    Ваш бот будет содержать ссылку на BotFactory в сообщениях. Это позволяет нам предоставлять сервис бесплатно.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Готовый код бота</h3>
              <div className="relative">
                <pre className="max-h-80 overflow-auto rounded-lg bg-secondary p-4 text-xs text-muted-foreground">
                  <code>{generateBotCode()}</code>
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Скопировано" : "Копировать"}
                </button>
              </div>
              <div className="rounded-lg bg-secondary/50 p-4">
                <h4 className="font-medium text-foreground">Как запустить:</h4>
                <ol className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>1. Создайте файл bot.js и вставьте код</li>
                  <li>2. Установите зависимость: npm install node-telegram-bot-api</li>
                  <li>3. Запустите: node bot.js</li>
                  <li>4. Разместите на сервере (Heroku, Railway, VPS)</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t border-border p-6">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={cn(
              "rounded-lg border border-border px-4 py-2 font-medium transition-colors",
              step === 1
                ? "cursor-not-allowed opacity-50"
                : "text-foreground hover:bg-secondary"
            )}
          >
            Назад
          </button>
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={step === 1 && !botToken}
              className={cn(
                "rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors",
                step === 1 && !botToken
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-primary/90"
              )}
            >
              Далее
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="rounded-lg bg-accent px-6 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Готово
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
