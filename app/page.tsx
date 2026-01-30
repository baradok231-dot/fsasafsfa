"use client"

import { useState } from "react"
import { BotTemplateCard } from "@/components/bot-template-card"
import { BotCreationDialog } from "@/components/bot-creation-dialog"
import { BOT_TEMPLATES, type BotTemplate } from "@/lib/bot-templates"
import { Bot, Zap, Users, ArrowRight } from "lucide-react"

export default function HomePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<BotTemplate | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSelectTemplate = (template: BotTemplate) => {
    setSelectedTemplate(template)
    setIsDialogOpen(true)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Bot className="h-8 w-8" />
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Создай своего Telegram бота
              <span className="text-primary"> за 5 минут</span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              Выберите готовый шаблон, настройте под себя и запустите бота без единой строчки кода. Просто вставьте токен от BotFather.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#templates"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Выбрать шаблон
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-6 py-3 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                Как это работает
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8">
            {[
              { label: "Созданных ботов", value: "2,847+" },
              { label: "Активных пользователей", value: "15K+" },
              { label: "Шаблонов", value: "6" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
            Как создать бота
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                icon: Bot,
                title: "Выберите шаблон",
                description: "Выберите тип бота из готовых шаблонов: погода, цитаты, курсы валют и другие",
              },
              {
                step: "2",
                icon: Zap,
                title: "Настройте бота",
                description: "Вставьте токен от @BotFather, настройте приветственное сообщение и кнопки",
              },
              {
                step: "3",
                icon: Users,
                title: "Запустите",
                description: "Получите готовый код бота и инструкцию по запуску. Ваши пользователи ждут!",
              },
            ].map((item) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-7 w-7" />
                </div>
                <div className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {item.step}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Выберите шаблон бота
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Один пользователь - один бот. Выберите тот, который вам нужен.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BOT_TEMPLATES.map((template) => (
              <BotTemplateCard
                key={template.id}
                template={template}
                onSelect={() => handleSelectTemplate(template)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Готовы создать своего бота?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Присоединяйтесь к тысячам пользователей, которые уже создали своих ботов на нашей платформе.
          </p>
          <a
            href="#templates"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Начать бесплатно
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bot className="h-5 w-5" />
              <span className="font-medium">BotFactory</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Создавай ботов без кода
            </p>
          </div>
        </div>
      </footer>

      {/* Bot Creation Dialog */}
      <BotCreationDialog
        template={selectedTemplate}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setSelectedTemplate(null)
        }}
      />
    </main>
  )
}
