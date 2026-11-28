"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Scenario } from "@/content/percepatan";
import { fmt, pos, sample, speedTrend, turnTime, TREND_TEXT, vel, type Motion } from "@/lib/kin";
import { Tex } from "./Tex";

const W = 300, H = 170, PADL = 44, PADR = 12, PADT = 14, PADB = 28;

function niceRange(lo: number, hi: number) {
  if (hi - lo < 1e-9) { hi = lo + 1; lo = lo - 1; }
  const pad = (hi - lo) * 0.08;
  return [lo - pad, hi + pad] as const;
}

function Plot({ title, unit, color, T, tNow, ys, ticks, mark, markLabel }: {
  title: string; unit: string; color: string; T: number; tNow: number; ys: number[]; ticks: number[];
  mark?: { t: number; y: number } | null; markLabel?: string;
}) {
  const [lo, hi] = niceRange(Math.min(0, ...ys), Math.max(0, ...ys));
  const sx = (t: number) => PADL + (t / T) * (W - PADL - PADR);
  const sy = (y: number) => PADT + (1 - (y - lo) / (hi - lo)) * (H - PADT - PADB);
  const n = ys.length - 1;
  const d = ys.map((y, i) => `${i ? "L" : "M"}${sx((T * i) / n).toFixed(1)},${sy(y).toFixed(1)}`).join("");
  const iNow = Math.min(n, Math.max(0, Math.round((tNow / T) * n)));
  const yNow = ys[iNow];
  return (
    <figure className="plot">
      <figcaption>{title} <span className="muted">({unit})</span></figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Grafik ${title} terhadap waktu`}>
        {ticks.map((y) => (
          <g key={y}>
            <line x1={PADL} x2={W - PADR} y1={sy(y)} y2={sy(y)} stroke="var(--rule)" strokeWidth={y === 0 ? 1.5 : 1} />
            <text x={PADL - 6} y={sy(y) + 4} textAnchor="end" fontSize="10" fill="var(--ink-2)">{fmt(y, Math.abs(y) < 10 && y % 1 ? 1 : 0)}</text>
          </g>
        ))}
        <line x1={PADL} x2={PADL} y1={PADT} y2={H - PADB} stroke="var(--ink-3)" />
        {[0, 0.5, 1].map((f) => (
          <text key={f} x={sx(T * f)} y={H - 10} textAnchor="middle" fontSize="10" fill="var(--ink-2)">{fmt(T * f, T * f % 1 ? 1 : 0)} s</text>
        ))}
        <path d={d} fill="none" stroke={color} strokeWidth={2.4} />
        {mark && <>
          <circle cx={sx(mark.t)} cy={sy(mark.y)} r={4} fill="var(--surface)" stroke="var(--ink)" strokeWidth={1.8} />
          {markLabel && <text x={sx(mark.t) + 7} y={sy(mark.y) - 7} fontSize="10" fill="var(--ink)">{markLabel}</text>}
        </>}
        <line x1={sx(tNow)} x2={sx(tNow)} y1={PADT} y2={H - PADB} stroke="var(--ink)" strokeWidth={1} strokeDasharray="3 3" />
        <circle cx={sx(tNow)} cy={sy(yNow)} r={5} fill={color} stroke="var(--surface)" strokeWidth={2} />
      </svg>
    </figure>
  );
}

function Track({ m, T, tNow }: { m: Motion; T: number; tNow: number }) {
  const pts = useMemo(() => sample(m, T, 80).map((p) => p.x), [m, T]);
  const [lo, hi] = niceRange(Math.min(0, ...pts), Math.max(0, ...pts));
  const TW = 640, TH = 90, L = 30, R = 30;
  const sx = (x: number) => L + ((x - lo) / (hi - lo)) * (TW - L - R);
  const x = pos(m, tNow), v = vel(m, tNow);
  const arrow = (len: number, y: number, color: string, label: string) => {
    const L2 = Math.max(-150, Math.min(150, len));
    if (Math.abs(L2) < 1) return null;
    const x1 = sx(x), x2 = x1 + L2, dir = Math.sign(L2);
    return (
      <g>
        <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={4} />
        <path d={`M${x2},${y} l${-9 * dir},-6 l0,12 z`} fill={color} />
        <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" fontSize="11" fill={color} fontFamily="var(--sans)">{label}</text>
      </g>
    );
  };
  const ticks = Array.from({ length: 5 }, (_, i) => lo + ((hi - lo) * i) / 4);
  return (
    <svg viewBox={`0 0 ${TW} ${TH}`} className="track" role="img" aria-label={`Benda pada posisi ${fmt(x)} meter, kecepatan ${fmt(v)} meter per sekon`}>
      <line x1={L} x2={TW - R} y1={62} y2={62} stroke="var(--ink-3)" strokeWidth={2} />
      {ticks.map((t, i) => (
        <g key={i}><line x1={sx(t)} x2={sx(t)} y1={58} y2={66} stroke="var(--ink-3)" /><text x={sx(t)} y={82} textAnchor="middle" fontSize="10" fill="var(--ink-2)">{fmt(t, 0)} m</text></g>
      ))}
      <rect x={sx(x) - 13} y={44} width={26} height={18} rx={4} fill="var(--ink)" />
      {arrow(v * 6, 24, "var(--lv1)", "v")}
      {arrow(m.a * 14, 38, "var(--lv3)", "a")}
    </svg>
  );
}

export function Simulation({ scenarios, free: FREE }: { scenarios: Scenario[]; free: Scenario }) {
  const ALL: Scenario[] = [...scenarios, FREE];
  const [sid, setSid] = useState(ALL[0].id);
  const sc = ALL.find((s) => s.id === sid)!;
  const [free, setFree] = useState<Motion>(FREE.motion);
  const m: Motion = sid === "bebas" ? free : sc.motion;
  const T = sc.T;
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pick, setPick] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);
  const raf = useRef<number | null>(null);
  const last = useRef(0);

  const hasAsk = sc.choices.length > 0;
  const tTurn = turnTime(m);
  const data = useMemo(() => sample(m, T, 120), [m, T]);

  function select(id: string) {
    setSid(id); setT(0); setPlaying(false); setPick(null); setLocked(false); setDone(false);
  }

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const step = (now: number) => {
      const dt = (now - last.current) / 1000; last.current = now;
      setT((cur) => {
        const next = cur + dt;
        if (next >= T) { setPlaying(false); setDone(true); return T; }
        return next;
      });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing, T]);

  const canPlay = !hasAsk || locked;
  const x = pos(m, t), v = vel(m, t);
  const trend = speedTrend(m, t);
  const correct = pick === sc.answer;
  const posTicks = (arr: number[]) => {
    const lo = Math.min(0, ...arr), hi = Math.max(0, ...arr);
    const step = [1, 2, 5, 10, 20, 50, 100].find((s) => (hi - lo) / s <= 4) ?? 100;
    const out: number[] = []; for (let y = Math.ceil(lo / step) * step; y <= hi + 1e-9; y += step) out.push(y);
    const span = hi - lo || 1;
    for (const e of [lo, hi]) if (out.every((y) => Math.abs(y - e) > 0.12 * span)) out.push(Math.round(e * 10) / 10);
    return out;
  };
  const xs = data.map((d) => d.x), vs = data.map((d) => d.v), as = data.map((d) => d.a);

  return (
    <div className="sim">
      <div className="tabs" role="group" aria-label="Skenario">
        {ALL.map((s) => (
          <button key={s.id} aria-pressed={sid === s.id} type="button" onClick={() => select(s.id)}>{s.label}</button>
        ))}
      </div>

      {hasAsk && (
        <fieldset className="pred" disabled={locked}>
          <legend>Prediksi dulu</legend>
          <p>{sc.ask}</p>
          <div className="choices">
            {sc.choices.map((c, i) => (
              <label key={i} className="choice">
                <input type="radio" name={`pred-${sid}`} checked={pick === i} onChange={() => setPick(i)} /> {c}
              </label>
            ))}
          </div>
          {!locked && <button type="button" className="btn sm" disabled={pick === null} onClick={() => setLocked(true)}>Kunci prediksi</button>}
        </fieldset>
      )}

      <Track m={m} T={T} tNow={t} />

      <div className="controls ui">
        <button type="button" className="btn sm" disabled={!canPlay}
          onClick={() => { if (t >= T) setT(0); setDone(false); setPlaying((p) => !p); }}>
          {playing ? "Jeda" : t >= T ? "Ulangi" : "Jalankan"}
        </button>
        <button type="button" className="btn ghost sm" onClick={() => { setPlaying(false); setT(0); setDone(false); }}>Kembali ke awal</button>
        <label className="grow">
          <span className="sr">Waktu</span>
          <input type="range" min={0} max={T} step={0.01} value={t} disabled={!canPlay}
            onChange={(e) => { setPlaying(false); setT(Number(e.target.value)); setDone(Number(e.target.value) >= T); }} aria-label="Waktu t dalam sekon" />
        </label>
        <output className="tval">t = {fmt(t)} s</output>
      </div>
      {!canPlay && <p className="small muted ui">Kunci prediksi Anda dulu, lalu jalankan simulasi.</p>}

      {sid === "bebas" && (
        <div className="sliders ui">
          <label>Kecepatan awal v₀ = <strong>{fmt(free.v0, 1)}</strong> m/s
            <input type="range" min={-20} max={20} step={0.5} value={free.v0} onChange={(e) => { setFree({ ...free, v0: Number(e.target.value) }); setT(0); setPlaying(false); }} />
          </label>
          <label>Percepatan a = <strong>{fmt(free.a, 1)}</strong> m/s²
            <input type="range" min={-10} max={10} step={0.1} value={free.a} onChange={(e) => { setFree({ ...free, a: Number(e.target.value) }); setT(0); setPlaying(false); }} />
          </label>
        </div>
      )}
      {sid !== "bebas" && <p className="small muted ui">Parameter skenario ini terkunci: v₀ = {fmt(m.v0, 1)} m/s, a = {fmt(m.a, 1)} m/s². Pilih <em>Atur sendiri</em> untuk mengubahnya.</p>}

      <div className="plots">
        <Plot title="Posisi x" unit="m" color="var(--ink)" T={T} tNow={t} ys={xs} ticks={posTicks(xs)} mark={tTurn !== null && tTurn <= T ? { t: tTurn, y: pos(m, tTurn) } : null} markLabel="berbalik" />
        <Plot title="Kecepatan v" unit="m/s" color="var(--lv1)" T={T} tNow={t} ys={vs} ticks={posTicks(vs)} mark={tTurn !== null && tTurn <= T ? { t: tTurn, y: 0 } : null} markLabel="v = 0" />
        <Plot title="Percepatan a" unit="m/s²" color="var(--lv3)" T={T} tNow={t} ys={as} ticks={posTicks(as)} />
      </div>

      <div className="readout ui" aria-live="polite">
        <div className="vals">
          <span>x = <strong>{fmt(x)}</strong> m</span>
          <span style={{ color: "var(--lv1)" }}>v = <strong>{fmt(v)}</strong> m/s</span>
          <span style={{ color: "var(--lv3)" }}>a = <strong>{fmt(m.a)}</strong> m/s²</span>
        </div>
        <p className="status" data-trend={trend}>{TREND_TEXT[trend]}</p>
        <div className="subs">
          <div><Tex tex={String.raw`v=v_0+at=${fmt(m.v0, 1)}${m.a < 0 ? "-" : "+"}${fmt(Math.abs(m.a), 1)}\cdot${fmt(t)}=${fmt(v)}\ \text{m/s}`} /></div>
          <div><Tex tex={String.raw`x=x_0+v_0t+\tfrac12at^2=${fmt(x)}\ \text{m}`} /></div>
        </div>
      </div>

      {hasAsk && locked && done && (
        <div className="notice" data-t={correct ? "ok" : "error"} role="status">
          <strong>{correct ? "Prediksi Anda tepat." : `Belum tepat. Anda memilih “${sc.choices[pick ?? 0]}”.`}</strong> {sc.reveal}
        </div>
      )}
      <p className="small muted ui">Model: gerak lurus (1D) dengan percepatan konstan; arah ke kanan/atas dipilih positif.</p>
    </div>
  );
}
