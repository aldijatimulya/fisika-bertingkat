import { Tex } from "./Tex";
import { Linked } from "./Linked";
import { Equation, KIND_LABEL } from "@/lib/data";

/** Buku besar derivasi: rumus di kiri, alasan tiap langkah di kanan. */
export function Ledger({ eq, showMeta = true }: { eq: Equation; showMeta?: boolean }) {
  return (
    <section className="ledger" aria-label={`Derivasi: ${eq.title}`}>
      <div className="ledger-head">
        <span className="title">{eq.title}</span>
        <span className="kind" data-k={eq.kind}>{KIND_LABEL[eq.kind]}</span>
      </div>
      {eq.steps.map((s, i) => (
        <div className="row" key={i}>
          <div className="expr"><span className="no">{i + 1}</span><Tex tex={s.latex} block /></div>
          <div className="why"><Linked text={s.why} /></div>
        </div>
      ))}
      <div className="final"><Tex tex={eq.latex} block /></div>
      {showMeta && (
        <div className="ledger-foot">
          <strong>Berlaku:</strong> <Linked text={eq.validity} />
        </div>
      )}
    </section>
  );
}
