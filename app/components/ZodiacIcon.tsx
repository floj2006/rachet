"use client";

import type { IconType } from "react-icons";
import {
  TbZodiacAries,
  TbZodiacTaurus,
  TbZodiacGemini,
  TbZodiacCancer,
  TbZodiacLeo,
  TbZodiacVirgo,
  TbZodiacLibra,
  TbZodiacScorpio,
  TbZodiacSagittarius,
  TbZodiacCapricorn,
  TbZodiacAquarius,
  TbZodiacPisces,
} from "react-icons/tb";

const ICONS: Record<string, IconType> = {
  aries:       TbZodiacAries,
  taurus:      TbZodiacTaurus,
  gemini:      TbZodiacGemini,
  cancer:      TbZodiacCancer,
  leo:         TbZodiacLeo,
  virgo:       TbZodiacVirgo,
  libra:       TbZodiacLibra,
  scorpio:     TbZodiacScorpio,
  sagittarius: TbZodiacSagittarius,
  capricorn:   TbZodiacCapricorn,
  aquarius:    TbZodiacAquarius,
  pisces:      TbZodiacPisces,
};

interface Props {
  signKey: string;
  size?: number;
  className?: string;
}

export default function ZodiacIcon({ signKey, size = 48, className = "text-gold-400" }: Props) {
  const Icon = ICONS[signKey];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}
