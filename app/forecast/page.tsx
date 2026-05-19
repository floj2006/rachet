"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, Suspense } from "react";
import {
  Hash, Star, Layers, Shield, Sparkles, ArrowLeft, ChevronRight,
  Sprout, Users, Hammer, Wind, Heart, Eye, Gem, BookOpen, Zap, Landmark,
  PawPrint, Rabbit, Dog, Bird, Flame,
} from "lucide-react";

// Personal year icon map — no emojis
const YEAR_ICON: Record<number, React.ReactNode> = {
  1:  <Sprout   size={22} className="text-gold-400" />,
  2:  <Users    size={22} className="text-gold-400" />,
  3:  <Sparkles size={22} className="text-gold-400" />,
  4:  <Hammer   size={22} className="text-gold-400" />,
  5:  <Wind     size={22} className="text-gold-400" />,
  6:  <Heart    size={22} className="text-gold-400" />,
  7:  <Eye      size={22} className="text-gold-400" />,
  8:  <Gem      size={22} className="text-gold-400" />,
  9:  <BookOpen size={22} className="text-gold-400" />,
  11: <Zap      size={22} className="text-gold-400" />,
  22: <Landmark size={22} className="text-gold-400" />,
};

// Chinese zodiac icon map — no emojis
const ZODIAC_ICON: Record<string, React.ReactNode> = {
  rat:      <PawPrint size={36} className="text-gold-400" strokeWidth={1.5} />,
  ox:       <PawPrint size={36} className="text-gold-400" strokeWidth={1.5} />,
  tiger:    <PawPrint size={36} className="text-gold-400" strokeWidth={1.5} />,
  rabbit:   <Rabbit   size={36} className="text-gold-400" strokeWidth={1.5} />,
  dragon:   <Flame    size={36} className="text-gold-400" strokeWidth={1.5} />,
  snake:    <Wind     size={36} className="text-gold-400" strokeWidth={1.5} />,
  horse:    <PawPrint size={36} className="text-gold-400" strokeWidth={1.5} />,
  goat:     <PawPrint size={36} className="text-gold-400" strokeWidth={1.5} />,
  monkey:   <PawPrint size={36} className="text-gold-400" strokeWidth={1.5} />,
  rooster:  <Bird     size={36} className="text-gold-400" strokeWidth={1.5} />,
  dog:      <Dog      size={36} className="text-gold-400" strokeWidth={1.5} />,
  pig:      <PawPrint size={36} className="text-gold-400" strokeWidth={1.5} />,
};
import { generateForecast, getExpressionNumber, getLifePath } from "../lib/calculations";
import {
  PERSONAL_YEAR_DATA,
  LIFE_PATH_DATA,
  SUN_SIGN_DATA,
  CHINESE_DATA,
} from "../lib/content";
import type { ForecastData } from "../lib/types";
import DownloadChecks from "../components/DownloadChecks";
import ZodiacIcon from "../components/ZodiacIcon";

const QUARTER_LABELS = ["I квартал (янв–мар)", "II квартал (апр–июн)", "III квартал (июл–сен)", "IV квартал (окт–дек)"];
const MONTH_NAMES = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-gold-400 shrink-0">{icon}</span>
      <h2
        className="text-2xl font-semibold text-gold-400 tracking-wide"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {title}
      </h2>
      <div className="flex-1 divider-gold ml-2" />
    </div>
  );
}

function NumberBadge({ n, label }: { n: number; label: string }) {
  return (
    <div className="card-mystic rounded-xl p-4 text-center">
      <div
        className="text-4xl font-bold text-gold-400 mb-1"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {n}
      </div>
      <div className="text-cream-300 text-xs">{label}</div>
    </div>
  );
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="card-mystic rounded-xl p-5 text-cream-200 leading-relaxed text-sm md:text-base"
      style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.05rem" }}>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 items-start">
      <ChevronRight size={14} className="text-gold-500 shrink-0 mt-1" />
      <div>
        <span className="text-gold-400 font-semibold">{label}:</span>{" "}
        <span className="text-cream-200">{value}</span>
      </div>
    </div>
  );
}

