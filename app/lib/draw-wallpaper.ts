const W = 1080;
const H = 1920;

interface MonthData {
  name: string;
  affirmation: string;
  mantra: string;
  icon: string;
  bg: [string, string, string];   // gradient stops
  accent: string;
}

const MONTHS: MonthData[] = [
  {
    name: 'Январь',
    affirmation: 'Я создаю свою реальность\nкаждым своим выбором.',
    mantra: 'Я сильна. Я могу. Я двигаюсь вперёд.',
    icon: '☀',
    bg: ['#0a0e2a', '#1a2456', '#0d1a3a'],
    accent: '#c9a84c',
  },
  {
    name: 'Февраль',
    affirmation: 'Я открыта любви\nи принимаю её в свою жизнь.',
    mantra: 'Я люблю и принимаю себя. Я достойна счастья.',
    icon: '☽',
    bg: ['#2a0a1a', '#5c1a2e', '#1a0a18'],
    accent: '#e8a0b4',
  },
  {
    name: 'Март',
    affirmation: 'Я доверяю Вселенной.\nВсё происходит вовремя.',
    mantra: 'Я доверяю Вселенной. Всё происходит вовремя.',
    icon: '✦',
    bg: ['#0a1a2a', '#1a3a4a', '#0d2030'],
    accent: '#7ec8c8',
  },
  {
    name: 'Апрель',
    affirmation: 'Я расту, развиваюсь\nи становлюсь лучшей версией себя.',
    mantra: 'Я верю в себя. Я могу больше, чем думаю.',
    icon: '❋',
    bg: ['#0a1a0a', '#1a3a1a', '#0d2a0d'],
    accent: '#90c878',
  },
  {
    name: 'Май',
    affirmation: 'Я притягиваю изобилие,\nлёгкость и вдохновение.',
    mantra: 'Моя жизнь наполнена изобилием.',
    icon: '☀',
    bg: ['#2a1a0a', '#4a2e0a', '#1a1008'],
    accent: '#e8c96b',
  },
  {
    name: 'Июнь',
    affirmation: 'Я в гармонии\nс собой и миром.',
    mantra: 'Я выбираю мир. Я выбираю себя.',
    icon: '✿',
    bg: ['#0a1a18', '#0a2e2a', '#081a18'],
    accent: '#78c8a0',
  },
  {
    name: 'Июль',
    affirmation: 'Я сияю, привлекаю успех\nи живу в радости.',
    mantra: 'Я сияю. Я притягиваю успех и любовь.',
    icon: '☀',
    bg: ['#2a1400', '#4a2800', '#1e1000'],
    accent: '#f0a050',
  },
  {
    name: 'Август',
    affirmation: 'Я принимаю важные решения\nи создаю жизнь своей мечты.',
    mantra: 'Я создаю свою лучшую реальность.',
    icon: '✧',
    bg: ['#050a1e', '#0a1440', '#04081a'],
    accent: '#a0b8e8',
  },
  {
    name: 'Сентябрь',
    affirmation: 'Я благодарна за всё, что имею,\nи открыта новым возможностям.',
    mantra: 'Благодарность открывает двери к изобилию.',
    icon: '❧',
    bg: ['#1e0e00', '#3a1e00', '#180c00'],
    accent: '#d4844a',
  },
  {
    name: 'Октябрь',
    affirmation: 'Я сильная, мудрая\nи знаю свою ценность.',
    mantra: 'Я достойна лучшего. Я выбираю себя.',
    icon: '☽',
    bg: ['#12041e', '#240840', '#0e0318'],
    accent: '#c878e8',
  },
  {
    name: 'Ноябрь',
    affirmation: 'Я отпускаю сомнения\nи иду к своим целям.',
    mantra: 'Я действую. Я создаю. Я достигаю.',
    icon: '✦',
    bg: ['#06081e', '#0c1040', '#050818'],
    accent: '#8898e0',
  },
  {
    name: 'Декабрь',
    affirmation: 'Я завершаю год с любовью\nи благодарностью.',
    mantra: 'Я благодарю. Я принимаю. Я готова к чудесам.',
    icon: '❄',
    bg: ['#0e0808', '#2a1810', '#0a0806'],
    accent: '#e8c090',
  },
];

