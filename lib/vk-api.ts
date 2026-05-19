const VK_API_BASE = "https://api.vk.com/method";

export async function vkSendMessage(userId: number, message: string): Promise<void> {
  const token = process.env.VK_GROUP_TOKEN!;
  const randomId = Math.floor(Math.random() * 1e9);

  const params = new URLSearchParams({
    user_id: String(userId),
    random_id: String(randomId),
    message,
    access_token: token,
    v: "5.131",
  });

  await fetch(`${VK_API_BASE}/messages.send`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
}

export async function vkGetUserName(userId: number): Promise<string> {
  const token = process.env.VK_GROUP_TOKEN!;
  try {
    const res = await fetch(
      `${VK_API_BASE}/users.get?user_ids=${userId}&access_token=${token}&v=5.131`
    );
    const data = await res.json();
    const u = data.response?.[0];
    if (u) return `${u.first_name} ${u.last_name}`;
  } catch {}
  return `ID${userId}`;
}
