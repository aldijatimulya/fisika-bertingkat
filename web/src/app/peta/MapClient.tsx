"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Core, NodeSingular } from "cytoscape";
import { edges, nodes, nodeById, areaName, directPrereqs, prereqChain, LEVELS, ConceptNode } from "@/lib/data";
import { MasteryButton } from "@/components/MasteryButton";
import { Level } from "@/components/Level";

const COL_W = 196, ROW_H = 30, MAX_ROWS = 26, LEVEL_GAP = 70;

function layout() {
  const pos = new Map<string, { x: number; y: number }>();
  let x = 0;
  for (let l = 0; l <= 5; l++) {
    const list = nodes.filter((n) => n.level === l).sort((a, b) => a.area.localeCompare(b.area) || a.depth - b.depth);
    const cols = Math.ceil(list.length / MAX_ROWS);
    const per = Math.ceil(list.length / cols);
    list.forEach((n, i) => pos.set(n.id, { x: x + Math.floor(i / per) * COL_W, y: (i % per) * ROW_H }));
    x += cols * COL_W + LEVEL_GAP;
  }
  return pos;
}

const forward = new Map<string, string[]>();
for (const e of edges) if (e.type === "prerequisite") (forward.get(e.source) ?? forward.set(e.source, []).get(e.source)!).push(e.target);
function descendants(id: string) {
  const seen = new Set<string>(); const st = [...(forward.get(id) ?? [])];
  while (st.length) { const x = st.pop()!; if (seen.has(x)) continue; seen.add(x); st.push(...(forward.get(x) ?? [])); }
  return seen;
}