function drawBackground(ctx: CanvasRenderingContext2D, month: MonthData) {
  const [c1, c2, c3] = month.bg;
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, c1);
  grad.addColorStop(0.5, c2);
  grad.addColorStop(1, c3);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Radial glow in center
  const glow = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, W * 0.7);
  glow.addColorStop(0, `${month.accent}18`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Stars
  const rng = seededRand(month.name.charCodeAt(0));
  for (let i = 0; i < 260; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const r = rng() < 0.8 ? 0.8 : rng() < 0.95 ? 1.6 : 2.6;
    const a = 0.2 + rng() * 0.7;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function seededRand(seed: number) {
  let s = seed * 7919 + 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function wrapLines(text: string): string[] {
  return text.split('\n');
}

function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  y: number,
  font: string,
  color: string,
  lineHeight: number,
  shadow?: string,
) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  if (shadow) {
    ctx.shadowColor = shadow;
    ctx.shadowBlur = 24;
  }
  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, y + i * lineHeight);
  });
  ctx.shadowBlur = 0;
}

function drawDivider(ctx: CanvasRenderingContext2D, y: number, accent: string) {
  const pad = 140;
  const grad = ctx.createLinearGradient(pad, y, W - pad, y);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.3, accent);
  grad.addColorStop(0.7, accent);
  grad.addColorStop(1, 'transparent');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(W - pad, y);
  ctx.stroke();
}

export function drawWallpaper(canvas: HTMLCanvasElement, monthIndex: number) {
  const ctx = canvas.getContext('2d')!;
  canvas.width = W;
  canvas.height = H;

  const month = MONTHS[monthIndex];
  if (!month) return;

  drawBackground(ctx, month);

  const accent = month.accent;
  const cream = '#f0e8d0';
  const creamDim = 'rgba(240,232,208,0.6)';

  // ── TOP ICON ────────────────────────────────────────────────────────────────
  ctx.font = '90px serif';
  ctx.fillStyle = accent;
  ctx.textAlign = 'center';
  ctx.shadowColor = accent;
  ctx.shadowBlur = 40;
  ctx.fillText(month.icon, W / 2, 220);
  ctx.shadowBlur = 0;

  // ── MONTH NAME ───────────────────────────────────────────────────────────────
  ctx.font = 'bold 120px "Cinzel", "Times New Roman", serif';
  ctx.fillStyle = accent;
  ctx.textAlign = 'center';
  ctx.shadowColor = accent;
  ctx.shadowBlur = 30;
  ctx.fillText(month.name, W / 2, 380);
  ctx.shadowBlur = 0;

  // Divider under month name
  drawDivider(ctx, 420, accent);

  // ── AFFIRMATION ──────────────────────────────────────────────────────────────
  const affLines = wrapLines(month.affirmation);
  const affY = H * 0.38;

  drawCenteredText(
    ctx,
    affLines,
    affY,
    '62px "Georgia", "Cormorant Garamond", serif',
    cream,
    88,
    accent,
  );

  // ── DIVIDER ──────────────────────────────────────────────────────────────────
  const divY = affY + affLines.length * 88 + 60;
  drawDivider(ctx, divY, accent);

  // ── MANTRA LABEL ─────────────────────────────────────────────────────────────
  ctx.font = '36px "Arial", sans-serif';
  ctx.fillStyle = accent;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '8px';
  ctx.fillText('М А Н Т Р А', W / 2, divY + 70);
  ctx.letterSpacing = '0px';

  // ── MANTRA TEXT ──────────────────────────────────────────────────────────────
  ctx.font = 'italic 44px "Georgia", serif';
  ctx.fillStyle = creamDim;
  ctx.textAlign = 'center';

  // wrap mantra by words
  const mantraWords = month.mantra.split(' ');
  let line = '';
  let mantraY = divY + 130;
  for (const word of mantraWords) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > W - 200 && line) {
      ctx.fillText(line, W / 2, mantraY);
      line = word;
      mantraY += 60;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, W / 2, mantraY);

  // Bottom divider
  drawDivider(ctx, H - 120, accent);

  // Bottom dots
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.arc(W / 2 + i * 30, H - 80, i === 0 ? 5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? accent : `${accent}80`;
    ctx.fill();
  }
}

export async function downloadWallpaper(monthIndex: number) {
  const month = MONTHS[monthIndex];
  if (!month) return;

  const canvas = document.createElement('canvas');
  drawWallpaper(canvas, monthIndex);

  const link = document.createElement('a');
  link.download = `заставка-${month.name.toLowerCase()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export { MONTHS };
