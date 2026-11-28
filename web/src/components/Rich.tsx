import type { ReactNode } from "react";
import { Tex } from "./Tex";
import { Linked } from "./Linked";

export type Block =
  | string
  | { h: string }
  | { ul: string[] }
  | { ol: string[] }
  | { note: string }
  | { table: { head: string[]; rows: string[][] } };

/** Teks dengan rumus: $...$ sebaris, $$...$$ blok; id konsep/persamaan otomatis jadi tautan. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("$$")) return <Tex key={i} tex={p.slice(2, -2)} block />;
        if (p.startsWith("$")) return <Tex key={i} tex={p.slice(1, -1)} />;
        return <Linked key={i} text={p} />;
      })}
    </>
  );
}

export function Rich({ blocks }: { blocks: Block[] }): ReactNode {
  return (
    <>
      {blocks.map((b, i) => {
        if (typeof b === "string") return b.startsWith("$$") && b.endsWith("$$") && !b.slice(2, -2).includes("$") ? <Inline key={i} text={b} /> : <p key={i}><Inline text={b} /></p>;
        if ("h" in b) return <h3 key={i}>{b.h}</h3>;
        if ("ul" in b) return <ul key={i}>{b.ul.map((x, j) => <li key={j}><Inline text={x} /></li>)}</ul>;
        if ("ol" in b) return <ol key={i}>{b.ol.map((x, j) => <li key={j}><Inline text={x} /></li>)}</ol>;
        if ("note" in b) return <p key={i} className="small muted"><Inline text={b.note} /></p>;
        return (
          <table key={i} className="tbl">
            <thead><tr>{b.table.head.map((h, j) => <th key={j}><Inline text={h} /></th>)}</tr></thead>
            <tbody>{b.table.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}><Inline text={c} /></td>)}</tr>)}</tbody>
          </table>
        );
      })}
    </>
  );
}
