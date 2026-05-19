function apiBase() {
  return `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
}

export async function sendAdminNotification(vkUserId: number, userName: string): Promise<void> {
  await fetch(`${apiBase()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.ADMIN_TELEGRAM_CHAT_ID,
      text: `💰 Новая заявка на оплату прогноза\n\n👤 Пользователь ВК: ${userName}\n🆔 VK ID: ${vkUserId}\n\nПодтвердите оплату:`,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Подтвердить", callback_data: `confirm_${vkUserId}` },
            { text: "❌ Отклонить", callback_data: `reject_${vkUserId}` },
          ],
        ],
      },
    }),
  });
}

export async function answerCallbackQuery(callbackQueryId: string, text: string): Promise<void> {
  await fetch(`${apiBase()}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
}

export async function editMessageText(
  chatId: string | number,
  messageId: number,
  text: string
): Promise<void> {
  await fetch(`${apiBase()}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text }),
  });
}
