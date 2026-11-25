import Link from "next/link";
import { LEVELS, nodes, edges, equations, equationById, prereqChain } from "@/lib/data";
import { Ledger } from "@/components/Ledger";

export default function Home() {
  const eq = equationById.get("eq.vt")!;
  const counts = [0, 1, 2, 3, 4, 5].map((l) => nodes.filter((n) => n.level === l).length);
  const tdse = prereqChain("q.tdse").length;
  return (
    <div className="wrap">
      <section className="hero">
        <div>
          <h1>Setiap persamaan punya asal-usul.</h1>
          <p className="lead">
            Telusuri dari mana sebuah hukum diturunkan, konsep apa yang harus dipahami lebih dulu, dan di mana ia berhenti berlaku.
            Dari kecepatan sampai persamaan Schrödinger, satu peta yang saling terhubung.
          </p>
          <div className="actions ui">
            <Link className="btn" href="/jalur/">Susun jalur belajar</Link>
            <Link className="btn ghost" href="/peta/">Buka peta konsep</Link>
          </div>
        </div>
        <div>
          <Ledger eq={eq} />
          <p className="small muted ui" style={{ marginTop: 12 }}>
            Contoh derivasi di platform ini: tiap langkah punya alasan, dan setiap hasil punya batas berlaku.
          </p>
        </div>
      </section>

      <section className="section">
        <h2>Enam tingkat, dari fondasi sampai fisika lanjut</h2>
        <p className="muted">Tingkat berikutnya hanya memakai konsep dari tingkat yang sama atau di bawahnya.</p>
        <ul className="levels">
          {[0, 1, 2, 3, 4, 5].map((l) => (
            <li key={l} style={{ ["--c" as string]: `var(--lv${l})` }}>
              <Link href={`/peta/?level=${l}`}>
                <div className="t">L{l} · {LEVELS[l].name}</div>
                <div className="muted small ui">{LEVELS[l].blurb}</div>
              </Link>
              <div className="n">{counts[l]} konsep</div>
            </li>
          ))}
        </ul>
        <div className="callout">
          <p>
            <strong>Mengapa fisika terasa menumpuk?</strong> Persamaan Schrödinger bergantung pada {tdse} konsep lain, langsung maupun tidak langsung.
            Celah di satu titik terbawa sampai ke atas.
          </p>
          <p className="ui small">
            <Link href="/konsep/q.tdse/">Lihat seluruh rantai prasyaratnya</Link>
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 80 }}>
        <h2>Isi saat ini</h2>
        <p className="muted">
          {nodes.length} konsep dan {edges.length} relasi sudah terpetakan. {equations.length} persamaan sudah lengkap dengan derivasi,
          asumsi, dan batas berlaku. Konsep lain berstatus rencana dan modulnya akan ditulis bertahap.
        </p>
        <div className="actions ui">
          <Link className="btn ghost" href="/persamaan/">Daftar persamaan</Link>
        </div>
      </section>
    </div>
  );
}
