import { CONSTELLATIONS } from './constellations';
import { PERSONAL_YEAR_DATA, LIFE_PATH_DATA, SUN_SIGN_DATA } from './content';

export interface CheckInput {
  name: string;
  sunSignKey: string;
  sunSignName: string;
  personalYearNumber: number;
  lifePathNumber: number;
  forecastYear: number;
  wealthNumber: number;
}

const W = 794;
const H = 1123;
const GOLD = '#c9a84c';
const GOLD_LIGHT = '#e8c96b';
const GOLD_DIM = 'rgba(201,168,76,0.4)';
const BG = '#06030f';
const CREAM = '#e8d5b0';
const CREAM_DIM = 'rgba(232,213,176,0.65)';

// ─── Seeded pseudo-random (same result every call for same seed) ──────────────
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ─── Starry sky background ────────────────────────────────────────────────────
function drawStarField(ctx: CanvasRenderingContext2D, seed: number) {
  const rng = seededRand(seed);

  // Deep space gradient
  const grad = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, W * 0.8);
  grad.addColorStop(0, '#120826');
  grad.addColorStop(0.5, '#0a0618');
  grad.addColorStop(1, BG);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle nebula glow
  const nebula = ctx.createRadialGradient(W * 0.35, H * 0.28, 0, W * 0.35, H * 0.28, 200);
  nebula.addColorStop(0, 'rgba(80,40,140,0.18)');
  nebula.addColorStop(1, 'transparent');
  ctx.fillStyle = nebula;
  ctx.fillRect(0, 0, W, H);

  const nebula2 = ctx.createRadialGradient(W * 0.7, H * 0.65, 0, W * 0.7, H * 0.65, 160);
  nebula2.addColorStop(0, 'rgba(20,60,120,0.15)');
  nebula2.addColorStop(1, 'transparent');
  ctx.fillStyle = nebula2;
  ctx.fillRect(0, 0, W, H);

  // Stars — three sizes
  for (let i = 0; i < 420; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const size = rng();
    const r = size < 0.7 ? 0.6 : size < 0.92 ? 1.2 : 2.0;
    const alpha = 0.25 + rng() * 0.75;

    // Slight colour tint
    const tint = rng();
    const colour =
      tint < 0.15
        ? `rgba(180,200,255,${alpha})`  // blue-ish
        : tint < 0.25
        ? `rgba(255,220,180,${alpha})`  // orange-ish
        : `rgba(255,255,255,${alpha})`; // white

    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // A handful of sparkle stars
  for (let i = 0; i < 12; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const r = 1.5 + rng() * 1.5;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
    glow.addColorStop(0, 'rgba(255,255,255,0.9)');
    glow.addColorStop(0.3, 'rgba(255,255,255,0.3)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r * 4, 0, Math.PI * 2);
    ctx.fill();
    // bright centre
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ─── Zodiac constellation ─────────────────────────────────────────────────────
function drawConstellation(
  ctx: CanvasRenderingContext2D,
  signKey: string,
  cx: number,
  cy: number,
  size: number,
) {
  const data = CONSTELLATIONS[signKey];
  if (!data) return;

  const toScreen = ([nx, ny]: [number, number]): [number, number] => [
    cx + (nx / 100 - 0.5) * size,
    cy + (ny / 100 - 0.5) * size,
  ];

  // Connection lines — subtle gold
  ctx.strokeStyle = GOLD_DIM;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 4]);
  for (const [a, b] of data.edges) {
    if (!data.stars[a] || !data.stars[b]) continue;
    const [ax, ay] = toScreen(data.stars[a]);
    const [bx, by] = toScreen(data.stars[b]);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // All stars
  for (let i = 0; i < data.stars.length; i++) {
    const [sx, sy] = toScreen(data.stars[i]);
    const isBright = data.brightStars.includes(i);
    const r = isBright ? 5 : 3;

    // Glow
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3.5);
    glow.addColorStop(0, isBright ? 'rgba(232,201,107,0.9)' : 'rgba(201,168,76,0.7)');
    glow.addColorStop(0.4, isBright ? 'rgba(232,201,107,0.4)' : 'rgba(201,168,76,0.3)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sx, sy, r * 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Core star
    ctx.fillStyle = isBright ? GOLD_LIGHT : GOLD;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Constellation label
  ctx.font = `italic 14px "Cormorant Garamond", serif`;
  ctx.fillStyle = 'rgba(232,213,176,0.5)';
  ctx.textAlign = 'center';
  ctx.fillText(data.nameRu, cx, cy + size / 2 + 22);
}

// ─── Gold border ─────────────────────────────────────────────────────────────
function drawBorder(ctx: CanvasRenderingContext2D) {
  const pad = 30;

  // Outer glow
  ctx.shadowColor = GOLD;
  ctx.shadowBlur = 16;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);
  ctx.shadowBlur = 0;

  // Inner fine line
  ctx.strokeStyle = GOLD_DIM;
  ctx.lineWidth = 0.6;
  ctx.strokeRect(pad + 8, pad + 8, W - (pad + 8) * 2, H - (pad + 8) * 2);

  // Corner ornaments
  const corners: [number, number, number, number][] = [
    [pad, pad, 1, 1],
    [W - pad, pad, -1, 1],
    [pad, H - pad, 1, -1],
    [W - pad, H - pad, -1, -1],
  ];
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5;
  for (const [x, y, sx, sy] of corners) {
    ctx.beginPath();
    ctx.moveTo(x + sx * 18, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + sy * 18);
    ctx.stroke();
  }
}

// ─── Horizontal gold divider ──────────────────────────────────────────────────
function drawDivider(ctx: CanvasRenderingContext2D, y: number, xPad = 60) {
  const grad = ctx.createLinearGradient(xPad, y, W - xPad, y);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.3, GOLD);
  grad.addColorStop(0.7, GOLD);
  grad.addColorStop(1, 'transparent');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(xPad, y);
  ctx.lineTo(W - xPad, y);
  ctx.stroke();
}

// ─── Small diamond bullet ─────────────────────────────────────────────────────
function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, size = 4) {
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
  ctx.fill();
}

