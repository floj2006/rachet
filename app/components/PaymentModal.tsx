"use client";

import { useState } from "react";
import { X, Sparkles, Eye, Check, Loader2, CreditCard } from "lucide-react";

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

export default function PaymentModal({ name, forecastYear, onSuccess, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handlePay() {
    setLoading(true);
    // TODO: replace with real payment provider (e.g. YooKassa, Stripe)
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(onSuccess, 1500);
    }, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-mystic-950/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative card-mystic rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream-300 hover:text-gold-400 transition-colors"
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>

        {done ? (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4 float-animation">
              <Sparkles size={52} className="text-gold-400" strokeWidth={1.5} />
            </div>
            <h3
              className="text-2xl font-semibold text-gold-400 mb-2"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Оплата прошла!
            </h3>
            <p className="text-cream-200">Открываю ваш прогноз…</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
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

            <div className="divider-gold mb-6" />

            <ul className="space-y-2 mb-6 text-cream-200 text-sm">
              {ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check size={14} className="text-gold-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="divider-gold mb-6" />

            <div className="text-center mb-6">
              <span
                className="text-4xl font-bold text-gold-400"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                777 ₽
              </span>
              <p className="text-cream-300 text-xs mt-1">единоразовый платёж</p>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="btn-gold w-full py-4 rounded-xl text-mystic-950 font-bold text-lg tracking-wide disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Обработка…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CreditCard size={18} />
                  Оплатить 777 ₽
                </span>
              )}
            </button>

            <p className="text-center text-cream-300 text-xs mt-3">
              Безопасная оплата · Мгновенный доступ к прогнозу
            </p>
          </>
        )}
      </div>
    </div>
  );
}
