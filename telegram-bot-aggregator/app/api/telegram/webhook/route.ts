import { NextRequest, NextResponse } from "next/server";
import type { TelegramUpdate } from "@/lib/telegram/types";
import { handleMessage, handleCallback } from "@/lib/telegram/handlers";

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();
    
    console.log("[v0] Received Telegram update:", JSON.stringify(update, null, 2));
    
    // Handle regular messages
    if (update.message) {
      await handleMessage(update.message);
    }
    
    // Handle callback queries (button presses)
    if (update.callback_query) {
      await handleCallback(update.callback_query);
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[v0] Error processing webhook:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

// Telegram sends GET to verify webhook
export async function GET() {
  return NextResponse.json({ 
    status: "BotHub Telegram Webhook is active",
    timestamp: new Date().toISOString()
  });
}
