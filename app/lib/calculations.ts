import type { ForecastInput, ForecastData } from './types';
import {
  PERSONAL_YEAR_DATA,
  LIFE_PATH_DATA,
  SUN_SIGN_DATA,
  TAROT_DATA,
  RUNE_DATA,
  CHINESE_DATA,
} from './content';

function digitSum(n: number): number {
  return Math.abs(n)
    .toString()
    .split('')
    .reduce((sum, d) => sum + parseInt(d), 0);
}

function reduceToMaster(n: number): number {
  if (n <= 9 || n === 11 || n === 22) return n;
  return reduceToMaster(digitSum(n));
}

export function getLifePath(day: number, month: number, year: number): number {
  return reduceToMaster(digitSum(day) + digitSum(month) + digitSum(year));
}

export function getPersonalYear(day: number, month: number, forecastYear: number): number {
  return reduceToMaster(digitSum(day) + digitSum(month) + digitSum(forecastYear));
}

const RUSSIAN_TABLE: Record<string, number> = {
  А: 1, Б: 2, В: 3, Г: 4, Д: 5, Е: 6, Ё: 7, Ж: 8, З: 9,
  И: 1, Й: 2, К: 3, Л: 4, М: 5, Н: 6, О: 7, П: 8, Р: 9,
  С: 1, Т: 2, У: 3, Ф: 4, Х: 5, Ц: 6, Ч: 7, Ш: 8, Щ: 9,
  Ъ: 1, Ы: 2, Ь: 3, Э: 4, Ю: 5, Я: 6,
};

const LATIN_TABLE: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

export function getExpressionNumber(name: string): number {
  const sum = name
    .toUpperCase()
    .split('')
    .reduce((acc, ch) => acc + (RUSSIAN_TABLE[ch] ?? LATIN_TABLE[ch] ?? 0), 0);
  return reduceToMaster(sum);
}

export function getSunSign(day: number, month: number): { name: string; symbol: string; key: string } {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: 'Овен', symbol: '♈', key: 'aries' };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: 'Телец', symbol: '♉', key: 'taurus' };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: 'Близнецы', symbol: '♊', key: 'gemini' };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: 'Рак', symbol: '♋', key: 'cancer' };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: 'Лев', symbol: '♌', key: 'leo' };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: 'Дева', symbol: '♍', key: 'virgo' };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: 'Весы', symbol: '♎', key: 'libra' };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: 'Скорпион', symbol: '♏', key: 'scorpio' };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: 'Стрелец', symbol: '♐', key: 'sagittarius' };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: 'Козерог', symbol: '♑', key: 'capricorn' };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: 'Водолей', symbol: '♒', key: 'aquarius' };
  return { name: 'Рыбы', symbol: '♓', key: 'pisces' };
}

const ANIMALS = ['Крыса', 'Бык', 'Тигр', 'Кролик', 'Дракон', 'Змея', 'Лошадь', 'Коза', 'Обезьяна', 'Петух', 'Собака', 'Свинья'];
const ANIMAL_KEYS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
const ELEMENTS = ['Металл', 'Вода', 'Дерево', 'Огонь', 'Земля'];

export function getChineseZodiac(birthYear: number): { animal: string; element: string; key: string } {
  const ai = ((birthYear - 1900) % 12 + 12) % 12;
  const ei = (Math.floor((birthYear - 1924) / 2) % 5 + 5) % 5;
  return { animal: ANIMALS[ai], element: ELEMENTS[ei], key: ANIMAL_KEYS[ai] };
}

function getTarotByNumber(n: number) {
  const key = n <= 9 ? n : n === 11 ? 11 : 22;
  return TAROT_DATA[key] ?? TAROT_DATA[1];
}

function getRuneByNumber(n: number) {
  const key = ((n - 1 + 24) % 9) + 1;
  return RUNE_DATA[key] ?? RUNE_DATA[1];
}

export function generateForecast(input: ForecastInput): ForecastData {
  const { name, day, month, birthYear, forecastYear } = input;
  const lp = getLifePath(day, month, birthYear);
  const py = getPersonalYear(day, month, forecastYear);
  const expr = getExpressionNumber(name);
  const sunSign = getSunSign(day, month);
  const chinese = getChineseZodiac(birthYear);

  const tarotCard = getTarotByNumber(py);
  const quarterlyTarot = [1, 4, 7, 10].map((m) => {
    const qn = reduceToMaster(py + m);
    return getTarotByNumber(qn > 9 && qn !== 11 && qn !== 22 ? reduceToMaster(qn) : qn);
  });

  const rune = getRuneByNumber(lp);
  const seasons = ['Зима', 'Весна', 'Лето', 'Осень'];
  const seasonalRunes = seasons.map((season, i) => ({
    season,
    rune: getRuneByNumber(((lp + i * 2 - 1) % 9) + 1),
  }));

  return {
    name,
    forecastYear,
    lifePathNumber: lp,
    personalYearNumber: py,
    expressionNumber: expr,
    sunSign,
    chineseZodiac: chinese,
    tarotCard,
    quarterlyTarot,
    rune,
    seasonalRunes,
  };
}

export { PERSONAL_YEAR_DATA, LIFE_PATH_DATA, SUN_SIGN_DATA, CHINESE_DATA };
