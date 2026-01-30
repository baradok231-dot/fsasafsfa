import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 });
  }
  
  // Get the webhook URL from the request or use the current domain
  const body = await request.json().catch(() => ({}));
  let webhookUrl = body.webhookUrl;
  
  if (!webhookUrl) {
    // Try to construct from headers
    const host = request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "https";
    webhookUrl = `${proto}://${host}/api/telegram/webhook`;
  }
  
  console.log("[v0] Setting webhook to:", webhookUrl);
  
  try {
    // Set the webhook
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message", "callback_query"],
      }),
    });
    
    const result = await response.json();
    console.log("[v0] Webhook setup result:", result);
    
    if (result.ok) {
      return NextResponse.json({ 
        success: true, 
        message: "Webhook установлен успешно!",
        webhookUrl 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.description 
      }, { status: 400 });
    }
  } catch (error) {
    console.error("[v0] Error setting webhook:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to set webhook" 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 });
  }
  
  try {
    // Get webhook info
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to get webhook info" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 });
  }
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete webhook" }, { status: 500 });
  }
}
