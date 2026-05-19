export interface ForecastInput {
  name: string;
  day: number;
  month: number;
  birthYear: number;
  forecastYear: number;
}

export interface PersonalYearContent {
  theme: string;
  description: string;
  career: string;
  love: string;
  finance: string;
  health: string;
  advice: string;
  luckyMonths: number[];
}

export interface LifePathContent {
  title: string;
  description: string;
  yearNote: string;
}

export interface SunSignContent {
  forecast: string;
  planet: string;
  element: string;
}

export interface TarotContent {
  name: string;
  symbol: string;
  description: string;
  yearMeaning: string;
}

export interface RuneContent {
  name: string;
  symbol: string;
  transliteration: string;
  meaning: string;
  yearMeaning: string;
  love: string;
  finance: string;
  health: string;
  keyMoments: string;
  advice: string;
}

export interface ChineseContent {
  traits: string;
  yearNote: string;
  luckyColors: string[];
}

export interface ForecastData {
  name: string;
  forecastYear: number;
  lifePathNumber: number;
  personalYearNumber: number;
  expressionNumber: number;
  sunSign: { name: string; symbol: string; key: string };
  chineseZodiac: { animal: string; element: string; key: string };
  tarotCard: TarotContent;
  quarterlyTarot: TarotContent[];
  rune: RuneContent;
  seasonalRunes: { season: string; rune: RuneContent }[];
}
