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

  return (
    <div className="wrap">
      <div className="page-head">
        <div className="crumbs">
          <Level level={n.level} full />
          <span>{areaName(n.area)}</span>
          {area?.proposed && <span className="kind">tambahan usulan</span>}
        </div>
        <h1>{n.title}</h1>
        <div style={{ marginTop: 18 }}><MasteryButton id={id} /></div>
      </div>

      <div className="layout">
        <div className="stack">
          <Module no="Fenomena fisik" todo="Mengapa ini terjadi? Dibuka dengan situasi nyata sebelum rumus." />
          <Module no="Pemahaman konsep" todo="Apa yang sebenarnya dipelajari, dijelaskan tanpa rumus." />

          <section className="module">
            <h2>Fondasi matematika <span className={`state ${math.length ? "ready" : ""}`}>{math.length ? "otomatis dari peta" : "tidak ada prasyarat matematika langsung"}</span></h2>
            {math.length ? (
              <>
                <p className="muted">Matematika yang dipakai langsung di konsep ini:</p>
                <ul>{math.map((m) => <li key={m.id}><Link href={`/konsep/${m.id}/`}>{m.title}</Link></li>)}</ul>
              </>
            ) : <p className="muted">Konsep ini memakai matematika yang sudah dicakup prasyarat fisikanya.</p>}
          </section>

          <section className="module">
            <h2>Derivasi <span className={`state ${eqs.length ? "ready" : ""}`}>{eqs.length ? `${eqs.length} persamaan siap` : "belum ditulis"}</span></h2>
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
            ) : (
              <p className="todo">Derivasi untuk konsep ini belum ditulis. Format yang dipakai: tiap langkah beralasan, dengan asumsi dan batas berlaku.</p>
            )}
          </section>

          <section className="module">
            <h2>Interpretasi fisis <span className={`state ${eqs.length ? "ready" : ""}`}>{eqs.length ? "tersedia" : "belum ditulis"}</span></h2>
            {eqs.length ? eqs.map((e) => (
              <p key={e.id}><Tex tex={e.latex} /> — <Linked text={e.meaning} /></p>
            )) : <p className="todo">Makna fisis dari hasil akan dituliskan di sini.</p>}
          </section>

          <Module no="Visualisasi dan simulasi" todo="Ubah parameter dan lihat persamaan yang aktif ikut berubah." />
          <Module no="Contoh soal" todo="Tiga tingkat: konseptual, matematis, aplikatif." />
          <Module no="Evaluasi konseptual" todo="Soal yang menguji pemahaman, bukan hanya hitungan; tiap pilihan salah dipetakan ke satu miskonsepsi." />

          <section className="module">
            <h2>Keterkaitan <span className="state ready">otomatis dari peta</span></h2>
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

function Module({ no, todo }: { no: string; todo: string }) {
  return (
    <section className="module">
      <h2>{no} <span className="state">belum ditulis</span></h2>
      <p className="todo">{todo}</p>
    </section>
  );
}
