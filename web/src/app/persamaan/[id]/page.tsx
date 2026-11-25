import Link from "next/link";
import { notFound } from "next/navigation";
import { equations, equationById, nodeById, eqAncestors, eqDescendants } from "@/lib/data";
import { Ledger } from "@/components/Ledger";
import { Level } from "@/components/Level";
import { Tex } from "@/components/Tex";
import { Linked } from "@/components/Linked";

export function generateStaticParams() { return equations.map((e) => ({ id: e.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: equationById.get(id)?.title ?? "Persamaan" };
}

export default async function EquationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = equationById.get(id);
  if (!e) notFound();
  const anc = eqAncestors(id);
  const desc = eqDescendants(id);
  const c = nodeById.get(e.concept)!;
  const origin = e.kind === "hukum" || e.kind === "postulat" || e.kind === "definisi";
  return (
    <div className="wrap">
      <div className="page-head">
        <div className="crumbs"><Level level={c.level} full /><Link href={`/konsep/${c.id}/`}>{c.title}</Link></div>
        <h1>{e.title}</h1>
      </div>
      <div className="layout">
        <div className="stack">
          <Ledger eq={e} />
          {e.assumptions.length > 0 && (
            <section>
              <h2>Asumsi</h2>
              <ul style={{ marginTop: 8 }}>{e.assumptions.map((a, i) => <li key={i} style={{ marginBottom: 6 }}><Linked text={a} /></li>)}</ul>
            </section>
          )}
          <section>
            <h2>Maknanya</h2>
            <p style={{ marginTop: 8 }}><Linked text={e.meaning} /></p>
          </section>
        </div>
        <aside className="side">
          <div className="sticky">
            <h3>Berasal dari</h3>
            {origin && anc.length === 0 && (
              <p className="muted small">Persamaan ini {e.kind === "definisi" ? "adalah definisi" : e.kind === "hukum" ? "adalah hukum empiris" : "adalah postulat"}; tidak diturunkan dari persamaan lain di sini.</p>
            )}
            <ul>{e.depends_on.map((d) => { const x = equationById.get(d)!; return (
              <li key={d}><Link href={`/persamaan/${d}/`}>{x.title}</Link><div className="muted small"><Tex tex={x.latex} /></div></li>
            ); })}</ul>
            {anc.length > e.depends_on.length && <p className="muted small" style={{ marginTop: 8 }}>Total {anc.length} persamaan di rantai asalnya.</p>}
            <h3>Dipakai untuk</h3>
            {desc.length ? <ul>{desc.map((x) => <li key={x.id}><Link href={`/persamaan/${x.id}/`}>{x.title}</Link></li>)}</ul> : <p className="muted small">Belum ada persamaan lain yang diturunkan darinya di basis data ini.</p>}
            {e.applied_in.length > 0 && (<>
              <h3>Digunakan pada konsep</h3>
              <ul>{e.applied_in.map((k) => <li key={k}><Link href={`/konsep/${k}/`}>{nodeById.get(k)?.title ?? k}</Link></li>)}</ul>
            </>)}
          </div>
        </aside>
      </div>
    </div>
  );
}
