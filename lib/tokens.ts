import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const TOKENS_FILE = path.join(DATA_DIR, "tokens.json");
const PENDING_FILE = path.join(DATA_DIR, "pending.json");

type TokenRecord = { vkUserId: number; used: boolean; createdAt: string };
type PendingRecord = { vkUserId: number; userName: string; requestedAt: string };

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readTokens(): Record<string, TokenRecord> {
  ensureDir();
  if (!fs.existsSync(TOKENS_FILE)) return {};
  return JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8"));
}

function writeTokens(data: Record<string, TokenRecord>) {
  ensureDir();
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(data, null, 2));
}

function readPending(): Record<string, PendingRecord> {
  ensureDir();
  if (!fs.existsSync(PENDING_FILE)) return {};
  return JSON.parse(fs.readFileSync(PENDING_FILE, "utf-8"));
}

function writePending(data: Record<string, PendingRecord>) {
  ensureDir();
  fs.writeFileSync(PENDING_FILE, JSON.stringify(data, null, 2));
}

export function createPending(vkUserId: number, userName: string): void {
  const pending = readPending();
  pending[String(vkUserId)] = { vkUserId, userName, requestedAt: new Date().toISOString() };
  writePending(pending);
}

export function getPending(vkUserId: number): PendingRecord | null {
  const pending = readPending();
  return pending[String(vkUserId)] ?? null;
}

export function deletePending(vkUserId: number): void {
  const pending = readPending();
  delete pending[String(vkUserId)];
  writePending(pending);
}

export function generateToken(vkUserId: number): string {
  const token = crypto.randomBytes(12).toString("hex").toUpperCase();
  const tokens = readTokens();
  tokens[token] = { vkUserId, used: false, createdAt: new Date().toISOString() };
  writeTokens(tokens);
  return token;
}

export function verifyAndUseToken(token: string): boolean {
  const tokens = readTokens();
  const record = tokens[token.toUpperCase().trim()];
  if (!record || record.used) return false;
  tokens[token.toUpperCase().trim()].used = true;
  writeTokens(tokens);
  return true;
}
