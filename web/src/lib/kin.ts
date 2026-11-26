// Kinematika 1D dengan percepatan konstan. Fungsi murni, tanpa React, agar bisa diuji.
export type Motion = { x0: number; v0: number; a: number };

export const pos = (m: Motion, t: number) => m.x0 + m.v0 * t + 0.5 * m.a * t * t;
export const vel = (m: Motion, t: number) => m.v0 + m.a * t;
export const acc = (m: Motion) => m.a;

/** Saat kecepatan menjadi nol (benda berbalik arah) bila a melawan v0; selain itu null. */
export function turnTime(m: Motion): number | null {
  if (m.a === 0 || m.v0 === 0) return null;
  return m.v0 * m.a < 0 ? -m.v0 / m.a : null;
}

export type Trend = "diam" | "tetap" | "bertambah" | "berkurang" | "berhenti-sesaat";
const EPS = 1e-9;

/** Bagaimana laju berubah pada saat t: ditentukan oleh hubungan arah v dan a. */
export function speedTrend(m: Motion, t: number): Trend {
  const v = vel(m, t);
  if (Math.abs(m.a) < EPS) return Math.abs(v) < EPS ? "diam" : "tetap";
  if (Math.abs(v) < 1e-6) return "berhenti-sesaat";
  return v * m.a > 0 ? "bertambah" : "berkurang";
}

export const TREND_TEXT: Record<Trend, string> = {
  diam: "Benda diam dan percepatannya nol.",
  tetap: "Percepatan nol: kecepatan tidak berubah, benda tetap bergerak dengan kecepatan yang sama.",
  bertambah: "Kecepatan dan percepatan searah: laju bertambah.",
  berkurang: "Kecepatan dan percepatan berlawanan arah: laju berkurang.",
  "berhenti-sesaat": "Kecepatan tepat nol, tetapi percepatan tidak nol: benda berhenti sesaat lalu berbalik arah.",
};

export function sample(m: Motion, T: number, n = 120) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = (T * i) / n;
    return { t, x: pos(m, t), v: vel(m, t), a: m.a };
  });
}

export const fmt = (n: number, d = 2) => (Math.abs(n) < 5e-10 ? 0 : n).toFixed(d).replace(".", ",").replace(/,?0+$/, (s) => (s.includes(",") ? "" : s));
