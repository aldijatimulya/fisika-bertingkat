#!/usr/bin/env python3
"""Bangun data Master Curriculum dari berkas sumber (source/) dan validasi graf.

Pemakaian:  python3 -I tools/build.py          (dari akar proyek)
Keluaran :  data/*.csv, data/*.json, supabase/seed_*.sql   | keluar dengan kode 1 jika ada galat validasi.
"""
import csv, json, sys, importlib.util
from collections import defaultdict, deque
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC, DATA, SQL = ROOT / "source", ROOT / "data", ROOT / "supabase"

def load_py(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod); return mod

# ---------- 1. parse konsep ----------
areas, concepts, order = {}, {}, []
cur = None
for ln, raw in enumerate((SRC / "concepts.txt").read_text(encoding="utf-8").splitlines(), 1):
    line = raw.strip()
    if not line or line.startswith("#") and not line.startswith("##"):
        continue
    if line.startswith("##"):
        parts = [p.strip() for p in line[2:].split("|")]
        cur = parts[0]
        areas[cur] = dict(key=cur, level=int(parts[1]), name=parts[2], proposed=(len(parts) > 3 and parts[3] == "usulan"))
        continue
    p = [x.strip() for x in line.split("|")]
    if len(p) != 4:
        sys.exit(f"concepts.txt baris {ln}: format salah: {line}")
    cid, title, pre, der = p
    concepts[cid] = dict(id=cid, title=title, area=cur, level=areas[cur]["level"],
                         prereq=[x for x in pre.split(";") if x], derived=[x for x in der.split(";") if x])
    order.append(cid)

errors, warnings = [], []
if len(order) != len(set(order)):
    errors.append("ID konsep duplikat")

# ---------- 2. validasi referensi, level, siklus ----------
for c in concepts.values():
    for ref in c["prereq"] + c["derived"]:
        if ref not in concepts:
            errors.append(f"{c['id']}: referensi tidak dikenal '{ref}'")
        elif concepts[ref]["level"] > c["level"]:
            errors.append(f"{c['id']} (L{c['level']}) bergantung pada {ref} (L{concepts[ref]['level']}) yang levelnya lebih tinggi")
        elif ref == c["id"]:
            errors.append(f"{c['id']}: bergantung pada dirinya sendiri")

indeg = {k: 0 for k in concepts}; adj = defaultdict(list)
for c in concepts.values():
    for r in c["prereq"]:
        if r in concepts:
            adj[r].append(c["id"]); indeg[c["id"]] += 1
q = deque(k for k, v in indeg.items() if v == 0); topo = []
depth = {k: 0 for k in concepts}
while q:
    n = q.popleft(); topo.append(n)
    for m in adj[n]:
        depth[m] = max(depth[m], depth[n] + 1); indeg[m] -= 1
        if indeg[m] == 0: q.append(m)
if len(topo) != len(concepts):
    errors.append("Graf prasyarat mengandung siklus: " + ", ".join(sorted(set(concepts) - set(topo))))

def closure(cid, memo={}):
    if cid in memo: return memo[cid]
    s = set()
    for r in concepts[cid]["prereq"]:
        if r in concepts: s |= {r} | closure(r)
    memo[cid] = s; return s

if not errors:
    for c in concepts.values():
        for d in c["derived"]:
            if d not in closure(c["id"]) and d not in c["prereq"]:
                warnings.append(f"{c['id']}: diturunkan dari {d} yang bukan prasyarat (langsung/tidak langsung)")
        if c["level"] >= 1 and not c["prereq"]:
            warnings.append(f"{c['id']}: konsep level {c['level']} tanpa prasyarat")

# ---------- 3. relasi (edges) ----------
edges = []
for c in concepts.values():
    for r in c["prereq"]: edges.append((r, c["id"], "prerequisite", ""))
    for r in c["derived"]: edges.append((r, c["id"], "derived_from", ""))
