"use client";
import { useMemo, useState } from "react";
import { MISCONCEPTIONS, PASS_CORE, QUESTIONS } from "@/content/percepatan";
import { logAttempt } from "@/lib/attempts";
import { setMastery, useMasteryStore, type Mastery } from "@/lib/mastery";

type Ans = { pick: number; checked: boolean };

export function Quiz({ conceptId }: { conceptId: string }) {
  const [ans, setAns] = useState<Record<string, Ans>>({});
  const [applied, setApplied] = useState<Mastery | null>(null);
  const store = useMasteryStore();

  const core = QUESTIONS.filter((q) => q.core);
  const checkedCore = core.filter((q) => ans[q.id]?.checked);
  const finished = checkedCore.length === core.length;
  const score = core.filter((q) => ans[q.id]?.checked && q.options[ans[q.id].pick].correct).length;
  const tags = useMemo(() => {
    const c: Record<string, number> = {};
    for (const q of QUESTIONS) {
      const a = ans[q.id]; if (!a?.checked) continue;
      const tag = q.options[a.pick].tag; if (tag) c[tag] = (c[tag] ?? 0) + 1;
    }
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  }, [ans]);
  const suggested: Mastery = score >= PASS_CORE ? "kuasai" : score >= 4 ? "sebagian" : "belum";

  function check(qid: string) {
    const q = QUESTIONS.find((x) => x.id === qid)!; const a = ans[qid]; if (!a || a.checked) return;
    setAns({ ...ans, [qid]: { ...a, checked: true } });
    const o = q.options[a.pick];
    void logAttempt(conceptId, Boolean(o.correct), o.tag);
  }
  function reset() { setAns({}); setApplied(null); }

  return (
    <div className="quiz">
      {QUESTIONS.map((q, qi) => {
        const a = ans[q.id]; const o = a ? q.options[a.pick] : null;
        return (
          <fieldset key={q.id} className="q" disabled={Boolean(a?.checked)}>
            <legend>{q.core ? `Soal ${qi + 1}` : "Soal pengayaan (tidak dihitung)"}</legend>
            <p className="prompt">{q.prompt}</p>
            <div className="choices">
              {q.options.map((op, i) => (
                <label key={i} className="choice" data-state={a?.checked ? (op.correct ? "right" : i === a.pick ? "wrong" : "") : ""}>
                  <input type="radio" name={q.id} checked={a?.pick === i} onChange={() => setAns({ ...ans, [q.id]: { pick: i, checked: false } })} /> {op.text}
                </label>
              ))}
            </div>
            {!a?.checked && <button type="button" className="btn sm" disabled={!a} onClick={() => check(q.id)}>Periksa jawaban</button>}
            {a?.checked && o && (
              <div className="notice" data-t={o.correct ? "ok" : "error"} role="status">
                <strong>{o.correct ? "Tepat." : "Belum tepat."}</strong> {o.why}
                {!o.correct && <> Jawaban yang benar: <em>{q.options.find((x) => x.correct)!.text}</em> {q.options.find((x) => x.correct)!.why}</>}
              </div>
            )}
          </fieldset>
        );
      })}

      {finished && (
        <section className="summary" aria-live="polite">
          <h3>Hasil: {score} dari {core.length} soal inti benar</h3>
          {tags.length === 0 ? <p>Tidak ada miskonsepsi yang terdeteksi. Lanjutkan ke bagian Keterkaitan.</p> : (
            <>
              <p>Miskonsepsi yang muncul dari jawaban Anda:</p>
              <ul className="mk">
                {tags.map(([t, n]) => (
                  <li key={t}><strong>{MISCONCEPTIONS[t].title}</strong>{n > 1 ? ` (${n} kali)` : ""}<br /><span className="muted">{MISCONCEPTIONS[t].fix}</span></li>
                ))}
              </ul>
            </>
          )}
          <p>
            Saran status untuk konsep ini: <strong>{suggested === "kuasai" ? "Sudah paham" : suggested === "sebagian" ? "Sebagian paham" : "Belum dipelajari (ulangi bagian Konsep dan Simulasi)"}</strong>
            {" "}(sekarang: {store[conceptId] === "kuasai" ? "Sudah paham" : store[conceptId] === "sebagian" ? "Sebagian paham" : "Belum dipelajari"}).
          </p>
          <div className="actions ui">
            {suggested !== "belum" && <button className="btn" type="button" onClick={() => { setMastery(conceptId, suggested); setApplied(suggested); }}>Terapkan saran</button>}
            <button className="btn ghost" type="button" onClick={reset}>Ulangi kuis</button>
          </div>
          {applied && <p className="small muted ui">Status diperbarui. Anda tetap bisa mengubahnya kapan saja dari tombol status di atas halaman.</p>}
        </section>
      )}
    </div>
  );
}
