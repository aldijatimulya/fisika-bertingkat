// Validator modul JSON: skema, kelengkapan 9 bagian, kuis berpeta miskonsepsi, rumus dapat dirender KaTeX.
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import katex from "katex";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "src/content/modul");
const graph = JSON.parse(readFileSync(path.join(root, "src/data/knowledge_graph.json"), "utf8"));
const equations = JSON.parse(readFileSync(path.join(root, "src/data/equations.json"), "utf8"));
const ids = new Set(graph.nodes.map((n) => n.id)), eqIds = new Set(equations.map((e) => e.id));
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
const errors = [];
const err = (id, m) => errors.push(`${id}: ${m}`);

function walkText(b, out) {
  if (typeof b === "string") out.push(b);
  else if (b.h) out.push(b.h);
  else if (b.note) out.push(b.note);
  else if (b.ul) out.push(...b.ul);
  else if (b.ol) out.push(...b.ol);
  else if (b.table) { out.push(...b.table.head); b.table.rows.forEach((r) => out.push(...r)); }
  else err("?", "blok tidak dikenal " + JSON.stringify(b).slice(0, 40));
}
function checkTex(id, where, tex) {
  try { katex.renderToString(tex, { throwOnError: true, strict: "ignore" }); } catch (e) { err(id, `${where}: KaTeX gagal pada "${tex.slice(0, 50)}" (${e.message.slice(0, 60)})`); }
}
function checkText(id, where, t) {
  const dollars = (t.match(/\$/g) ?? []).length;
  if (dollars % 2) err(id, `${where}: jumlah $ ganjil`);
  for (const m of t.matchAll(/\$\$([^$]+)\$\$|\$([^$]+)\$/g)) checkTex(id, where, m[1] ?? m[2]);
  if (t.includes("**")) err(id, `${where}: markdown tebal (**) tidak didukung`);
  { const bare = t.replace(/\$\$[^$]+\$\$|\$[^$]+\$/g, " "); for (const m of bare.matchAll(/(?<![\w.])([a-z]{1,2}\.[a-z][a-z0-9_]+)\b/g)) if (!ids.has(m[1]) && !eqIds.has(m[1])) err(id, `${where}: id tidak dikenal ${m[1]}`); }
  for (const m of t.matchAll(/\beq\.[a-z0-9_]+\b/g)) if (!eqIds.has(m[0])) err(id, `${where}: persamaan tidak dikenal ${m[0]}`);
}
function section(id, name, blocks, min = 1) {
  if (!Array.isArray(blocks) || blocks.length < min) return err(id, `bagian ${name} kosong`);
  const out = []; blocks.forEach((b) => walkText(b, out)); out.forEach((t) => checkText(id, name, t));
  if (out.join(" ").length < 80 && min > 0) err(id, `bagian ${name} terlalu pendek`);
}

const seen = new Set();
for (const f of files) {
  let m; try { m = JSON.parse(readFileSync(path.join(dir, f), "utf8")); } catch (e) { err(f, "JSON tidak valid: " + e.message); continue; }
  const id = m.id; 
  if (f !== id + ".json") err(id, "nama berkas harus sama dengan id");
  if (!ids.has(id)) err(id, "id konsep tidak ada di graf");
  if (seen.has(id)) err(id, "duplikat"); seen.add(id);
  if (!["draf", "ditinjau", "terbit"].includes(m.status)) err(id, "status tidak sah");
  ["fenomena", "konsep", "matematika", "interpretasi", "keterkaitan"].forEach((k) => section(id, k, m[k]));
  // derivasi
  if (!m.derivasi) err(id, "derivasi hilang"); else {
    section(id, "derivasi.intro", m.derivasi.intro);
    section(id, "derivasi.outro", m.derivasi.outro ?? [], 0);
    const eqsHere = equations.filter((e) => e.concept === id);
    if (eqsHere.length === 0 && (m.derivasi.extra ?? []).length === 0 && !/tidak ada|bukan|definisi|konsep ini/i.test(JSON.stringify(m.derivasi.intro))) err(id, "tanpa persamaan dan tanpa derivasi tambahan: intro harus menjelaskan mengapa tidak ada derivasi");
    for (const d of m.derivasi.extra ?? []) {
      if (!d.validity || d.validity.length < 20) err(id, `derivasi "${d.title}": batas keberlakuan wajib`);
      if (!d.steps || d.steps.length < 2) err(id, `derivasi "${d.title}": minimal 2 langkah`);
      for (const s of d.steps ?? []) { checkTex(id, "langkah", s.tex); if (!s.why || s.why.length < 15) err(id, `langkah tanpa alasan memadai: ${s.tex.slice(0, 30)}`); checkText(id, "alasan", s.why ?? ""); }
    }
  }
  // simulasi
  if (m.simulasi !== null) {
    const sims = m.simulasi; section(id, "simulasi.question", sims.question);
    for (const s of [...sims.scenarios, sims.free]) {
      if (!(s.T > 0) || typeof s.motion?.v0 !== "number") err(id, `skenario ${s.id} tidak sah`);
      if (s.choices.length && !(s.answer >= 0 && s.answer < s.choices.length)) err(id, `skenario ${s.id}: indeks jawaban`);
    }
  }
  // contoh
  const lv = (m.contoh ?? []).map((c) => c.level).sort().join(",");
  if (lv !== "Aplikatif,Konseptual,Matematis") err(id, `contoh harus 3 tingkat (Konseptual, Matematis, Aplikatif), ada: ${lv}`);
  for (const c of m.contoh ?? []) { section(id, "contoh.soal", c.problem); section(id, "contoh.pembahasan", c.answer); }
  // kuis
  const q = m.kuis;
  if (!q) err(id, "kuis hilang"); else {
    const core = q.questions.filter((x) => x.core);
    if (core.length < 5) err(id, "minimal 5 soal inti");
    if (!(q.pass >= Math.ceil(core.length * 0.7) && q.pass <= core.length)) err(id, "ambang lulus tidak wajar");
    const used = new Set();
    for (const x of q.questions) {
      checkText(id, x.id, x.prompt);
      if (x.options.length !== 4) err(id, `${x.id}: harus 4 pilihan`);
      if (x.options.filter((o) => o.correct).length !== 1) err(id, `${x.id}: tepat satu jawaban benar`);
      for (const o of x.options) {
        checkText(id, x.id, o.text); checkText(id, x.id, o.why);
        if (!o.why || o.why.length < 15) err(id, `${x.id}: alasan pilihan terlalu pendek`);
        if (o.correct && o.tag) err(id, `${x.id}: jawaban benar tidak boleh bertanda`);
        if (!o.correct) { if (!q.misconceptions[o.tag]) err(id, `${x.id}: tag ${o.tag} tak ada di katalog`); else used.add(o.tag); }
      }
    }
    for (const t of Object.keys(q.misconceptions)) if (!used.has(t)) err(id, `miskonsepsi ${t} tidak dipakai`);
    const pos = new Set(q.questions.map((x) => x.options.findIndex((o) => o.correct)));
    if (pos.size < 3) err(id, "posisi jawaban benar kurang bervariasi");
    const texts = q.questions.map((x) => x.prompt); if (new Set(texts).size !== texts.length) err(id, "soal ganda");
  }
}
if (errors.length) { console.error(errors.join("\n")); console.error(`\nmodul.test: ${errors.length} masalah pada ${files.length} berkas`); process.exit(1); }
console.log(`modul.test: ${files.length} modul JSON valid`);
