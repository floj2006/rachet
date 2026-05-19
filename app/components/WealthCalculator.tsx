"use client";

import { useState } from "react";
import { Coins, Sparkles, ChevronDown } from "lucide-react";
import { getExpressionNumber, getLifePath, getPersonalYear } from "../lib/calculations";

const WEALTH_DATA: Record<number, { title: string; description: string; affirmation: string; color: string }> = {
  1: {
    title: "Первопроходец изобилия",
    description:
      "Ваш путь к богатству — через лидерство и уникальные идеи. Вы рождены создавать собственные источники дохода, а не работать на кого-то. Предпринимательство, инновации и смелые решения открывают для вас потоки изобилия.",
    affirmation: "Я создаю богатство своим уникальным путём",
    color: "from-amber-500/20 to-yellow-600/20",
  },
  2: {
    title: "Дипломат богатства",
    description:
      "Ваш путь к изобилию — через партнёрство и сотрудничество. Вы притягиваете финансовый успех через отношения, переговоры и умение находить взаимную выгоду. Совместные проекты приносят вам больше, чем одиночные усилия.",
    affirmation: "Деньги приходят ко мне через гармоничные союзы",
    color: "from-blue-500/20 to-indigo-600/20",
  },
  3: {
    title: "Творец изобилия",
    description:
      "Ваше богатство рождается из творческого самовыражения. Слова, образы, идеи — это ваша валюта. Чем ярче вы светите своим талантом, тем больший поток изобилия открывается навстречу. Делайте то, что вас вдохновляет — деньги последуют.",
    affirmation: "Мой творческий дар открывает потоки изобилия",
    color: "from-orange-500/20 to-pink-600/20",
  },
  4: {
    title: "Строитель состояния",
    description:
      "Ваш путь к богатству — через терпеливое и методичное строительство. Вы созданы для долгосрочного успеха: планируйте, инвестируйте, создавайте системы. Недвижимость, стабильный бизнес и надёжные вложения — ваши лучшие инструменты.",
    affirmation: "Я методично создаю прочный фундамент своего процветания",
    color: "from-green-600/20 to-emerald-700/20",
  },
  5: {
    title: "Авантюрист изобилия",
    description:
      "Богатство приходит к вам через перемены, движение и нестандартные ходы. Вы умеете монетизировать свободу и разнообразие опыта. Путешествия, новые рынки, смелые эксперименты — там живёт ваше финансовое процветание.",
    affirmation: "Я открыт переменам — и изобилие находит меня везде",
    color: "from-teal-500/20 to-cyan-600/20",
  },
  6: {
    title: "Хранитель достатка",
    description:
      "Ваш путь к изобилию — через служение, заботу и создание гармонии. Вы притягиваете деньги, когда помогаете другим: исцеление, образование, красота, семейный бизнес — всё это резонирует с вашей природой и приносит доход.",
    affirmation: "Моя забота о других возвращается ко мне изобилием",
    color: "from-rose-500/20 to-pink-600/20",
  },
  7: {
    title: "Мудрец процветания",
    description:
      "Ваше богатство рождается из знания и глубины. Исследования, аналитика, эзотерика, наука, консультации — это ваши денежные каналы. Чем глубже ваши знания, тем выше ваша финансовая ценность для мира.",
    affirmation: "Моя мудрость — бесценный ресурс, притягивающий изобилие",
    color: "from-violet-600/20 to-purple-700/20",
  },
  8: {
    title: "Властелин изобилия",
    description:
      "Вы рождены управлять ресурсами и создавать масштаб. Восьмёрка — самое финансово мощное число: власть, бизнес, инвестиции, крупные сделки — это ваша стихия. Чем больше ответственности вы берёте, тем больше богатства притягиваете.",
    affirmation: "Я рождён управлять потоками изобилия с мудростью",
    color: "from-yellow-500/20 to-amber-600/20",
  },
  9: {
    title: "Гуманист изобилия",
    description:
      "Ваше богатство неразрывно связано со служением большой идее. Чем шире ваш вклад в мир, тем щедрее поток изобилия. Отпустите скупость — ваша природа требует давать, и Вселенная возвращает это многократно.",
    affirmation: "Чем больше я отдаю миру, тем больше получаю",
    color: "from-indigo-500/20 to-blue-600/20",
  },
  11: {
    title: "Вдохновитель изобилия",
    description:
      "Мастер-число 11 несёт особую финансовую силу. Ваш источник богатства — вдохновение и высшее видение. Когда вы служите своей миссии, деньги следуют за вами как естественное следствие вашего влияния на мир.",
    affirmation: "Моя миссия притягивает изобилие на всех уровнях",
    color: "from-gold-500/20 to-amber-400/20",
  },
  22: {
    title: "Мастер-строитель изобилия",
    description:
      "Мастер-число 22 — наивысший потенциал материального воплощения. Вы способны создавать богатство в масштабах, которые меняют жизни многих людей. Ваша задача — мыслить грандиозно и не бояться своего масштаба.",
    affirmation: "Я воплощаю грандиозные замыслы и создаю изобилие для многих",
    color: "from-gold-600/20 to-yellow-500/20",
  },
};