export function MapClient() {
  const box = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [level, setLevel] = useState<string>("all");
  const [q, setQ] = useState("");

  const selected: ConceptNode | undefined = sel ? nodeById.get(sel) : undefined;
  const info = useMemo(() => sel ? { anc: prereqChain(sel).length, desc: descendants(sel).size, direct: directPrereqs(sel) } : null, [sel]);

  // Inisialisasi sekali
  useEffect(() => {
    let destroyed = false;
    (async () => {
      const cytoscape = (await import("cytoscape")).default;
      if (destroyed || !box.current) return;
      const css = getComputedStyle(document.documentElement);
      const v = (n: string) => css.getPropertyValue(n).trim();
      const pos = layout();
      const cy = cytoscape({
        container: box.current,
        elements: [
          ...nodes.map((n) => ({ data: { id: n.id, label: n.title, level: n.level, color: v(`--lv${n.level}`) }, position: pos.get(n.id)! })),
          ...edges.map((e, i) => ({ data: { id: `e${i}`, source: e.source, target: e.target, type: e.type } })),
        ],
        layout: { name: "preset" },
        minZoom: 0.08, maxZoom: 2.5, wheelSensitivity: 0.25,
        style: [
          { selector: "node", style: {
            shape: "round-rectangle", width: 176, height: 22, label: "data(label)",
            "text-valign": "center", "text-halign": "center", "font-size": 10.5, "font-family": v("--sans") || "sans-serif",
            color: v("--ink"), "background-color": v("--surface"), "border-width": 2, "border-color": "data(color)",
            "text-wrap": "ellipsis", "text-max-width": "164px",
          } },
          { selector: "edge", style: { width: 1, "line-color": v("--ink-3"), opacity: 0.07, "curve-style": "bezier", "target-arrow-shape": "none" } },
          { selector: "edge[type != 'prerequisite']", style: { "line-style": "dashed" } },
          { selector: ".faded", style: { opacity: 0.18 } },
          { selector: "edge.faded", style: { opacity: 0.02 } },
          { selector: "node.anc", style: { "background-color": v("--lv1"), color: "#fff", "border-color": v("--lv1") } },
          { selector: "node.desc", style: { "background-color": v("--lv3"), color: "#fff", "border-color": v("--lv3") } },
          { selector: "node.sel", style: { "border-width": 4, "border-color": v("--ink"), "background-color": v("--ink"), color: v("--paper") } },
          { selector: "edge.anc", style: { "line-color": v("--lv1"), opacity: 0.85, width: 2, "target-arrow-shape": "triangle", "target-arrow-color": v("--lv1"), "arrow-scale": 0.8 } },
          { selector: "edge.desc", style: { "line-color": v("--lv3"), opacity: 0.85, width: 2, "target-arrow-shape": "triangle", "target-arrow-color": v("--lv3"), "arrow-scale": 0.8 } },
          { selector: "node.match", style: { "border-width": 4 } },
        ],
      });
      cy.on("tap", "node", (ev) => setSel((ev.target as NodeSingular).id()));
      cy.on("tap", (ev) => { if (ev.target === cy) setSel(null); });
      cyRef.current = cy;
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id"); const lv = params.get("level");
      if (lv && /^[0-5]$/.test(lv)) setLevel(lv);
      if (id && nodeById.has(id)) { setSel(id); } else cy.fit(undefined, 30);
    })();
    return () => { destroyed = true; cyRef.current?.destroy(); cyRef.current = null; };
  }, []);

  // Sorotan pilihan
  useEffect(() => {
    const cy = cyRef.current; if (!cy) return;
    cy.batch(() => {
      cy.elements().removeClass("faded anc desc sel");
      if (!sel) return;
      const anc = new Set(prereqChain(sel).map((n) => n.id));
      const desc = descendants(sel);
      const keep = new Set([sel, ...anc, ...desc]);
      cy.nodes().forEach((n) => {
        const id = n.id();
        if (id === sel) n.addClass("sel"); else if (anc.has(id)) n.addClass("anc"); else if (desc.has(id)) n.addClass("desc"); else n.addClass("faded");
      });
      cy.edges().forEach((e) => {
        const s = e.source().id(), t = e.target().id();
        if (e.data("type") !== "prerequisite") { e.addClass("faded"); return; }
        if ((anc.has(s) || s === sel) && (anc.has(t) || t === sel)) e.addClass("anc");
        else if ((desc.has(t) || t === sel) && (desc.has(s) || s === sel)) e.addClass("desc");
        else e.addClass("faded");
      });
      void keep;
    });
    const n = cy.getElementById(sel!);
    if (n.nonempty()) cy.animate({ center: { eles: n }, zoom: Math.max(cy.zoom(), 0.9) }, { duration: 250 });
  }, [sel]);

  // Filter level dan pencarian (hanya saat tidak ada pilihan)
  useEffect(() => {
    const cy = cyRef.current; if (!cy || sel) return;
    const term = q.trim().toLowerCase();
    cy.batch(() => {
      cy.nodes().removeClass("faded match");
      cy.edges().removeClass("faded");
      cy.nodes().forEach((n) => {
        const okLevel = level === "all" || String(n.data("level")) === level;
        const okText = !term || String(n.data("label")).toLowerCase().includes(term) || n.id().includes(term);
        if (!okLevel || !okText) n.addClass("faded"); else if (term) n.addClass("match");
      });
    });
  }, [level, q, sel]);

  function jump() {
    const cy = cyRef.current; if (!cy) return;
    const m = cy.nodes(".match");
    if (m.length) cy.animate({ fit: { eles: m, padding: 80 } }, { duration: 250 });
    else if (level !== "all") cy.animate({ fit: { eles: cy.nodes().filter((n) => String(n.data("level")) === level), padding: 40 } }, { duration: 250 });
  }
  useEffect(() => { if (!sel) jump(); /* eslint-disable-next-line */ }, [level]);

  return (
    <div className="map-shell">
      <div className="map-canvas">
        <div className="map-tools ui">
          <label className="sr" htmlFor="q">Cari konsep</label>
          <input id="q" className="input" placeholder="Cari konsep, mis. percepatan" value={q}
            onChange={(e) => { setQ(e.target.value); setSel(null); }} onKeyDown={(e) => e.key === "Enter" && jump()} />
          <label className="sr" htmlFor="lv">Tingkat</label>
          <select id="lv" className="select" value={level} onChange={(e) => { setLevel(e.target.value); setSel(null); }}>
            <option value="all">Semua tingkat</option>
            {[0, 1, 2, 3, 4, 5].map((l) => <option key={l} value={l}>L{l} · {LEVELS[l].short}</option>)}
          </select>
          <button className="btn ghost sm" style={{ background: "var(--surface)" }} onClick={() => { setSel(null); setQ(""); setLevel("all"); cyRef.current?.fit(undefined, 30); }}>Reset tampilan</button>
        </div>
        <div ref={box} className="cy" role="img" aria-label="Peta konsep fisika. Pilih sebuah konsep untuk melihat prasyarat dan penerusnya." />
        <div className="legend">
          <div className="row2"><span className="sw" style={{ ["--c" as string]: "var(--lv1)" }} />Prasyarat (harus dipahami dulu)</div>
          <div className="row2"><span className="sw" style={{ ["--c" as string]: "var(--lv3)" }} />Dipakai oleh (konsep penerus)</div>
        </div>
      </div>
      <aside className="map-panel" aria-live="polite">
        {selected && info ? (
          <>
            <Level level={selected.level} full />
            <h2>{selected.title}</h2>
            <p className="muted small">{areaName(selected.area)}</p>
            <p className="small">
              Butuh <strong>{info.anc}</strong> konsep prasyarat (langsung dan tidak langsung). Menjadi dasar bagi <strong>{info.desc}</strong> konsep lain.
            </p>
            <div className="actions" style={{ marginBottom: 20 }}>
              <Link className="btn sm" href={`/konsep/${selected.id}/`}>Buka halaman konsep</Link>
              <Link className="btn ghost sm" href={`/jalur/?target=${selected.id}`}>Susun jalur ke sini</Link>
            </div>
            <MasteryButton id={selected.id} />
            <div className="group-title" style={{ marginTop: 24 }}>Prasyarat langsung</div>
            {info.direct.length ? (
              <ul>{info.direct.map((p) => <li key={p.id}><button className="btn ghost sm" style={{ border: 0, padding: "4px 0", fontWeight: 400, textAlign: "left" }} onClick={() => setSel(p.id)}>{p.title}</button></li>)}</ul>
            ) : <p className="muted small">Konsep dasar tanpa prasyarat.</p>}
          </>
        ) : (
          <div className="empty">
            <h2>Pilih sebuah konsep</h2>
            <p>Klik kotak mana saja. Rantai prasyaratnya menyala biru ke arah dasar, dan konsep yang memakainya menyala oker ke arah atas.</p>
            <p className="small">Kolom dari kiri ke kanan mengikuti tingkat L0 sampai L5. Garis putus-putus adalah relasi non-prasyarat (diturunkan, kasus khusus, dst.).</p>
          </div>
        )}
      </aside>
    </div>
  );
}
