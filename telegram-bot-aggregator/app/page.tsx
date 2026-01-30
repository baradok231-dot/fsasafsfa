"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, CheckCircle, XCircle, Loader2, Settings, Zap, MessageSquare, ImageIcon, FileText, Globe } from "lucide-react";

export default function AdminPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [webhookInfo, setWebhookInfo] = useState<any>(null);

  const setupWebhook = async () => {
    setStatus("loading");
    try {
      // Use provided URL or construct from current origin
      const finalWebhookUrl = webhookUrl || `${window.location.origin}/api/telegram/webhook`;
      
      const response = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl: finalWebhookUrl }),
      });
      const data = await response.json();
      
      if (data.success) {
        setStatus("success");
        setMessage(`Webhook установлен: ${data.webhookUrl}`);
      } else {
        setStatus("error");
        setMessage(data.error || "Ошибка установки webhook");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Ошибка подключения");
    }
  };

  const checkWebhook = async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/telegram/setup");
      const data = await response.json();
      setWebhookInfo(data.result);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessage("Ошибка получения информации");
    }
  };

  const deleteWebhook = async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/telegram/setup", { method: "DELETE" });
      const data = await response.json();
      
      if (data.ok) {
        setStatus("success");
        setMessage("Webhook удален");
        setWebhookInfo(null);
      } else {
        setStatus("error");
        setMessage(data.description || "Ошибка удаления");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Ошибка подключения");
    }
  };

  const features = [
    { icon: MessageSquare, name: "Скачивание видео", desc: "TikTok, YouTube, Instagram" },
    { icon: ImageIcon, name: "Обработка изображений", desc: "Удаление фона, сжатие" },
    { icon: FileText, name: "Работа с файлами", desc: "PDF конвертация" },
    { icon: Globe, name: "Утилиты", desc: "QR-коды, переводчик, погода" },
  ];

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Bot className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">BotHub</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Агрегатор Telegram ботов - все инструменты в одном месте
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature) => (
            <Card key={feature.name} className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <feature.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-foreground text-sm">{feature.name}</h3>
                <p className="text-muted-foreground text-xs mt-1">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Webhook Setup Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Settings className="h-5 w-5" />
              Настройка Webhook
            </CardTitle>
            <CardDescription>
              Настройте webhook для подключения бота к Telegram
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                URL Webhook (оставьте пустым для автоопределения)
              </label>
              <Input
                placeholder="https://your-domain.vercel.app/api/telegram/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={setupWebhook} disabled={status === "loading"}>
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Установить Webhook
              </Button>
              <Button variant="outline" onClick={checkWebhook} disabled={status === "loading"}>
                Проверить статус
              </Button>
              <Button variant="destructive" onClick={deleteWebhook} disabled={status === "loading"}>
                Удалить Webhook
              </Button>
            </div>

            {/* Status Message */}
            {status !== "idle" && status !== "loading" && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                status === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              }`}>
                {status === "success" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span>{message}</span>
              </div>
            )}

            {/* Webhook Info */}
            {webhookInfo && (
              <div className="p-4 bg-secondary rounded-lg space-y-2">
                <h4 className="font-semibold text-foreground">Текущий Webhook:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>URL:</strong> {webhookInfo.url || "Не установлен"}</p>
                  <p><strong>Pending updates:</strong> {webhookInfo.pending_update_count || 0}</p>
                  {webhookInfo.last_error_message && (
                    <p className="text-red-500"><strong>Ошибка:</strong> {webhookInfo.last_error_message}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Инструкция по настройке</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">1</span>
              <p>Добавьте переменную окружения <code className="bg-secondary px-2 py-0.5 rounded text-foreground">TELEGRAM_BOT_TOKEN</code> с токеном вашего бота</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">2</span>
              <p>Задеплойте проект на Vercel или другой хостинг с HTTPS</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">3</span>
              <p>Нажмите кнопку «Установить Webhook» выше</p>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">4</span>
              <p>Откройте бота в Telegram и отправьте <code className="bg-secondary px-2 py-0.5 rounded text-foreground">/start</code></p>
            </div>
          </CardContent>
        </Card>

        {/* Available Tools */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Доступные инструменты</CardTitle>
            <CardDescription>Функции, которые будут доступны пользователям бота</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {[
                "TikTok Downloader",
                "YouTube Downloader", 
                "Instagram Downloader",
                "Удаление фона",
                "Сжатие изображений",
                "Фото в PDF",
                "PDF в изображения",
                "Извлечь аудио",
                "Текст в речь",
                "Речь в текст",
                "Генератор QR",
                "Сканер QR",
                "Переводчик",
                "Конвертер валют",
                "Погода",
              ].map((tool) => (
                <div key={tool} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>{tool}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
