"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hash, Star, Layers, Shield, ChevronDown } from "lucide-react";
import PaymentModal from "./components/PaymentModal";
import WealthCalculator from "./components/WealthCalculator";

const FEATURES = [
  {
    icon: <Hash size={32} className="text-gold-400" />,
    title: "Нумерология",
    desc: "Число жизненного пути, личный год и число вашего имени раскроют скрытые закономерности судьбы",
  },
  {
    icon: <Star size={32} className="text-gold-400" />,
    title: "Астрология",
    desc: "Солнечный знак и китайский гороскоп — два взгляда на ваши природные силы и тенденции года",
  },
  {
    icon: <Layers size={32} className="text-gold-400" />,
    title: "Таро",
    desc: "Карта года из Старших Арканов и квартальные карты расскажут о главных темах каждого сезона",
  },
  {
    icon: <Shield size={32} className="text-gold-400" />,
    title: "Руны",
    desc: "Руна года и сезонные руны Старшего Футарка укажут на энергии, сопровождающие вас",
  },
];

const MONTHS = [
  "Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь",
];

export default function HomePage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [forecastYear, setForecastYear] = useState(String(currentYear));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPayment, setShowPayment] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Введите имя";
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(birthYear);
    if (!day || isNaN(d) || d < 1 || d > 31) e.day = "День: 1–31";
    if (!month || isNaN(m) || m < 1 || m > 12) e.month = "Выберите месяц";
    if (!birthYear || isNaN(y) || y < 1900 || y > currentYear)
      e.year = `Год: 1900–${currentYear}`;
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setShowPayment(true);
  }

  function handlePaymentSuccess() {
    const params = new URLSearchParams({ name: name.trim(), day, month, birthYear, forecastYear });
    router.push(`/forecast?${params.toString()}`);
  }

  return (
    <main className="relative z-10 flex flex-col min-h-screen">
      {/* ─── HERO ─── */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        <div className="float-animation mb-6">
          <Star size={64} className="text-gold-400" strokeWidth={1} />
        </div>

        {/* Fixed heading — no shimmer clip which breaks on some renderers */}
        <h1
          className="text-4xl md:text-6xl font-bold tracking-widest mb-4 uppercase text-gold-400"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Прогноз
          <br />
          <span className="text-cream-100">на год</span>
        </h1>

        <p
          className="text-xl md:text-2xl text-cream-300 italic mb-2"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Нумерология · Астрология · Таро · Руны
        </p>

        <p className="text-cream-200 max-w-xl text-base md:text-lg mt-4 leading-relaxed">
          Персональный многоуровневый прогноз, построенный на четырёх
          древних системах знания — специально для вас и вашего года.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <div className="divider-gold w-16" />
          <span
            className="text-3xl font-bold text-gold-400"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            777 ₽
          </span>
          <div className="divider-gold w-16" />
        </div>
        <p className="text-cream-300 text-sm mt-2">единоразовый платёж · мгновенный результат</p>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="px-4 pb-16 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card-mystic rounded-xl p-6 text-center transition-all duration-300 group cursor-default"
            >
              <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3
                className="text-gold-400 font-semibold text-base mb-2"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {f.title}
              </h3>
              <p className="text-cream-300 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WEALTH CALCULATOR ─── */}
      <WealthCalculator />

      {/* ─── SCROLL HINT ─── */}
      <div className="text-center pb-6 flex flex-col items-center gap-1">
        <p className="text-cream-300 text-sm">Полный прогноз на год за 777 ₽</p>
        <ChevronDown size={20} className="text-gold-400 animate-bounce" />
      </div>

      {/* ─── FORM ─── */}
      <section className="px-4 pb-24 max-w-lg mx-auto w-full">
        <div className="card-mystic rounded-2xl p-8 glow-gold">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star size={20} className="text-gold-400" />
            <h2
              className="text-2xl font-semibold text-gold-400"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Получить прогноз
            </h2>
            <Star size={20} className="text-gold-400" />
          </div>
          <p className="text-center text-cream-300 text-sm mb-6">
            Введите данные — прогноз рассчитывается персонально
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name */}
            <div>
              <label className="block text-cream-200 text-sm mb-1.5">Ваше имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Анастасия"
                className="w-full bg-mystic-900/60 border border-gold-600/40 rounded-lg px-4 py-3 text-cream-100 placeholder-cream-300/40 focus:outline-none focus:border-gold-400 transition-colors"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* DOB */}
            <div>
              <label className="block text-cream-200 text-sm mb-1.5">Дата рождения</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="number" value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="День" min={1} max={31}
                    className="w-full bg-mystic-900/60 border border-gold-600/40 rounded-lg px-3 py-3 text-cream-100 placeholder-cream-300/40 focus:outline-none focus:border-gold-400 transition-colors text-center"
                  />
                  {errors.day && <p className="text-red-400 text-xs mt-1">{errors.day}</p>}
                </div>
                <div>
                  <select
                    value={month} onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-mystic-900/60 border border-gold-600/40 rounded-lg px-2 py-3 text-cream-100 focus:outline-none focus:border-gold-400 transition-colors text-center"
                  >
                    <option value="">Месяц</option>
                    {MONTHS.map((mo, i) => (
                      <option key={mo} value={i + 1}>{mo}</option>
                    ))}
                  </select>
                  {errors.month && <p className="text-red-400 text-xs mt-1">{errors.month}</p>}
                </div>
                <div>
                  <input
                    type="number" value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="Год" min={1900} max={currentYear}
                    className="w-full bg-mystic-900/60 border border-gold-600/40 rounded-lg px-3 py-3 text-cream-100 placeholder-cream-300/40 focus:outline-none focus:border-gold-400 transition-colors text-center"
                  />
                  {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year}</p>}
                </div>
              </div>
            </div>

            {/* Forecast year */}
            <div>
              <label className="block text-cream-200 text-sm mb-1.5">Год прогноза</label>
              <select
                value={forecastYear} onChange={(e) => setForecastYear(e.target.value)}
                className="w-full bg-mystic-900/60 border border-gold-600/40 rounded-lg px-4 py-3 text-cream-100 focus:outline-none focus:border-gold-400 transition-colors"
              >
                {[currentYear, currentYear + 1, currentYear + 2].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="divider-gold" />

            <button type="submit" className="btn-gold w-full py-4 rounded-xl text-mystic-950 font-bold text-lg tracking-wide">
              Получить прогноз за 777 ₽
            </button>
          </form>
        </div>
      </section>

      <footer className="mt-auto py-6 text-center text-cream-300/50 text-xs">
        <p>Прогноз носит ознакомительный характер</p>
      </footer>

      {showPayment && (
        <PaymentModal
          name={name}
          forecastYear={parseInt(forecastYear)}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </main>
  );
}
