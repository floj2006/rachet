"use client";

import { useState } from "react";
import { Download, Star, Sparkles, Loader2, Smartphone } from "lucide-react";
import type { ForecastData } from "../lib/types";
import type { CheckInput } from "../lib/draw-check";
import ZodiacIcon from "./ZodiacIcon";
import { MONTHS } from "../lib/draw-wallpaper";

interface Props {
  forecast: ForecastData;
  wealthNumber: number;
}

export default function DownloadChecks({ forecast, wealthNumber }: Props) {
  const [loading, setLoading] = useState<"universe" | "gratitude" | null>(null);
  const [wallpaperLoading, setWallpaperLoading] = useState<number | null>(null);

  const input: CheckInput = {
    name: forecast.name,
    sunSignKey: forecast.sunSign.key,
    sunSignName: forecast.sunSign.name,
    personalYearNumber: forecast.personalYearNumber,
    lifePathNumber: forecast.lifePathNumber,
    forecastYear: forecast.forecastYear,
    wealthNumber,
  };

  async function handleWallpaper(monthIndex: number) {
    setWallpaperLoading(monthIndex);
    try {
      const { downloadWallpaper } = await import("../lib/draw-wallpaper");
      await downloadWallpaper(monthIndex);
    } finally {
      setWallpaperLoading(null);
    }
  }

  async function handleDownload(type: "universe" | "gratitude") {
    setLoading(type);
    try {
      const { downloadCheck } = await import("../lib/draw-check");
      await downloadCheck(type, input);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="card-mystic rounded-2xl p-8 border border-gold-500/40">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={22} className="text-gold-400" />
          <h3
            className="text-xl font-semibold text-gold-400"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Ваши чеки
          </h3>
          <Sparkles size={22} className="text-gold-400" />
        </div>
        <p className="text-cream-300 text-sm">
          Распечатайте и храните как напоминание о своих намерениях
        </p>
      </div>

      <div className="divider-gold mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Universe Check */}
        <div className="card-mystic rounded-xl p-5 text-center group">
          <div className="flex justify-center mb-3">
            <Star size={32} className="text-gold-400 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          </div>
          <h4
            className="text-gold-400 font-semibold mb-1 text-sm"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Чек Вселенной
          </h4>
          <p className="text-cream-300 text-xs mb-4 leading-relaxed flex items-center gap-1 flex-wrap justify-center">
            Финансовый заказ Вселенной с вашим созвездием{" "}
            <ZodiacIcon signKey={forecast.sunSign.key} size={18} className="text-gold-400 inline" />
            {forecast.sunSign.name} и суммой изобилия
          </p>
          <button
            onClick={() => handleDownload("universe")}
            disabled={loading !== null}
            className="btn-gold w-full py-2.5 rounded-lg text-mystic-950 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading === "universe" ? (
              <><Loader2 size={16} className="animate-spin" /> Создаю PDF…</>
            ) : (
              <><Download size={16} /> Скачать PDF</>
            )}
          </button>
        </div>

        {/* Gratitude Check */}
        <div className="card-mystic rounded-xl p-5 text-center group">
          <div className="flex justify-center mb-3">
            <Sparkles size={32} className="text-gold-400 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          </div>
          <h4
            className="text-gold-400 font-semibold mb-1 text-sm"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Чек Благодарности
          </h4>
          <p className="text-cream-300 text-xs mb-4 leading-relaxed">
            Письмо благодарности Вселенной с вашим созвездием и персональными аффирмациями
          </p>
          <button
            onClick={() => handleDownload("gratitude")}
            disabled={loading !== null}
            className="btn-gold w-full py-2.5 rounded-lg text-mystic-950 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading === "gratitude" ? (
              <><Loader2 size={16} className="animate-spin" /> Создаю PDF…</>
            ) : (
              <><Download size={16} /> Скачать PDF</>
            )}
          </button>
        </div>
      </div>

      <p className="text-center text-cream-300/40 text-xs mt-5">
        PDF генерируется в вашем браузере · Созвездие {forecast.sunSign.name} рисуется индивидуально
      </p>

      <div className="divider-gold my-6" />

      {/* Wallpapers */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Smartphone size={20} className="text-gold-400" />
          <h4
            className="text-gold-400 font-semibold"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Заставки на телефон
          </h4>
        </div>
        <p className="text-cream-300 text-xs">Аффирмация и мантра на каждый месяц года</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {MONTHS.map((month, i) => (
          <button
            key={i}
            onClick={() => handleWallpaper(i)}
            disabled={wallpaperLoading !== null}
            className="card-mystic rounded-xl p-3 text-center hover:border-gold-400/50 border border-transparent transition-all disabled:opacity-60"
          >
            {wallpaperLoading === i ? (
              <Loader2 size={16} className="animate-spin text-gold-400 mx-auto mb-1" />
            ) : (
              <span className="text-xl block mb-1">{month.icon}</span>
            )}
            <div className="text-gold-400 text-xs font-semibold" style={{ fontFamily: "var(--font-cinzel)" }}>
              {month.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