function ForecastContent() {
  const params = useSearchParams();
  const router = useRouter();

  const input = useMemo(() => {
    const name = params.get("name") ?? "";
    const day = parseInt(params.get("day") ?? "1");
    const month = parseInt(params.get("month") ?? "1");
    const birthYear = parseInt(params.get("birthYear") ?? "1990");
    const forecastYear = parseInt(params.get("forecastYear") ?? String(new Date().getFullYear()));
    return { name, day, month, birthYear, forecastYear };
  }, [params]);

  const forecast: ForecastData = useMemo(() => generateForecast(input), [input]);

  const wealthNumber = useMemo(() => {
    const { name, day, month, birthYear } = input;
    const expr = getExpressionNumber(name);
    const lp = getLifePath(day, month, birthYear);
    const raw = expr + lp;
    const reduce = (n: number): number =>
      n <= 9 || n === 11 || n === 22 ? n : reduce(n.toString().split("").reduce((a, b) => a + parseInt(b), 0));
    return reduce(raw);
  }, [input]);

  const pyData = PERSONAL_YEAR_DATA[forecast.personalYearNumber] ?? PERSONAL_YEAR_DATA[1];
  const lpData = LIFE_PATH_DATA[forecast.lifePathNumber] ?? LIFE_PATH_DATA[1];
  const exprData = LIFE_PATH_DATA[forecast.expressionNumber] ?? LIFE_PATH_DATA[1];
  const sunData = SUN_SIGN_DATA[forecast.sunSign.key] ?? SUN_SIGN_DATA["aries"];
  const chiData = CHINESE_DATA[forecast.chineseZodiac.key] ?? CHINESE_DATA["rat"];

  const luckyMonthNames = pyData.luckyMonths.map((m) => MONTH_NAMES[m - 1]).join(", ");

  return (
    <main className="relative z-10 min-h-screen px-4 py-12 max-w-4xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-cream-300 hover:text-gold-400 transition-colors text-sm mb-8"
      >
        <ArrowLeft size={16} /> Новый прогноз
      </button>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="float-animation mb-4 flex justify-center">
          <Sparkles size={52} className="text-gold-400" strokeWidth={1} />
        </div>
        <h1
          className="text-3xl md:text-4xl font-bold tracking-widest uppercase mb-2 text-gold-400"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Ваш прогноз
        </h1>
        <p
          className="text-xl text-cream-300 italic"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {forecast.name} · {forecast.forecastYear} год
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-12">
        <NumberBadge n={forecast.lifePathNumber} label="Путь жизни" />
        <NumberBadge n={forecast.personalYearNumber} label="Личный год" />
        <NumberBadge n={forecast.expressionNumber} label="Число имени" />
      </div>

      <div className="space-y-12">
        {/* ═══ НУМЕРОЛОГИЯ ═══ */}
        <section>
          <SectionTitle icon={<Hash size={24} />} title="Нумерологический прогноз" />

          <div className="space-y-4">
            {/* Personal Year */}
            <InfoCard>
              <div className="flex items-center gap-3 mb-3">
                <span className="shrink-0">{YEAR_ICON[forecast.personalYearNumber] ?? <Star size={22} className="text-gold-400" />}</span>
                <div className="text-gold-400 font-semibold">
                  Личный год {forecast.personalYearNumber} — {pyData.theme}
                </div>
              </div>
              <p className="mb-4 text-cream-200">{pyData.description}</p>
              <div className="space-y-2">
                <Row label="Карьера" value={pyData.career} />
                <Row label="Любовь" value={pyData.love} />
                <Row label="Финансы" value={pyData.finance} />
                <Row label="Здоровье" value={pyData.health} />
              </div>
              <div className="mt-4 p-3 bg-gold-600/10 border border-gold-600/20 rounded-lg">
                <span className="text-gold-400 font-semibold">Главный совет: </span>
                <span className="text-cream-200">{pyData.advice}</span>
              </div>
              <div className="mt-3 text-cream-300 text-sm">
                <span className="text-gold-500">Благоприятные месяцы: </span>{luckyMonthNames}
              </div>
            </InfoCard>

            {/* Life Path */}
            <InfoCard>
              <div className="text-gold-400 font-semibold mb-2">
                Число жизненного пути {forecast.lifePathNumber} — {lpData.title}
              </div>
              <p className="mb-2">{lpData.description}</p>
              <p className="text-cream-300 text-sm italic">{lpData.yearNote}</p>
            </InfoCard>

            {/* Expression */}
            <InfoCard>
              <div className="text-gold-400 font-semibold mb-2">
                Число имени {forecast.expressionNumber} — {exprData.title}
              </div>
              <p>{exprData.description}</p>
            </InfoCard>
          </div>
        </section>

        <div className="divider-gold" />

        {/* ═══ АСТРОЛОГИЯ ═══ */}
        <section>
          <SectionTitle icon={<Star size={24} />} title="Астрологический прогноз" />

          <div className="space-y-4">
            {/* Sun Sign */}
            <InfoCard>
              <div className="flex items-center gap-3 mb-3">
                <ZodiacIcon signKey={forecast.sunSign.key} size={48} />
                <div>
                  <div className="text-gold-400 font-semibold text-lg">{forecast.sunSign.name}</div>
                  <div className="text-cream-300 text-sm">
                    Планета-покровитель: {sunData.planet} · Стихия: {sunData.element}
                  </div>
                </div>
              </div>
              <p>{sunData.forecast}</p>
            </InfoCard>

            {/* Chinese Zodiac */}
            <InfoCard>
              <div className="flex items-center gap-3 mb-3">
                <span className="shrink-0">{ZODIAC_ICON[forecast.chineseZodiac.key] ?? <PawPrint size={36} className="text-gold-400" strokeWidth={1.5} />}</span>
                <div className="text-gold-400 font-semibold">
                  {forecast.chineseZodiac.element} {forecast.chineseZodiac.animal} — китайский гороскоп
                </div>
              </div>
              <p className="mb-2">{chiData.traits}</p>
              <p className="text-cream-300 italic">{chiData.yearNote}</p>
              <div className="mt-3 text-sm">
                <span className="text-gold-500">Счастливые цвета: </span>
                <span className="text-cream-300">{chiData.luckyColors.join(", ")}</span>
              </div>
            </InfoCard>
          </div>
        </section>

        <div className="divider-gold" />

        {/* ═══ ТАРО ═══ */}
        <section>
          <SectionTitle icon={<Layers size={24} />} title="Тарологический прогноз" />

          <div className="space-y-4">
            {/* Card of the year */}
            <InfoCard>
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="shrink-0 w-16 h-24 card-mystic rounded-lg flex items-center justify-center glow-gold"
                >
                  <div className="text-center">
                    <div className="text-gold-400 text-xs">{forecast.tarotCard.symbol}</div>
                    <div className="text-cream-200 text-xs mt-1 font-semibold leading-tight px-1">
                      {forecast.tarotCard.name}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-gold-400 font-semibold mb-1">
                    Карта года — {forecast.tarotCard.name} ({forecast.tarotCard.symbol})
                  </div>
                  <p className="mb-2">{forecast.tarotCard.description}</p>
                  <p className="text-cream-300 italic">{forecast.tarotCard.yearMeaning}</p>
                </div>
              </div>
            </InfoCard>

            {/* Quarterly cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {forecast.quarterlyTarot.map((card, i) => (
                <div key={i} className="card-mystic rounded-xl p-4 text-center">
                  <div
                    className="text-gold-400 text-xs mb-1"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {QUARTER_LABELS[i].split(" ")[0]} {QUARTER_LABELS[i].split(" ")[1]}
                  </div>
                  <div className="text-cream-300 text-xs mb-2">{QUARTER_LABELS[i].split(" ").slice(2).join(" ")}</div>
                  <div className="text-2xl text-gold-500 mb-1">{card.symbol}</div>
                  <div
                    className="text-cream-200 text-xs font-semibold"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {card.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider-gold" />

        {/* ═══ РУНЫ ═══ */}
        <section>
          <SectionTitle icon={<Shield size={24} />} title="Рунологический прогноз" />

          <div className="space-y-4">
            {/* Rune of the year */}
            <InfoCard>
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0 w-16 h-16 card-mystic rounded-xl flex items-center justify-center">
                  <span className="section-rune text-gold-400">
                    {forecast.rune.symbol}
                  </span>
                </div>
                <div>
                  <div className="text-gold-400 font-semibold mb-1">
                    Руна года — {forecast.rune.name} ({forecast.rune.transliteration})
                  </div>
                  <p className="mb-2 text-cream-300 text-sm">{forecast.rune.meaning}</p>
                  <p>{forecast.rune.yearMeaning}</p>
                </div>
              </div>
              <div className="divider-gold mb-4" />
              <div className="space-y-3">
                <Row label="Любовь и отношения" value={forecast.rune.love} />
                <Row label="Финансы" value={forecast.rune.finance} />
                <Row label="Энергия и здоровье" value={forecast.rune.health} />
                <Row label="Ключевые моменты года" value={forecast.rune.keyMoments} />
              </div>
              <div className="mt-4 p-3 bg-gold-600/10 border border-gold-600/20 rounded-lg">
                <span className="text-gold-400 font-semibold">Совет года: </span>
                <span className="text-cream-200">{forecast.rune.advice}</span>
              </div>
            </InfoCard>

            {/* Seasonal runes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {forecast.seasonalRunes.map(({ season, rune }) => (
                <div key={season} className="card-mystic rounded-xl p-4 text-center">
                  <div className="text-gold-400 text-xs mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {season}
                  </div>
                  <div className="text-3xl text-gold-400 my-2" style={{ textShadow: "0 0 20px rgba(201,168,76,0.6)" }}>
                    {rune.symbol}
                  </div>
                  <div className="text-cream-200 text-xs font-semibold">{rune.name}</div>
                  <div className="text-cream-300 text-xs mt-1">{rune.transliteration}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider-gold" />

        {/* ═══ СВОДНЫЙ ПРОГНОЗ ═══ */}
        <section>
          <SectionTitle icon={<Sparkles size={24} />} title="Сводный прогноз" />

          <InfoCard>
            <p className="mb-4">
              <span className="text-gold-400 font-semibold">{forecast.name}</span>, ваш{" "}
              {forecast.forecastYear} год — это{" "}
              <span className="text-gold-400">{pyData.theme.toLowerCase()}</span>. Под влиянием{" "}
              знака <span className="text-gold-400">{forecast.sunSign.name}</span> и руны{" "}
              <span className="text-gold-400">{forecast.rune.name}</span>, вы входите в год с{" "}
              особым посланием: <span className="italic text-cream-100">{forecast.tarotCard.yearMeaning}</span>
            </p>
            <p className="mb-4">
              Ваш жизненный путь <span className="text-gold-400 font-semibold">{forecast.lifePathNumber}</span> —{" "}
              {lpData.title} — усиливает темы этого года. {lpData.yearNote}
            </p>
            <p>
              Особое внимание уделите месяцам:{" "}
              <span className="text-gold-400 font-semibold">{luckyMonthNames}</span> — это время
              наибольшего потенциала и открытости к переменам.
            </p>
          </InfoCard>
        </section>
      </div>

      {/* Checks download */}
      <div className="mt-12">
        <DownloadChecks forecast={forecast} wealthNumber={wealthNumber} />
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-cream-300/40 text-xs pb-8">
        <div className="divider-gold mb-6" />
        <p>Прогноз составлен персонально для {forecast.name} · {forecast.forecastYear} год</p>
        <p className="mt-1">Носит ознакомительный характер</p>
      </footer>
    </main>
  );
}

export default function ForecastPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="float-animation mb-4 flex justify-center"><Eye size={52} className="text-gold-400" strokeWidth={1} /></div>
            <p className="text-gold-400" style={{ fontFamily: "var(--font-cinzel)" }}>
              Рассчитываю прогноз…
            </p>
          </div>
        </div>
      }
    >
      <ForecastContent />
    </Suspense>
  );
}
