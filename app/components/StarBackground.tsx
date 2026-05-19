"use client";

import { useEffect, useRef } from "react";
import { CONSTELLATIONS } from "../lib/constellations";

// Each constellation: center as fraction of W/H, size as fraction of min(W,H)
const LAYOUT: Array<{ key: string; cx: number; cy: number; sf: number }> = [
  { key: "aries",       cx: 0.50, cy: 0.05, sf: 0.13 },
  { key: "taurus",      cx: 0.72, cy: 0.09, sf: 0.14 },
  { key: "gemini",      cx: 0.90, cy: 0.23, sf: 0.12 },
  { key: "cancer",      cx: 0.94, cy: 0.44, sf: 0.11 },
  { key: "leo",         cx: 0.86, cy: 0.64, sf: 0.13 },
  { key: "virgo",       cx: 0.70, cy: 0.83, sf: 0.14 },
  { key: "libra",       cx: 0.50, cy: 0.91, sf: 0.12 },
  { key: "scorpio",     cx: 0.28, cy: 0.84, sf: 0.13 },
  { key: "sagittarius", cx: 0.12, cy: 0.66, sf: 0.13 },
  { key: "capricorn",   cx: 0.04, cy: 0.45, sf: 0.11 },
  { key: "aquarius",    cx: 0.08, cy: 0.24, sf: 0.12 },
  { key: "pisces",      cx: 0.27, cy: 0.08, sf: 0.13 },
];