for raw in (SRC / "extra_edges.txt").read_text(encoding="utf-8").splitlines():
    if not raw.strip() or raw.startswith("#"): continue
    a, b, t, note = [x.strip() for x in raw.split("|")]
    for z in (a, b):
        if z not in concepts: errors.append(f"extra_edges: '{z}' tidak dikenal")
    edges.append((a, b, t, note))

# ---------- 4. persamaan ----------
E = load_py(SRC / "equations.py", "eqs").E
eids = {e["id"] for e in E}
if len(eids) != len(E): errors.append("ID persamaan duplikat")
for e in E:
    if e["concept"] not in concepts: errors.append(f"{e['id']}: konsep '{e['concept']}' tidak dikenal")
    for d in e["depends_on"]:
        if d not in eids: errors.append(f"{e['id']}: depends_on '{d}' tidak dikenal")
    for a in e["applied_in"]:
        if a not in concepts and a not in eids: errors.append(f"{e['id']}: applied_in '{a}' tidak dikenal")
    if e["kind"] not in {"definisi", "turunan", "hukum", "postulat", "aproksimasi", "model"}:
        errors.append(f"{e['id']}: kind tidak valid")
    if e["kind"] in {"turunan", "aproksimasi"} and len(e["steps"]) < 3:
        errors.append(f"{e['id']}: derivasi kurang dari 3 langkah")
    if not e["assumptions"] and e["kind"] in {"turunan", "aproksimasi"}:
        warnings.append(f"{e['id']}: turunan tanpa daftar asumsi")
    if not e["validity"]:
        errors.append(f"{e['id']}: batas keberlakuan kosong (wajib)")
    for s in e["steps"]:
        if not s["why"].strip(): errors.append(f"{e['id']}: langkah tanpa alasan")
# siklus persamaan
state = {}
def dfs(n, stack=()):
    if state.get(n) == 1: errors.append("Siklus persamaan: " + " -> ".join(stack + (n,))); return
    if state.get(n) == 2: return
    state[n] = 1
    for d in next(x for x in E if x["id"] == n)["depends_on"]:
        if d in eids: dfs(d, stack + (n,))
    state[n] = 2
for e in E: dfs(e["id"])

# ---------- 5. referensi & luaran ----------
R = json.loads((SRC / "references.json").read_text(encoding="utf-8"))
codes = {b["code"] for b in R["books"]}
VERIFIED = {"HRW", "TAY", "GED", "GQM", "SCH"}   # penomoran bab diyakini benar; lainnya perlu diverifikasi terhadap edisi yang dimiliki
for k, lst in R["area_refs"].items():
    if k not in areas: errors.append(f"references: area '{k}' tidak ada")
    for code, _ in lst:
        if code not in codes: errors.append(f"references: kode buku '{code}' tidak ada")
for k in areas:
    if k not in R["area_refs"]: errors.append(f"references: area '{k}' belum punya buku acuan")
O = load_py(SRC / "outcomes.py", "outs").O
for k in areas:
    if k not in O: errors.append(f"outcomes: area '{k}' belum punya luaran belajar")

if errors:
    print("GALAT VALIDASI:"); [print("  -", e) for e in errors]; sys.exit(1)

# ---------- 6. pemetaan fondasi matematika ----------
math_rows = []
for k, a in areas.items():
    if k.startswith("MATH"): continue
    direct, allm, need = set(), set(), defaultdict(set)
    for c in (x for x in concepts.values() if x["area"] == k):
        for r in c["prereq"]:
            if r.startswith("m."): direct.add(r); need[r].add(c["id"])
        allm |= {r for r in closure(c["id"]) if r.startswith("m.")}
    for m in sorted(allm, key=lambda z: depth[z]):
        math_rows.append((k, m, concepts[m]["title"], "langsung" if m in direct else "tidak_langsung", ";".join(sorted(need[m]))))

# ---------- 7. tulis keluaran ----------
DATA.mkdir(exist_ok=True); SQL.mkdir(exist_ok=True)
def wcsv(name, header, rows):
    with open(DATA / name, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f); w.writerow(header); w.writerows(rows)