// ─── Underline helper ─────────────────────────────────────────────────────────
function underline(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  ctx.strokeStyle = GOLD_DIM;
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(x, y + 3);
  ctx.lineTo(x + w, y + 3);
  ctx.stroke();
}

// ─────────────────────────────────────────────────────────────────────────────
//  ЧEKAН ВСЕЛЕННОЙ
// ─────────────────────────────────────────────────────────────────────────────
export function drawUniverseCheck(canvas: HTMLCanvasElement, input: CheckInput) {
  const ctx = canvas.getContext('2d')!;
  canvas.width = W;
  canvas.height = H;

  const seed = input.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + input.forecastYear;

  drawStarField(ctx, seed);

  // Constellation — large, upper-right area
  drawConstellation(ctx, input.sunSignKey, W * 0.72, H * 0.24, 220);

  drawBorder(ctx);

  // ── HEADER ──────────────────────────────────────────────────────────────────
  ctx.textAlign = 'center';

  // Small top label
  ctx.font = '11px "Raleway", sans-serif';
  ctx.fillStyle = CREAM_DIM;
  ctx.fillText('Б А Н К   В С Е Л Е Н Н О Й', W / 2, 72);

  // Title
  ctx.font = 'bold 48px "Cinzel", serif';
  ctx.fillStyle = GOLD;
  ctx.shadowColor = GOLD;
  ctx.shadowBlur = 20;
  ctx.fillText('ЧЕК ВСЕЛЕННОЙ', W / 2, 132);
  ctx.shadowBlur = 0;

  drawDivider(ctx, 152);

  // ── CHECK META ───────────────────────────────────────────────────────────────
  const checkNum = `ЧВ-${String(seed).slice(0, 3)}-${input.forecastYear}`;
  ctx.font = '13px "Raleway", sans-serif';
  ctx.fillStyle = CREAM_DIM;
  ctx.textAlign = 'right';
  ctx.fillText(`№ ${checkNum}`, W - 58, 178);

  const today = new Date();
  const dateStr = today.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
  ctx.textAlign = 'left';
  ctx.fillText(`Дата: ${dateStr}`, 58, 178);

  // ── RECIPIENT ────────────────────────────────────────────────────────────────
  ctx.font = '13px "Raleway", sans-serif';
  ctx.fillStyle = CREAM_DIM;
  ctx.textAlign = 'left';
  ctx.fillText('ВЫПЛАТИТЬ', 58, 218);

  ctx.font = 'bold 34px "Cinzel", serif';
  ctx.fillStyle = CREAM;
  ctx.fillText(input.name.toUpperCase(), 58, 262);
  underline(ctx, 58, 262, W - 116);

  // ── AMOUNT ───────────────────────────────────────────────────────────────────
  drawDivider(ctx, 295, 58);

  ctx.textAlign = 'center';
  ctx.font = '12px "Raleway", sans-serif';
  ctx.fillStyle = CREAM_DIM;
  ctx.fillText('СУММА К ПОЛУЧЕНИЮ', W / 2, 326);

  const amount = '777 777 777';

  ctx.font = 'bold 56px "Cinzel", serif';
  ctx.fillStyle = GOLD;
  ctx.shadowColor = GOLD;
  ctx.shadowBlur = 24;
  ctx.fillText(`${amount} ₽`, W / 2, 396);
  ctx.shadowBlur = 0;

  ctx.font = 'italic 18px "Cormorant Garamond", serif';
  ctx.fillStyle = CREAM_DIM;
  ctx.fillText('полного изобилия и процветания', W / 2, 428);

  drawDivider(ctx, 450, 58);

  // ── AFFIRMATION ──────────────────────────────────────────────────────────────
  const pyData = PERSONAL_YEAR_DATA[input.personalYearNumber];
  const affirmation = pyData
    ? `${input.forecastYear} — ${pyData.theme.toLowerCase()}. ${pyData.advice}`
    : 'Вселенная щедро даёт мне всё необходимое для счастливой и изобильной жизни.';

  ctx.font = 'italic 16px "Cormorant Garamond", serif';
  ctx.fillStyle = CREAM;
  ctx.textAlign = 'center';

  // Word-wrap affirmation
  wrapText(ctx, affirmation, W / 2, 488, W - 130, 26);

  // ── ZODIAC LABEL ─────────────────────────────────────────────────────────────
  const sunData = SUN_SIGN_DATA[input.sunSignKey];
  ctx.font = '13px "Raleway", sans-serif';
  ctx.fillStyle = GOLD_DIM;
  ctx.textAlign = 'center';
  ctx.fillText(
    `${input.sunSignName}  ·  Планета: ${sunData?.planet ?? '—'}  ·  Стихия: ${sunData?.element ?? '—'}`,
    W / 2,
    580,
  );

  drawDivider(ctx, 600, 58);

  // ── SIGNATURE BLOCK ──────────────────────────────────────────────────────────
  // Left: purpose line
  ctx.textAlign = 'left';
  ctx.font = '11px "Raleway", sans-serif';
  ctx.fillStyle = CREAM_DIM;
  ctx.fillText('НАЗНАЧЕНИЕ', 58, 640);

  ctx.font = 'italic 16px "Cormorant Garamond", serif';
  ctx.fillStyle = CREAM;
  ctx.fillText('Полное изобилие во всех сферах жизни', 58, 668);
  underline(ctx, 58, 668, 280);

  // Right: signature
  ctx.textAlign = 'right';
  ctx.font = '11px "Raleway", sans-serif';
  ctx.fillStyle = CREAM_DIM;
  ctx.fillText('ПОДПИСЬ', W - 58, 640);

  ctx.font = 'italic 32px "Cormorant Garamond", serif';
  ctx.fillStyle = GOLD;
  ctx.fillText('Вселенная', W - 58, 674);
  underline(ctx, W - 250, 674, 192);

  drawDivider(ctx, 700, 58);

  // ── STAMP (круглая печать) ───────────────────────────────────────────────────
  drawStamp(ctx, W / 2, 790, 110, input.sunSignName, input.forecastYear);

  // ── BOTTOM TEXT ──────────────────────────────────────────────────────────────
  ctx.font = '11px "Raleway", sans-serif';
  ctx.fillStyle = CREAM_DIM;
  ctx.textAlign = 'center';
  ctx.fillText('Этот чек активирован силой вашего намерения и подтверждён Вселенной', W / 2, H - 62);
  ctx.fillText('Принят к исполнению · Оплачен сполна', W / 2, H - 44);

  // small diamonds
  for (let x = W / 2 - 100; x <= W / 2 + 100; x += 50) {
    drawDiamond(ctx, x, H - 52, 3);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  ЧЕК БЛАГОДАРНОСТИ
// ─────────────────────────────────────────────────────────────────────────────
export function drawGratitudeCheck(canvas: HTMLCanvasElement, input: CheckInput) {
  const ctx = canvas.getContext('2d')!;
  canvas.width = W;
  canvas.height = H;

  const seed = input.name.split('').reduce((a, c) => a + c.charCodeAt(0) * 3, 7) + input.forecastYear;

  drawStarField(ctx, seed + 99999);

  // Constellation — centered, larger
  drawConstellation(ctx, input.sunSignKey, W / 2, H * 0.22, 260);

  drawBorder(ctx);

  // ── HEADER ──────────────────────────────────────────────────────────────────
  ctx.textAlign = 'center';
  ctx.font = '11px "Raleway", sans-serif';
  ctx.fillStyle = CREAM_DIM;
  ctx.fillText('ОТ ВСЕЛЕННОЙ К', W / 2, 72);

  ctx.font = 'bold 44px "Cinzel", serif';
  ctx.fillStyle = GOLD;
  ctx.shadowColor = GOLD;
  ctx.shadowBlur = 18;
  ctx.fillText('ЧЕК БЛАГОДАРНОСТИ', W / 2, 132);
  ctx.shadowBlur = 0;

  drawDivider(ctx, 152);

  // ── FROM ─────────────────────────────────────────────────────────────────────
  const today = new Date();
  ctx.textAlign = 'right';
  ctx.font = '13px "Raleway", sans-serif';
  ctx.fillStyle = CREAM_DIM;
  ctx.fillText(today.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }), W - 58, 178);

  ctx.textAlign = 'left';
  ctx.fillText('ПОЛУЧАТЕЛЬ', 58, 178);

  ctx.font = 'bold 32px "Cinzel", serif';
  ctx.fillStyle = CREAM;
  ctx.fillText(input.name.toUpperCase(), 58, 218);
  underline(ctx, 58, 218, W - 116);

  // ── GRATITUDE BLOCK ──────────────────────────────────────────────────────────
  drawDivider(ctx, 490, 58);

  ctx.font = '12px "Raleway", sans-serif';
  ctx.fillStyle = CREAM_DIM;
  ctx.textAlign = 'center';
  ctx.fillText('Я БЛАГОДАРЮ ВСЕЛЕННУЮ ЗА', W / 2, 520);

  const lpData = LIFE_PATH_DATA[input.lifePathNumber];
  const pyData = PERSONAL_YEAR_DATA[input.personalYearNumber];
  const sunData = SUN_SIGN_DATA[input.sunSignKey];

  const items = [
    `Мой уникальный путь ${lpData?.title?.toLowerCase() ?? ''} и все его уроки`,
    `Силу и мудрость знака ${input.sunSignName} (${sunData?.element ?? ''})`,
    `${input.forecastYear} год — год ${pyData?.theme?.toLowerCase() ?? 'роста и развития'}`,
    'Изобилие, которое уже есть в моей жизни',
    'Все встречи, испытания и возможности на пути',
  ];

  ctx.textAlign = 'left';
  let gy = 558;
  for (const item of items) {
    drawDiamond(ctx, 70, gy - 3, 3.5);
    ctx.font = 'italic 17px "Cormorant Garamond", serif';
    ctx.fillStyle = CREAM;
    ctx.fillText(item, 86, gy);
    gy += 36;
  }

  drawDivider(ctx, gy + 14, 58);

  // ── SIGNATURE ────────────────────────────────────────────────────────────────
  ctx.textAlign = 'center';
  ctx.font = '13px "Raleway", sans-serif';
  ctx.fillStyle = CREAM_DIM;
  ctx.fillText('С БЕСКОНЕЧНОЙ ЛЮБОВЬЮ И ПРИЗНАТЕЛЬНОСТЬЮ', W / 2, gy + 50);

  ctx.font = 'italic 36px "Cormorant Garamond", serif';
  ctx.fillStyle = GOLD;
  ctx.shadowColor = GOLD;
  ctx.shadowBlur = 14;
  ctx.fillText(input.name, W / 2, gy + 96);
  ctx.shadowBlur = 0;
  underline(ctx, W / 2 - 120, gy + 96, 240);

  // ── STAMP ────────────────────────────────────────────────────────────────────
  drawStamp(ctx, W / 2, gy + 176, 95, '✦ ПРИНЯТО ✦', input.forecastYear);

  // ── BOTTOM ───────────────────────────────────────────────────────────────────
  ctx.font = '11px "Raleway", sans-serif';
  ctx.fillStyle = CREAM_DIM;
  ctx.textAlign = 'center';
  ctx.fillText('Благодарность — самый мощный магнит изобилия', W / 2, H - 62);
  ctx.fillText(`${input.sunSignName}  ·  ${input.forecastYear}  ·  ✦`, W / 2, H - 44);
}

// ─── Circular stamp ───────────────────────────────────────────────────────────
function drawStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  label: string,
  year: number,
) {
  ctx.strokeStyle = GOLD_DIM;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(201,168,76,0.2)';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = `bold 14px "Cinzel", serif`;
  ctx.fillStyle = GOLD_DIM;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, cy - 10);
  ctx.font = `12px "Raleway", sans-serif`;
  ctx.fillText(String(year), cx, cy + 10);
  ctx.textBaseline = 'alphabetic';
}

// ─── Text word-wrap ───────────────────────────────────────────────────────────
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = word;
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, curY);
}

// ─── PDF generation (canvas → jsPDF) ─────────────────────────────────────────
export async function downloadCheck(
  type: 'universe' | 'gratitude',
  input: CheckInput,
) {
  const canvas = document.createElement('canvas');

  if (type === 'universe') {
    drawUniverseCheck(canvas, input);
  } else {
    drawGratitudeCheck(canvas, input);
  }

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  // Dynamic import to keep jspdf out of SSR bundle
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

  const filename =
    type === 'universe'
      ? `чек-вселенной-${input.name}-${input.forecastYear}.pdf`
      : `чек-благодарности-${input.name}-${input.forecastYear}.pdf`;

  pdf.save(filename);
}
