import Link from "next/link";
import { equations, nodeById, KIND_LABEL } from "@/lib/data";
import { Tex } from "@/components/Tex";
import { Level } from "@/components/Level";

export const metadata = { title: "Persamaan" };

export default function EquationsPage() {
  const sorted = [...equations].sort((a, b) => nodeById.get(a.concept)!.level - nodeById.get(b.concept)!.level || nodeById.get(a.concept)!.depth - nodeById.get(b.concept)!.depth);
  return (
    <div className="wrap narrow" style={{ paddingBottom: 80 }}>
      <div className="page-head">
        <h1>Persamaan dan asal-usulnya</h1>
        <p className="muted" style={{ marginTop: 16 }}>
          {equations.length} persamaan dengan derivasi bertahap. Urutannya mengikuti kedalaman graf: yang paling dasar lebih dulu.
        </p>
      </div>
      <ul className="eqlist">
        {sorted.map((e) => (
          <li key={e.id}>
            <Link href={`/persamaan/${e.id}/`}>
              <div>
                <div className="t" style={{ fontWeight: 600 }}>{e.title}</div>
                <div className="f"><Tex tex={e.latex} /></div>
              </div>
              <div className="ui small muted" style={{ display: "grid", gap: 4, justifyItems: "start" }}>
                <Level level={nodeById.get(e.concept)!.level} />
                <span className="kind" data-k={e.kind}>{KIND_LABEL[e.kind]}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
