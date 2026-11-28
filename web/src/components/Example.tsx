import type { ReactNode } from "react";

export function Example({ level, title, children, answer }: { level: string; title: string; children: ReactNode; answer: ReactNode }) {
  return (
    <details className="example">
      <summary><span className="lvl">{level}</span> {title}</summary>
      <div className="ex-body">
        <div>{children}</div>
        <details className="answer"><summary>Lihat pembahasan</summary><div>{answer}</div></details>
      </div>
    </details>
  );
}

