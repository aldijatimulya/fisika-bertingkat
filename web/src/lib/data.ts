import graph from "@/data/knowledge_graph.json";
import equationData from "@/data/equations.json";

export type EdgeType =
  | "prerequisite" | "derived_from" | "special_case_of"
  | "approximation_of" | "generalized_by" | "motivated_by";

export type ConceptNode = { id: string; title: string; level: number; area: string; depth: number };
export type Edge = { source: string; target: string; type: EdgeType; note: string };
export type Area = { key: string; level: number; name: string; proposed: boolean };
export type Step = { latex: string; why: string };
export type Equation = {
  id: string; concept: string; title: string; latex: string;
  kind: "definisi" | "turunan" | "hukum" | "postulat" | "aproksimasi" | "model";
  depends_on: string[]; assumptions: string[]; validity: string;
  steps: Step[]; meaning: string; applied_in: string[];
};

export const LEVELS: Record<number, { name: string; short: string; blurb: string }> = {
  0: { name: "Fondasi matematika dan sains", short: "Fondasi", blurb: "Vektor, kalkulus, persamaan diferensial: bahasa yang dipakai fisika." },
  1: { name: "Fisika dasar", short: "Dasar", blurb: "Mekanika, gelombang, termodinamika, listrik-magnet dasar." },
  2: { name: "Fisika klasik", short: "Klasik", blurb: "Lagrange, Hamilton, persamaan Maxwell, fisika statistik." },
  3: { name: "Fisika modern", short: "Modern", blurb: "Relativitas khusus, atom, inti, zat padat." },
  4: { name: "Fisika kuantum", short: "Kuantum", blurb: "Postulat, operator, Schrödinger, atom hidrogen, perturbasi." },
  5: { name: "Fisika lanjut dan terapan", short: "Lanjut", blurb: "Partikel, relativitas umum, kosmologi, plasma, geofisika, komputasi." },
};

export const EDGE_LABEL: Record<EdgeType, string> = {
  prerequisite: "prasyarat",
  derived_from: "diturunkan dari",
  special_case_of: "kasus khusus dari",
  approximation_of: "aproksimasi dari",
  generalized_by: "digeneralisasi oleh",
  motivated_by: "dimotivasi oleh",
};

export const KIND_LABEL: Record<Equation["kind"], string> = {
  definisi: "Definisi",
  turunan: "Hasil turunan",
  hukum: "Hukum empiris",
  postulat: "Postulat",
  aproksimasi: "Aproksimasi",
  model: "Model",
};

export const nodes = graph.nodes as ConceptNode[];
export const edges = graph.edges as Edge[];
export const areas = graph.areas as Area[];
export const equations = equationData as Equation[];

export const nodeById = new Map(nodes.map((n) => [n.id, n]));
export const areaByKey = new Map(areas.map((a) => [a.key, a]));
export const equationById = new Map(equations.map((e) => [e.id, e]));

const preIn = new Map<string, string[]>();
const outAll = new Map<string, Edge[]>();
const inAll = new Map<string, Edge[]>();
for (const e of edges) {
  (outAll.get(e.source) ?? outAll.set(e.source, []).get(e.source)!).push(e);
  (inAll.get(e.target) ?? inAll.set(e.target, []).get(e.target)!).push(e);
  if (e.type === "prerequisite") (preIn.get(e.target) ?? preIn.set(e.target, []).get(e.target)!).push(e.source);
}

export const directPrereqs = (id: string) => (preIn.get(id) ?? []).map((x) => nodeById.get(x)!).sort(byDepth);
export const incomingEdges = (id: string) => inAll.get(id) ?? [];
export const outgoingEdges = (id: string) => outAll.get(id) ?? [];
const byDepth = (a: ConceptNode, b: ConceptNode) => a.depth - b.depth || a.level - b.level || a.id.localeCompare(b.id);

/** Semua prasyarat (transitif), urut dari paling dasar. */
export function prereqChain(id: string): ConceptNode[] {
  const seen = new Set<string>();
  const stack = [...(preIn.get(id) ?? [])];
  while (stack.length) {
    const x = stack.pop()!;
    if (seen.has(x)) continue;
    seen.add(x);
    stack.push(...(preIn.get(x) ?? []));
  }
  return [...seen].map((x) => nodeById.get(x)!).sort(byDepth);
}

/** Konsep yang memakai konsep ini (satu langkah ke depan), dikelompokkan per tipe relasi. */
export function usedBy(id: string) {
  const groups = new Map<EdgeType, { node: ConceptNode; note: string }[]>();
  for (const e of outAll.get(id) ?? []) {
    const arr = groups.get(e.type) ?? [];
    arr.push({ node: nodeById.get(e.target)!, note: e.note });
    groups.set(e.type, arr);
  }
  return groups;
}

export const equationsOf = (conceptId: string) => equations.filter((e) => e.concept === conceptId);

export function eqAncestors(id: string): Equation[] {
  const seen = new Set<string>();
  const walk = (x: string) => {
    for (const d of equationById.get(x)?.depends_on ?? []) if (!seen.has(d)) { seen.add(d); walk(d); }
  };
  walk(id);
  return [...seen].map((x) => equationById.get(x)!);
}
export const eqDescendants = (id: string) => equations.filter((e) => eqAncestors(e.id).some((a) => a.id === id));

export function areaName(key: string) { return areaByKey.get(key)?.name ?? key; }
export const levelVar = (l: number) => `var(--lv${l})`;
