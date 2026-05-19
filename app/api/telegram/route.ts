export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { generateToken, deletePending, getPending } from "@/lib/tokens";
import { vkSendMessage } from "@/lib/vk-api";
import { answerCallbackQuery, editMessageText } from "@/lib/telegram-api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ваш-сайт.ru";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new NextResponse("ok");
  }

  const callbackQuery = body.callback_query as Record<string, unknown> | undefined;
  if (!callbackQuery) return new NextResponse("ok");

  const data = callbackQuery.data as string;
  const callbackQueryId = callbackQuery.id as string;
  const message = callbackQuery.message as Record<string, unknown> | undefined;
  const chatId = (message?.chat as Record<string, unknown>)?.id as number | undefined;
  const messageId = message?.message_id as number | undefined;

  if (data?.startsWith("confirm_")) {
    const vkUserId = parseInt(data.replace("confirm_", ""), 10);
    const pending = getPending(vkUserId);

    if (!pending) {
      await answerCallbackQuery(callbackQueryId, "Заявка не найдена или уже обработана");
      return new NextResponse("ok");
    }

    const token = generateToken(vkUserId);
    deletePending(vkUserId);

    await vkSendMessage(
      vkUserId,
      `✨ Оплата подтверждена!\n\nВаш токен доступа:\n🔑 ${token}\n\nПерейдите на сайт и введите токен в поле «Токен доступа»:\n${SITE_URL}`
    );

    await answerCallbackQuery(callbackQueryId, `✅ Токен выдан пользователю`);

    if (chatId && messageId) {
      await editMessageText(
        chatId,
        messageId,
        `✅ Подтверждено\n\n👤 ${pending.userName} (VK ID: ${vkUserId})\n🔑 Токен: ${token}`
      );
    }
  }

  if (data?.startsWith("reject_")) {
    const vkUserId = parseInt(data.replace("reject_", ""), 10);
    const pending = getPending(vkUserId);

    if (pending) {
      deletePending(vkUserId);
      await vkSendMessage(
        vkUserId,
        "❌ К сожалению, оплата не подтверждена. Если вы считаете, что произошла ошибка — напишите нам напрямую."
      );
    }

    await answerCallbackQuery(callbackQueryId, "Отклонено");

    if (chatId && messageId) {
      const name = pending?.userName ?? `VK ID: ${vkUserId}`;
      await editMessageText(chatId, messageId, `❌ Отклонено\n\n👤 ${name}`);
    }
  }

  return new NextResponse("ok");
}
