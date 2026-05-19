"use client";

import { useState } from "react";
import { X, Sparkles, Eye, Check, Loader2, Copy, ExternalLink, Key } from "lucide-react";

interface Props {
  name: string;
  forecastYear: number;
  onSuccess: () => void;
  onClose: () => void;
}

const ITEMS = [
  "Нумерологический прогноз (число года, имени, жизненного пути)",
  "Астрологический прогноз (знак зодиака + китайский гороскоп)",
  "Тарологический прогноз (карта года + квартальные карты)",
  "Рунологический прогноз (руна года + сезонные руны)",
  "Сводный прогноз и благоприятные периоды",
];

const CARD = process.env.NEXT_PUBLIC_PAYMENT_CARD ?? "0000 0000 0000 0000";
const BANK = process.env.NEXT_PUBLIC_PAYMENT_BANK ?? "Сбербанк";
const RECIPIENT = process.env.NEXT_PUBLIC_PAYMENT_NAME ?? "Иван И.";
const SBP_PHONE = process.env.NEXT_PUBLIC_PAYMENT_SBP_PHONE ?? "";
const VK_BOT_URL = process.env.NEXT_PUBLIC_VK_BOT_URL ?? "https://vk.com/your_group";

type Step = "payment" | "token" | "done";

export default function PaymentModal({ name, forecastYear, onSuccess, onClose }: Props) {
  const [step, setStep] = useState<Step>("payment");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function copyCard() {
    navigator.clipboard.writeText(CARD.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleVerifyToken() {
    const trimmed = token.trim();
    if (!trimmed) { setError("Введите токен"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: trimmed }),
      });
      const data = await res.json();
      if (data.valid) {
        setStep("done");
        setTimeout(onSuccess, 1800);
      } else {
        setError("Токен не найден или уже использован. Проверьте правильность ввода.");
      }
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-mystic-950/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative card-mystic rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream-300 hover:text-gold-400 transition-colors"
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>

        {/* ── DONE ── */}
        {step === "done" && (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4 float-animation">
              <Sparkles size={52} className="text-gold-400" strokeWidth={1.5} />
            </div>
            <h3
              className="text-2xl font-semibold text-gold-400 mb-2"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Доступ открыт!
            </h3>
            <p className="text-cream-200">Открываю ваш прогноз…</p>
          </div>
        )}

        {/* ── TOKEN INPUT ── */}
        {step === "token" && (
          <>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <Key size={36} className="text-gold-400" strokeWidth={1.5} />
              </div>
              <h3
                className="text-xl font-semibold text-gold-400 mb-1"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Введите токен доступа
              </h3>
              <p className="text-cream-200 text-sm">
                Токен придёт вам в личные сообщения ВКонтакте от бота
              </p>
            </div>

            <div className="divider-gold mb-6" />

            <div className="mb-4">
              <input
                type="text"
                value={token}
                onChange={(e) => { setToken(e.target.value.toUpperCase()); setError(""); }}
                placeholder="Например: A1B2C3D4E5F6..."
                className="w-full bg-mystic-900/60 border border-gold-600/40 rounded-lg px-4 py-3 text-cream-100 placeholder-cream-300/40 focus:outline-none focus:border-gold-400 transition-colors tracking-widest text-center font-mono"
                onKeyDown={(e) => e.key === "Enter" && handleVerifyToken()}
              />
              {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
            </div>

            <button
              onClick={handleVerifyToken}
              disabled={loading}
              className="btn-gold w-full py-4 rounded-xl text-mystic-950 font-bold text-lg tracking-wide disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Проверка…
                </span>
              ) : (
                "Получить прогноз"
              )}
            </button>

            <button
              onClick={() => setStep("payment")}
              className="w-full mt-3 text-cream-300 hover:text-gold-400 text-sm transition-colors"
            >
              ← Назад к реквизитам
            </button>
          </>
        )}

        {/* ── PAYMENT INSTRUCTIONS ── */}
        {step === "payment" && (
          <>
            <div className="text-center mb-5">
              <div className="flex justify-center mb-3">
                <Eye size={36} className="text-gold-400" strokeWidth={1.5} />
              </div>
              <h3
                className="text-xl font-semibold text-gold-400 mb-1"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Персональный прогноз
              </h3>
              <p className="text-cream-200 text-sm">
                Для <span className="text-gold-400 font-semibold">{name}</span> на{" "}
                <span className="text-gold-400 font-semibold">{forecastYear} год</span>
              </p>
            </div>

            <ul className="space-y-2 mb-5 text-cream-200 text-sm">
              {ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check size={14} className="text-gold-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="divider-gold mb-5" />

            <div className="text-center mb-5">
              <span
                className="text-4xl font-bold text-gold-400"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                777 ₽
              </span>
              <p className="text-cream-300 text-xs mt-1">единоразовый платёж</p>
            </div>

            {/* Requisites */}
            <div className="bg-mystic-900/60 border border-gold-600/30 rounded-xl p-4 mb-4 space-y-2 text-sm">
              <p className="text-gold-400 font-semibold text-center mb-3">Реквизиты для оплаты</p>

              <div className="flex items-center justify-between">
                <span className="text-cream-300">Банк:</span>
                <span className="text-cream-100">{BANK}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-cream-300">Получатель:</span>
                <span className="text-cream-100">{RECIPIENT}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-cream-300 shrink-0">Карта:</span>
                <div className="flex items-center gap-2">
                  <span className="text-cream-100 font-mono tracking-widest">{CARD}</span>
                  <button
                    onClick={copyCard}
                    className="text-gold-400 hover:text-gold-300 transition-colors"
                    aria-label="Скопировать"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {SBP_PHONE && (
                <div className="flex items-center justify-between">
                  <span className="text-cream-300">СБП:</span>
                  <span className="text-cream-100 font-mono">{SBP_PHONE}</span>
                </div>
              )}

              <p className="text-cream-300/70 text-xs text-center pt-1">
                Укажите в комментарии: «Прогноз»
              </p>
            </div>

            {/* VK step */}
            <div className="bg-mystic-900/60 border border-gold-600/30 rounded-xl p-4 mb-5 text-sm">
              <p className="text-gold-400 font-semibold mb-2">После оплаты:</p>
              <ol className="space-y-1 text-cream-200 list-decimal list-inside">
                <li>Перейдите в наш бот ВКонтакте</li>
                <li>Напишите боту: <span className="text-gold-400 font-semibold">«Оплатил»</span></li>
                <li>Дождитесь токена (до 30 мин)</li>
                <li>Вернитесь сюда и введите токен</li>
              </ol>

              <a
                href={VK_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full py-3 rounded-xl text-mystic-950 font-bold flex items-center justify-center gap-2 mt-4 text-sm"
              >
                <ExternalLink size={16} />
                Открыть бот ВКонтакте
              </a>
            </div>

            <button
              onClick={() => setStep("token")}
              className="btn-gold w-full py-4 rounded-xl text-mystic-950 font-bold text-lg tracking-wide"
            >
              <span className="flex items-center justify-center gap-2">
                <Key size={18} />
                Ввести токен
              </span>
            </button>

            <p className="text-center text-cream-300 text-xs mt-3">
              Уже есть токен? Нажмите «Ввести токен» выше
            </p>
          </>
        )}
      </div>
    </div>
  );
}
