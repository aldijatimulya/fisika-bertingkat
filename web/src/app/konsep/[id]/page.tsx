import Link from "next/link";
import { notFound } from "next/navigation";
import {
  nodes, nodeById, areaName, directPrereqs, prereqChain, usedBy, equationsOf, EDGE_LABEL, EdgeType, KIND_LABEL, areaByKey,
} from "@/lib/data";
import { Ledger } from "@/components/Ledger";
import { Level } from "@/components/Level";
import { MasteryButton } from "@/components/MasteryButton";
import { Tex } from "@/components/Tex";
import { Linked } from "@/components/Linked";
import { MODULES } from "@/content/modules";

export function generateStaticParams() { return nodes.map((n) => ({ id: n.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: nodeById.get(id)?.title ?? "Konsep" };
}

const ORDER: EdgeType[] = ["prerequisite", "derived_from", "special_case_of", "generalized_by", "approximation_of", "motivated_by"];

export default async function ConceptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = nodeById.get(id);
  if (!n) notFound();
  const direct = directPrereqs(id);
  const math = direct.filter((x) => x.id.startsWith("m."));
  const chain = prereqChain(id);
  const forward = usedBy(id);
  const eqs = equationsOf(id);
  const area = areaByKey.get(n.area);
  const M = MODULES[id];

  return (
    <div className="wrap">
      <div className="page-head">
        <div className="crumbs">
          <Level level={n.level} full />
          <span>{areaName(n.area)}</span>
          {area?.proposed && <span className="kind">tambahan usulan</span>}
        </div>
        <h1>{n.title}</h1>
        {M && <p className="ui small status-badge" data-s={M.status ?? "draf"}>{(M.status ?? "draf") === "draf" ? "Modul draf: belum ditinjau pakar fisika. Gunakan bersama buku rujukan." : M.status === "ditinjau" ? "Modul sudah ditinjau pakar." : "Modul terbit."}</p>}
        <div style={{ marginTop: 18 }}><MasteryButton id={id} /></div>
      </div>

      <div className="layout">
        <div className="stack">
          {M ? <Sec id="fenomena" title="Fenomena fisik">{M.fenomena}</Sec> : <Module id="fenomena" no="Fenomena fisik" todo="Mengapa ini terjadi? Dibuka dengan situasi nyata sebelum rumus." />}
          {M ? <Sec id="konsep" title="Pemahaman konsep">{M.konsep}</Sec> : <Module id="konsep" no="Pemahaman konsep" todo="Apa yang sebenarnya dipelajari, dijelaskan tanpa rumus." />}

          <section className="module" id="matematika">
            <h2>Fondasi matematika <span className={`state ${math.length ? "ready" : ""}`}>{math.length ? "otomatis dari peta" : "tidak ada prasyarat matematika langsung"}</span></h2>
            {math.length ? (
              <>
                <p className="muted">Matematika yang dipakai langsung di konsep ini:</p>
                <ul>{math.map((m) => <li key={m.id}><Link href={`/konsep/${m.id}/`}>{m.title}</Link></li>)}</ul>
              </>
            ) : <p className="muted">Konsep ini memakai matematika yang sudah dicakup prasyarat fisikanya.</p>}
            {M && <div style={{ marginTop: 14 }}>{M.matematika}</div>}
          </section>

          <section className="module" id="derivasi">
            <h2>Derivasi <span className={`state ${eqs.length || M ? "ready" : ""}`}>{eqs.length ? `${eqs.length} persamaan siap` : M ? "tersedia" : "belum ditulis"}</span></h2>
            {M?.derivasiPengantar}
            {eqs.length ? (
              <div className="stack" style={{ marginTop: 8 }}>
                {eqs.map((e) => (
                  <div key={e.id}>
                    <Ledger eq={e} />
                    {e.assumptions.length > 0 && (
                      <div style={{ marginTop: 14 }}>
                        <h3 className="ui small" style={{ marginBottom: 4 }}>Asumsi yang dipakai</h3>
                        <ul>{e.assumptions.map((a, i) => <li key={i} className="muted small" style={{ marginBottom: 4 }}><Linked text={a} /></li>)}</ul>
                      </div>
                    )}
                    <p className="ui small" style={{ marginTop: 12 }}>
                      <Link href={`/persamaan/${e.id}/`}>Silsilah persamaan ini ({KIND_LABEL[e.kind].toLowerCase()})</Link>
                    </p>
                  </div>
                ))}
              </div>
            ) : M ? null : (
              <p className="todo">Derivasi untuk konsep ini belum ditulis. Format yang dipakai: tiap langkah beralasan, dengan asumsi dan batas berlaku.</p>
            )}
            {M?.derivasiTambahan?.map((e) => (
              <div key={e.id} style={{ marginTop: 16 }}><Ledger eq={e} /></div>
            ))}
            {M?.derivasiPenutup}
          </section>

          <section className="module" id="interpretasi">
            <h2>Interpretasi fisis <span className={`state ${eqs.length || M ? "ready" : ""}`}>{eqs.length || M ? "tersedia" : "belum ditulis"}</span></h2>
            {eqs.length ? eqs.map((e) => (
              <p key={e.id}><Tex tex={e.latex} /> — <Linked text={e.meaning} /></p>
            )) : M ? null : <p className="todo">Makna fisis dari hasil akan dituliskan di sini.</p>}
            {M?.interpretasi}
          </section>

          {M ? <Sec id="simulasi" title="Visualisasi dan simulasi">{M.simulasi}</Sec> : <Module id="simulasi" no="Visualisasi dan simulasi" todo="Ubah parameter dan lihat persamaan yang aktif ikut berubah." />}
          {M ? <Sec id="contoh" title="Contoh soal">{M.contoh}</Sec> : <Module id="contoh" no="Contoh soal" todo="Tiga tingkat: konseptual, matematis, aplikatif." />}
          {M ? <Sec id="evaluasi" title="Evaluasi konseptual">{M.evaluasi}</Sec> : <Module id="evaluasi" no="Evaluasi konseptual" todo="Soal yang menguji pemahaman, bukan hanya hitungan; tiap pilihan salah dipetakan ke satu miskonsepsi." />}

          <section className="module" id="keterkaitan">
            <h2>Keterkaitan <span className="state ready">otomatis dari peta</span></h2>
            {M?.keterkaitan}
            {ORDER.filter((t) => forward.has(t)).map((t) => (
              <div key={t}>
                <div className="group-title">Konsep ini menjadi {EDGE_LABEL[t]} bagi</div>
                <ul>{forward.get(t)!.map(({ node: x, note }) => (
                  <li key={x.id}><Link href={`/konsep/${x.id}/`}>{x.title}</Link>{note && <span className="muted small ui"> — {note}</span>}</li>
                ))}</ul>
              </div>
            ))}
            {forward.size === 0 && <p className="muted">Belum ada konsep lain di peta yang bergantung pada konsep ini.</p>}
          </section>
        </div>

        <aside className="side">
          <div className="sticky">
            {M && (
              <nav aria-label="Bagian modul" className="secnav">
                <h3>Bagian modul</h3>
                <ol>{SECTIONS.map(([k, t]) => <li key={k}><a href={`#${k}`}>{t}</a></li>)}</ol>
              </nav>
            )}
            <h3>Prasyarat langsung</h3>
            {direct.length ? (
              <ul className="chain">{direct.map((p) => (
                <li key={p.id} style={{ ["--c" as string]: `var(--lv${p.level})` }}><Link href={`/konsep/${p.id}/`}>{p.title}</Link></li>
              ))}</ul>
            ) : <p className="muted small">Ini konsep paling dasar; tidak ada prasyarat.</p>}
            <h3>Seluruh rantai prasyarat</h3>
            <p className="muted small" style={{ marginBottom: 8 }}>{chain.length} konsep, dari paling dasar.</p>
            <Link className="btn ghost sm" href={`/jalur/?target=${id}`}>Susun jalur ke sini</Link>
            <h3>Lihat di peta</h3>
            <Link className="btn ghost sm" href={`/peta/?id=${id}`}>Sorot di peta</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

const SECTIONS: [string, string][] = [
  ["fenomena", "Fenomena fisik"], ["konsep", "Pemahaman konsep"], ["matematika", "Fondasi matematika"], ["derivasi", "Derivasi"],
  ["interpretasi", "Interpretasi fisis"], ["simulasi", "Simulasi"], ["contoh", "Contoh soal"], ["evaluasi", "Evaluasi"], ["keterkaitan", "Keterkaitan"],
];

function Sec({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="module" id={id}>
      <h2>{title} <span className="state ready">tersedia</span></h2>
      {children}
    </section>
  );
}

function Module({ id, no, todo }: { id: string; no: string; todo: string }) {
  return (
    <section className="module" id={id}>
      <h2>{no} <span className="state">belum ditulis</span></h2>
      <p className="todo">{todo}</p>
    </section>
  );
}