const MONTHS = [
  "Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь",
];

export default function WealthCalculator() {
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [result, setResult] = useState<{ wealthNumber: number; code: number[]; data: (typeof WEALTH_DATA)[number] } | null>(null);
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();

  function calculate() {
    if (!name.trim()) { setError("Введите имя"); return; }
    const d = parseInt(day), m = parseInt(month), y = parseInt(birthYear);
    if (!day || isNaN(d) || d < 1 || d > 31) { setError("Проверьте дату рождения"); return; }
    if (!month || isNaN(m)) { setError("Выберите месяц"); return; }
    if (!birthYear || isNaN(y) || y < 1900 || y > currentYear) { setError(`Год: 1900–${currentYear}`); return; }

    setError("");

    function toSingle(n: number): number {
      if (n <= 9) return n === 0 ? 1 : n;
      return toSingle(n.toString().split("").reduce((a, b) => a + parseInt(b), 0));
    }

    const lp   = toSingle(getLifePath(d, m, y));
    const expr = toSingle(getExpressionNumber(name.trim()));
    const py   = toSingle(getPersonalYear(d, m, currentYear));
    const dn   = toSingle(d);

    const code = [lp, expr, py, dn];
    const wn = toSingle(lp + expr);
    const data = WEALTH_DATA[wn] ?? WEALTH_DATA[1];
    setResult({ wealthNumber: wn, code, data });
  }

  return (
    <section className="px-4 pb-16 max-w-2xl mx-auto w-full">
      <div className="card-mystic rounded-2xl p-8 border border-gold-500/30">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="text-gold-400" size={28} />
            <h2
              className="text-2xl font-semibold text-gold-400"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Число богатства
            </h2>
            <Coins className="text-gold-400" size={28} />
          </div>
          <p className="text-cream-300 text-sm">
            Узнайте свой персональный код изобилия — бесплатно
          </p>
        </div>

        <div className="divider-gold mb-6" />

        {!result ? (
          <div className="space-y-4">
            <div>
              <label className="block text-cream-200 text-sm mb-1.5">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full bg-mystic-900/60 border border-gold-600/40 rounded-lg px-4 py-3 text-cream-100 placeholder-cream-300/40 focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-cream-200 text-sm mb-1.5">Дата рождения</label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="День"
                  min={1} max={31}
                  className="bg-mystic-900/60 border border-gold-600/40 rounded-lg px-3 py-3 text-cream-100 placeholder-cream-300/40 focus:outline-none focus:border-gold-400 transition-colors text-center"
                />
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="bg-mystic-900/60 border border-gold-600/40 rounded-lg px-2 py-3 text-cream-100 focus:outline-none focus:border-gold-400 transition-colors text-center"
                >
                  <option value="">Месяц</option>
                  {MONTHS.map((mo, i) => (
                    <option key={mo} value={i + 1}>{mo}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="Год"
                  min={1900} max={currentYear}
                  className="bg-mystic-900/60 border border-gold-600/40 rounded-lg px-3 py-3 text-cream-100 placeholder-cream-300/40 focus:outline-none focus:border-gold-400 transition-colors text-center"
                />
              </div>
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>

            <button
              onClick={calculate}
              className="btn-gold w-full py-3 rounded-xl text-mystic-950 font-bold flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              Рассчитать бесплатно
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Result */}
            <div className={`rounded-xl p-6 bg-gradient-to-br ${result.data.color} border border-gold-500/30`}>
              <div className="mb-4 text-center">
                <p className="text-cream-300 text-xs mb-2">Код богатства</p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  {result.code.map((digit, i) => (
                    <div
                      key={i}
                      className="w-14 h-16 flex items-center justify-center rounded-xl border border-gold-500/50 bg-mystic-900/60 text-3xl font-bold text-gold-400"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {digit}
                    </div>
                  ))}
                </div>
                <p
                  className="text-gold-400 font-semibold text-lg"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {result.data.title}
                </p>
              </div>

              <p
                className="text-cream-200 leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.05rem" }}
              >
                {result.data.description}
              </p>

              <div className="bg-mystic-900/40 rounded-lg px-4 py-3 border border-gold-600/20">
                <p className="text-gold-400 text-xs mb-1">Аффирмация изобилия</p>
                <p
                  className="text-cream-100 italic"
                  style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem" }}
                >
                  «{result.data.affirmation}»
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-cream-300 text-sm mb-3">
                Хотите узнать полный нумерологический, астрологический, тарологический и рунологический прогноз?
              </p>
              <div className="flex items-center justify-center gap-2 text-gold-400 text-sm animate-bounce">
                <ChevronDown size={16} />
                <span>Заполните форму ниже</span>
                <ChevronDown size={16} />
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setName(""); setDay(""); setMonth(""); setBirthYear(""); }}
              className="w-full py-2 rounded-xl border border-gold-600/30 text-cream-300 hover:text-gold-400 hover:border-gold-400/50 transition-colors text-sm"
            >
              Рассчитать для другого человека
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
