import { Redis } from "@upstash/redis";
import crypto from "crypto";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

type TokenRecord = { vkUserId: number; used: boolean; createdAt: string };
type PendingRecord = { vkUserId: number; userName: string; requestedAt: string };

export async function createPending(vkUserId: number, userName: string): Promise<void> {
  await redis.set(`pending:${vkUserId}`, { vkUserId, userName, requestedAt: new Date().toISOString() });
}

export async function getPending(vkUserId: number): Promise<PendingRecord | null> {
  return await redis.get<PendingRecord>(`pending:${vkUserId}`);
}

export async function deletePending(vkUserId: number): Promise<void> {
  await redis.del(`pending:${vkUserId}`);
}

export async function generateToken(vkUserId: number): Promise<string> {
  const token = crypto.randomBytes(12).toString("hex").toUpperCase();
  await redis.set(`token:${token}`, { vkUserId, used: false, createdAt: new Date().toISOString() });
  return token;
}

export async function verifyAndUseToken(token: string): Promise<boolean> {
  const key = `token:${token.toUpperCase().trim()}`;
  const record = await redis.get<TokenRecord>(key);
  if (!record || record.used) return false;
  await redis.set(key, { ...record, used: true });
  return true;
}
