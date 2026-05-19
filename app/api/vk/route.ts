export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createPending, getPending } from "@/lib/tokens";
import { vkSendMessage, vkGetUserName } from "@/lib/vk-api";
import { sendAdminNotification } from "@/lib/telegram-api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rachet.vercel.app";

function plainText(text: string) {
  return new NextResponse(text, { headers: { "Content-Type": "text/plain" } });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return plainText("ok");
  }

  if (body.type === "confirmation") {
    const code = process.env.VK_CONFIRMATION_CODE;
    if (!code) return new NextResponse("env VK_CONFIRMATION_CODE not set", { status: 500 });
    return plainText(code);
  }

  if (body.secret !== process.env.VK_SECRET) {
    return new NextResponse("forbidden", { status: 403 });
  }

  if (body.type === "message_new") {
    const msg = (body.object as Record<string, unknown>)?.message as Record<string, unknown> | undefined;
    const userId = msg?.from_id as number | undefined;
    const text = ((msg?.text as string) ?? "").toLowerCase().trim();

    if (!userId || userId < 0) return plainText("ok");

    const keywords = ["оплатил", "оплата", "оплатила", "перевел", "перевела", "заплатил"];
    const isPaid = keywords.some((kw) => text.includes(kw));

    if (isPaid) {
      const existing = await getPending(userId);
      if (existing) {
        await vkSendMessage(userId, "⏳ Ваша заявка уже на проверке у администратора. Ожидайте — обычно это занимает до 30 минут.");
      } else {
        const userName = await vkGetUserName(userId);
        await createPending(userId, userName);
        await vkSendMessage(userId, `✅ Заявка принята!\n\nАдминистратор проверит оплату и пришлёт вам токен доступа в этот чат. Обычно это занимает до 30 минут.\n\nПосле получения токена введите его на сайте: ${SITE_URL}`);
        await sendAdminNotification(userId, userName);
      }
    } else {
      await vkSendMessage(userId, `Привет! 👋\n\nЕсли вы оплатили прогноз — напишите «Оплатил» (или «Оплатила»), и мы выдадим вам токен доступа.\n\nСайт: ${SITE_URL}`);
    }
  }

  return plainText("ok");
}
