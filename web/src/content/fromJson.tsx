import { Example } from "@/components/Example";
import { Quiz } from "@/components/Quiz";
import { Rich, type Block } from "@/components/Rich";
import { Simulation } from "@/components/Simulation";
import type { Question, Scenario } from "./percepatan";
import type { Equation } from "@/lib/data";
import type { ModuleDef } from "./modules";
import { RAW_MODULES } from "./modul";

export type RawModule = {
  id: string;
  status: "draf" | "ditinjau" | "terbit";
  fenomena: Block[]; konsep: Block[]; matematika: Block[]; interpretasi: Block[]; keterkaitan: Block[];
  derivasi: { intro: Block[]; extra: { title: string; steps: { tex: string; why: string }[]; validity: string }[]; outro: Block[] };
  simulasi: null | { question: Block[]; scenarios: Scenario[]; free: Scenario };
  contoh: { level: string; title: string; problem: Block[]; answer: Block[] }[];
  kuis: { pass: number; questions: Question[]; misconceptions: Record<string, { title: string; fix: string }> };
};

function build(m: RawModule): ModuleDef {
  return {
    status: m.status,
    fenomena: <Rich blocks={m.fenomena} />,
    konsep: <Rich blocks={m.konsep} />,
    matematika: <Rich blocks={m.matematika} />,
    derivasiPengantar: <Rich blocks={m.derivasi.intro} />,
    derivasiPenutup: <Rich blocks={m.derivasi.outro} />,
    derivasiTambahan: m.derivasi.extra.map((d, i): Equation => ({
      id: `${m.id}.extra${i}`, concept: m.id, title: d.title, latex: d.steps[d.steps.length - 1].tex, kind: "turunan",
      depends_on: [], assumptions: [], validity: d.validity, steps: d.steps.map((s) => ({ latex: s.tex, why: s.why })), meaning: "", applied_in: [],
    })),
    interpretasi: <Rich blocks={m.interpretasi} />,
    simulasi: m.simulasi ? (<><Rich blocks={m.simulasi.question} /><Simulation scenarios={m.simulasi.scenarios} free={m.simulasi.free} /></>)
      : <p className="muted">Konsep ini tidak disimulasikan karena visualisasinya tidak akan jujur terhadap isi fisikanya. Gunakan contoh soal dan kuis di bawah.</p>,
    contoh: (<><p>Coba kerjakan sendiri dahulu.</p>{m.contoh.map((c, i) => <Example key={i} level={c.level} title={c.title} answer={<Rich blocks={c.answer} />}><Rich blocks={c.problem} /></Example>)}</>),
    evaluasi: (<><p>Soal inti menentukan saran status penguasaan; tiap jawaban salah dipetakan ke satu miskonsepsi.</p><Quiz conceptId={m.id} questions={m.kuis.questions} misconceptions={m.kuis.misconceptions} passCore={m.kuis.pass} /></>),
    keterkaitan: <Rich blocks={m.keterkaitan} />,
  };
}

export const JSON_MODULES: Record<string, ModuleDef> = Object.fromEntries(Object.values(RAW_MODULES).map((m) => [m.id, build(m)]));