LEVEL_NAMES = {0: "Mathematical & Scientific Foundation", 1: "Fundamental Physics", 2: "Classical Physics",
               3: "Modern Physics", 4: "Quantum Physics", 5: "Advanced & Applied Physics"}
wcsv("levels.csv", ["level", "nama"], sorted(LEVEL_NAMES.items()))
wcsv("areas.csv", ["area_key", "level", "nama", "usulan_tambahan"], [(a["key"], a["level"], a["name"], int(a["proposed"])) for a in areas.values()])
wcsv("concepts.csv", ["id", "level", "area_key", "judul", "kedalaman_graf", "jumlah_prasyarat", "jumlah_dipakai_oleh", "status_konten"],
     [(c["id"], c["level"], c["area"], c["title"], depth[c["id"]], len(c["prereq"]), len(adj[c["id"]]), "rencana") for c in concepts.values()])
wcsv("edges.csv", ["sumber", "tujuan", "tipe", "catatan"], edges)
wcsv("math_mapping.csv", ["area_key", "konsep_matematika", "judul", "kebutuhan", "dibutuhkan_oleh"], math_rows)
wcsv("references.csv", ["kode", "judul", "penulis", "edisi", "lapisan", "lisensi"], [(b["code"], b["title"], b["authors"], b["edition"], b["layer"], b["license"]) for b in R["books"]])
wcsv("area_references.csv", ["area_key", "kode_buku", "bab", "bab_terverifikasi"],
     [(k, code, ch, int(code in VERIFIED)) for k, lst in R["area_refs"].items() for code, ch in lst])
wcsv("learning_outcomes.csv", ["area_key", "bloom", "luaran_belajar", "indikator_penguasaan"],
     [(k, b, o, i) for k, lst in O.items() for b, o, i in lst])
wcsv("equations.csv", ["id", "konsep", "judul", "latex", "jenis", "bergantung_pada", "jumlah_langkah"],
     [(e["id"], e["concept"], e["title"], e["latex"], e["kind"], ";".join(e["depends_on"]), len(e["steps"])) for e in E])
(DATA / "equations.json").write_text(json.dumps(E, ensure_ascii=False, indent=2), encoding="utf-8")
(DATA / "knowledge_graph.json").write_text(json.dumps({
    "levels": LEVEL_NAMES, "areas": list(areas.values()),
    "nodes": [dict(id=c["id"], title=c["title"], level=c["level"], area=c["area"], depth=depth[c["id"]]) for c in concepts.values()],
    "edges": [dict(source=a, target=b, type=t, note=n) for a, b, t, n in edges]}, ensure_ascii=False, indent=1), encoding="utf-8")

# ---------- 8. seed SQL (3 berkas kecil, aman dijalankan ulang) ----------
def q(v):
    if v is None: return "NULL"
    if isinstance(v, bool): return "true" if v else "false"
    if isinstance(v, int): return str(v)
    return "'" + str(v).replace("'", "''") + "'"

def ins(table, cols, rows, conflict=""):
    """INSERT multi-baris, dipecah per 150 baris agar tiap pernyataan tetap kecil."""
    out = []
    for i in range(0, len(rows), 150):
        chunk = rows[i:i + 150]
        vals = ",\n  ".join("(" + ",".join(q(x) if not isinstance(x, tuple) else x[0] for x in r) + ")" for r in chunk)
        out.append(f"insert into {table}({','.join(cols)}) values\n  {vals}\n{conflict};")
    return out

def upd(key, cols):  # on conflict (key) do update set kolom = excluded.kolom
    return f"on conflict ({key}) do update set " + ", ".join(f"{c}=excluded.{c}" for c in cols)

HDR = "-- DIHASILKAN oleh curriculum/tools/build.py - jangan sunting manual.\n-- Aman dijalankan ulang (idempotent). Jalankan setelah schema.sql, urut: 1 -> 2 -> 3.\n"
for old in SQL.glob("seed*.sql"): old.unlink()

