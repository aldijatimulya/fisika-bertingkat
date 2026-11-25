"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LEVELS, nodes, nodeById, prereqChain } from "@/lib/data";
import { MasteryButton } from "@/components/MasteryButton";
import { Level } from "@/components/Level";
import { setManyMastery, useMasteryStore } from "@/lib/mastery";

export function PathClient() {
  const [target, setTarget] = useState("e.kekekalan");
  const store = useMasteryStore();

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("target");
    if (t && nodeById.has(t)) setTarget(t);
  }, []);

  const path = useMemo(() => [...prereqChain(target), nodeById.get(target)!], [target]);
  const done = path.filter((n) => store[n.id] === "kuasai").length;
  const nextIdx = path.findIndex((n) => store[n.id] !== "kuasai");
  const pct = Math.round((done / path.length) * 100);

  return (
    <div className="wrap narrow" style={{ paddingBottom: 80 }}>
      <div className="page-head">
        <h1>Jalur belajar</h1>
        <p className="muted" style={{ marginTop: 16 }}>
          Pilih konsep yang ingin Anda pahami. Platform menyusun semua prasyaratnya dari yang paling dasar. Tandai yang sudah Anda kuasai; langkah berikutnya diperbarui otomatis.
        </p>
      </div>

      <div className="field ui">
        <label htmlFor="target">Saya ingin memahami</label>
        <select id="target" className="select" value={target} onChange={(e) => setTarget(e.target.value)}>
          {[1, 2, 3, 4, 5].map((l) => (
            <optgroup key={l} label={`L${l} · ${LEVELS[l].name}`}>
              {nodes.filter((n) => n.level === l).map((n) => <option key={n.id} value={n.id}>{n.title}</option>)}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="ui" style={{ margin: "28px 0 8px" }}>
        <div><strong>{done}</strong> dari <strong>{path.length}</strong> konsep sudah dipahami</div>
        <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Kemajuan jalur"><i style={{ width: `${pct}%` }} /></div>
        <div className="actions" style={{ marginTop: 12 }}>
          <label className="small muted" htmlFor="upto" style={{ alignSelf: "center" }}>Cara cepat: saya sudah paham semua sampai</label>
          <select id="upto" className="select" defaultValue="" onChange={(e) => {
            const v = e.target.value; if (v === "") return;
            setManyMastery(path.filter((n) => n.level <= Number(v) && n.id !== target).map((n) => n.id), "kuasai");
            e.target.value = "";
          }}>
            <option value="">pilih tingkat…</option>
            {[0, 1, 2, 3, 4].map((l) => <option key={l} value={l}>L{l} · {LEVELS[l].short}</option>)}
          </select>
          <button className="btn ghost sm" onClick={() => setManyMastery(path.map((n) => n.id), "belum")}>Kosongkan jalur ini</button>
        </div>
      </div>

      <ol className="pathlist" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {path.map((n, i) => (
          <li key={n.id} data-done={store[n.id] === "kuasai"} data-next={i === nextIdx}>
            <span className="ix">{i + 1}</span>
            <div>
              <Link href={`/konsep/${n.id}/`} className="t">{n.title}</Link>
              {i === nextIdx && <span className="next-tag">Mulai dari sini</span>}
              <div><Level level={n.level} /></div>
            </div>
            <MasteryButton id={n.id} compact />
          </li>
        ))}
      </ol>
      <p className="muted small ui" style={{ marginTop: 24 }}>
        Status tersimpan di peramban ini. Sinkronisasi antarperangkat akan ditambahkan bersama akun pengguna.
      </p>
    </div>
  );
}