function seededRng(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function buildStatic(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // ── Background gradient ──────────────────────────────────────────────────────
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.35, Math.max(W, H) * 0.8);
  bg.addColorStop(0,   "#120826");
  bg.addColorStop(0.5, "#0a0618");
  bg.addColorStop(1,   "#06030f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Nebulae ──────────────────────────────────────────────────────────────────
  const nebulae = [
    { x: W * 0.20, y: H * 0.30, r: W * 0.22, col: "rgba(80,40,140,0.13)" },
    { x: W * 0.76, y: H * 0.58, r: W * 0.18, col: "rgba(20,60,130,0.11)" },
    { x: W * 0.48, y: H * 0.78, r: W * 0.16, col: "rgba(110,20,80,0.09)" },
    { x: W * 0.60, y: H * 0.15, r: W * 0.14, col: "rgba(30,80,100,0.10)" },
  ];
  for (const n of nebulae) {
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
    g.addColorStop(0, n.col);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // ── Background stars ─────────────────────────────────────────────────────────
  const rng = seededRng(1337);
  for (let i = 0; i < 550; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const t = rng();
    const r = t < 0.70 ? 0.5 : t < 0.92 ? 1.0 : 1.7;
    const a = 0.20 + rng() * 0.80;
    const hue = rng();
    ctx.fillStyle =
      hue < 0.12 ? `rgba(180,200,255,${a})`
      : hue < 0.22 ? `rgba(255,220,180,${a})`
      : `rgba(255,255,255,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Sparkle stars ────────────────────────────────────────────────────────────
  const srng = seededRng(2048);
  for (let i = 0; i < 18; i++) {
    const x = srng() * W;
    const y = srng() * H;
    const r = 1.2 + srng() * 1.8;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
    g.addColorStop(0,   "rgba(255,255,255,0.95)");
    g.addColorStop(0.25,"rgba(255,255,255,0.35)");
    g.addColorStop(1,   "transparent");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── All 12 constellations ────────────────────────────────────────────────────
  const base = Math.min(W, H);
  for (const { key, cx, cy, sf } of LAYOUT) {
    drawConstellation(ctx, key, cx * W, cy * H, base * sf);
  }
}

function drawConstellation(
  ctx: CanvasRenderingContext2D,
  key: string,
  cx: number,
  cy: number,
  size: number,
) {
  const data = CONSTELLATIONS[key];
  if (!data) return;

  const toXY = ([nx, ny]: [number, number]): [number, number] => [
    cx + (nx / 100 - 0.5) * size,
    cy + (ny / 100 - 0.5) * size,
  ];

  // Connection lines — gold dashed
  ctx.save();
  ctx.strokeStyle = "rgba(201,168,76,0.28)";
  ctx.lineWidth = 0.9;
  ctx.setLineDash([3, 6]);
  for (const [a, b] of data.edges) {
    if (!data.stars[a] || !data.stars[b]) continue;
    const [ax, ay] = toXY(data.stars[a]);
    const [bx, by] = toXY(data.stars[b]);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();

  // Stars
  for (let i = 0; i < data.stars.length; i++) {
    const [sx, sy] = toXY(data.stars[i]);
    const bright = data.brightStars.includes(i);
    const r = bright ? Math.max(2.5, size * 0.034) : Math.max(1.5, size * 0.022);

    // Glow halo
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 4.5);
    glow.addColorStop(0,   bright ? "rgba(232,201,107,0.85)" : "rgba(201,168,76,0.55)");
    glow.addColorStop(0.35, bright ? "rgba(232,201,107,0.30)" : "rgba(201,168,76,0.18)");
    glow.addColorStop(1,   "transparent");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sx, sy, r * 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = bright ? "#e8c96b" : "#c9a84c";
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();

    // Extra cross-sparkle on bright stars
    if (bright) {
      ctx.save();
      ctx.strokeStyle = "rgba(232,201,107,0.4)";
      ctx.lineWidth = 0.7;
      const s = r * 3;
      ctx.beginPath();
      ctx.moveTo(sx - s, sy); ctx.lineTo(sx + s, sy);
      ctx.moveTo(sx, sy - s); ctx.lineTo(sx, sy + s);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Label
  const fontSize = Math.max(9, size * 0.095);
  ctx.font = `italic ${fontSize}px "Cormorant Garamond", serif`;
  ctx.fillStyle = "rgba(232,213,176,0.30)";
  ctx.textAlign = "center";
  ctx.fillText(data.nameRu, cx, cy + size * 0.56);
}

// ── Meteor ───────────────────────────────────────────────────────────────────
interface Meteor {
  x: number; y: number;
  vx: number; vy: number;
  life: number;        // 0→1
  invLife: number;     // 1/duration
  length: number;
  width: number;
  alpha: number;
}

function spawnMeteor(W: number, H: number): Meteor {
  const angle  = (Math.PI / 4) + (Math.random() - 0.5) * 0.45; // ~45° ±13°
  const speed  = 280 + Math.random() * 520;
  const length = 90  + Math.random() * 180;
  const width  = 0.8 + Math.random() * 1.4;
  const dur    = (length + Math.hypot(W, H) * 0.3) / speed; // rough lifetime

  // Spawn on top edge or right edge
  const edge = Math.random();
  let x: number, y: number;
  if (edge < 0.65) {                         // top edge
    x = Math.random() * W * 1.1 - W * 0.05;
    y = -20;
  } else {                                   // right edge
    x = W + 20;
    y = Math.random() * H * 0.55;
  }

  return {
    x, y,
    vx: -Math.cos(angle) * speed,
    vy:  Math.sin(angle) * speed,
    life: 0,
    invLife: 1 / dur,
    length,
    width,
    alpha: 0.65 + Math.random() * 0.35,
  };
}

function drawMeteors(ctx: CanvasRenderingContext2D, meteors: Meteor[]) {
  for (const m of meteors) {
    const a = m.alpha * (1 - m.life * m.life); // ease-out fade
    if (a <= 0.02) continue;

    const angle = Math.atan2(m.vy, m.vx);
    const tx = m.x - Math.cos(angle) * m.length;
    const ty = m.y - Math.sin(angle) * m.length;

    // Trail gradient: bright white tip → gold mid → transparent tail
    const trail = ctx.createLinearGradient(m.x, m.y, tx, ty);
    trail.addColorStop(0,    `rgba(255,255,255,${a})`);
    trail.addColorStop(0.15, `rgba(240,220,140,${a * 0.85})`);
    trail.addColorStop(0.50, `rgba(201,168,76, ${a * 0.45})`);
    trail.addColorStop(1,    "transparent");

    ctx.save();
    ctx.strokeStyle = trail;
    ctx.lineWidth   = m.width;
    ctx.lineCap     = "round";
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    // Bright head glow
    const hGlow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.width * 4);
    hGlow.addColorStop(0, `rgba(255,255,255,${a * 0.9})`);
    hGlow.addColorStop(1, "transparent");
    ctx.fillStyle = hGlow;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.width * 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Reassign to a const so TypeScript keeps the non-null type in closures
    const el: HTMLCanvasElement = canvas;
    const ctx = el.getContext("2d")!;

    // Offscreen canvas for the static scene
    const offscreen = document.createElement("canvas");
    let offCtx = offscreen.getContext("2d")!;

    const meteors: Meteor[] = [];
    let rafId = 0;
    let lastTime = performance.now();
    let nextSpawn = 0;

    function rebuild() {
      const W = window.innerWidth;
      const H = window.innerHeight;
      el.width  = W;
      el.height = H;
      offscreen.width  = W;
      offscreen.height = H;
      offCtx = offscreen.getContext("2d")!;
      buildStatic(offCtx, W, H);
    }

    function animate(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap at 50ms
      lastTime = now;
      const W = el.width;
      const H = el.height;

      // Blit static background
      ctx.drawImage(offscreen, 0, 0);

      // Spawn meteors
      if (now >= nextSpawn) {
        meteors.push(spawnMeteor(W, H));
        // Spawn 2 more micro-meteors occasionally
        if (Math.random() < 0.3) meteors.push(spawnMeteor(W, H));
        nextSpawn = now + 500 + Math.random() * 1000;
      }

      // Update meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x    += m.vx * dt;
        m.y    += m.vy * dt;
        m.life += m.invLife * dt;

        const oob = m.x < -300 || m.x > W + 300 || m.y > H + 100;
        if (m.life >= 1 || oob) { meteors.splice(i, 1); }
      }

      drawMeteors(ctx, meteors);

      rafId = requestAnimationFrame(animate);
    }

    rebuild();
    window.addEventListener("resize", rebuild);
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", rebuild);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