p1 = [HDR + "-- Bagian 1: tingkat, area, konsep, relasi", "begin;"]
p1 += ins("levels", ["level", "name"], list(LEVEL_NAMES.items()), upd("level", ["name"]))
p1 += ins("areas", ["area_key", "level", "name", "proposed"], [(a["key"], a["level"], a["name"], a["proposed"]) for a in areas.values()], upd("area_key", ["level", "name", "proposed"]))
p1 += ins("concepts", ["id", "level", "area_key", "title", "graph_depth"], [(c["id"], c["level"], c["area"], c["title"], depth[c["id"]]) for c in concepts.values()], upd("id", ["level", "area_key", "title", "graph_depth"]))
p1 += ["delete from concept_edges;"]
p1 += ins("concept_edges", ["source_id", "target_id", "edge_type", "note"], [(a, b, t, n) for a, b, t, n in edges], "on conflict do nothing")
p1 += ["commit;"]

p2 = [HDR + "-- Bagian 2: buku, rujukan, luaran belajar, pemetaan matematika", "begin;",
      "delete from area_references;", "delete from learning_outcomes;", "delete from math_requirements;"]
p2 += ins("books", ["code", "title", "authors", "edition", "layer", "license"], [(b["code"], b["title"], b["authors"], b["edition"], b["layer"], b["license"]) for b in R["books"]], upd("code", ["title", "authors", "edition", "layer", "license"]))
p2 += ins("area_references", ["area_key", "book_code", "chapters", "chapters_verified"], [(k, c, ch, c in VERIFIED) for k, lst in R["area_refs"].items() for c, ch in lst])
p2 += ins("learning_outcomes", ["area_key", "bloom", "outcome", "mastery_indicator"], [(k, b, o, i) for k, lst in O.items() for b, o, i in lst])
p2 += ins("math_requirements", ["area_key", "math_concept_id", "relation", "needed_by"], [(a, m, r, n) for a, m, _, r, n in math_rows])
p2 += ["commit;"]

p3 = [HDR + "-- Bagian 3: persamaan, langkah derivasi, silsilah", "begin;", "delete from equation_applied_in;", "delete from equation_deps;", "delete from equation_steps;"]
p3 += ins("equations", ["id", "concept_id", "title", "latex", "kind", "assumptions", "validity", "meaning"],
          [(e["id"], e["concept"], e["title"], e["latex"], e["kind"], (q(json.dumps(e["assumptions"], ensure_ascii=False)) + "::jsonb",), e["validity"], e["meaning"]) for e in E],
          upd("id", ["concept_id", "title", "latex", "kind", "assumptions", "validity", "meaning"]))
p3 += ins("equation_steps", ["equation_id", "step_no", "latex", "reason"], [(e["id"], i, s["latex"], s["why"]) for e in E for i, s in enumerate(e["steps"], 1)])
p3 += ins("equation_deps", ["equation_id", "depends_on_id"], [(e["id"], d) for e in E for d in e["depends_on"]])
p3 += ins("equation_applied_in", ["equation_id", "concept_id"], [(e["id"], a) for e in E for a in e["applied_in"] if a in concepts])
p3 += ["commit;"]
for name, part in (("seed_1_kurikulum.sql", p1), ("seed_2_pendukung.sql", p2), ("seed_3_persamaan.sql", p3)):
    (SQL / name).write_text("\n".join(part) + "\n", encoding="utf-8")

# ---------- 9. ringkasan ----------
per_level = defaultdict(int)
for c in concepts.values(): per_level[c["level"]] += 1
types = defaultdict(int)
for _, _, t, _ in edges: types[t] += 1
print(f"OK  konsep={len(concepts)}  area={len(areas)}  relasi={len(edges)}  persamaan={len(E)}  buku={len(R['books'])}")
print("    per level :", dict(sorted(per_level.items())))
print("    tipe relasi:", dict(types))
print("    kedalaman graf maks:", max(depth.values()), "| baris pemetaan matematika:", len(math_rows))
for w in warnings: print("  PERINGATAN:", w)
