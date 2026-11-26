// Jalankan: node --experimental-strip-types --no-warnings tests/content.test.mjs
// Memeriksa fisika dan integritas data modul Percepatan.
import assert from "node:assert/strict";
import { pos, vel, turnTime, speedTrend } from "../src/lib/kin.ts";
import { QUESTIONS, MISCONCEPTIONS, SCENARIOS, PASS_CORE } from "../src/content/percepatan.ts";

const close = (a, b, eps = 1e-9, msg = "") => assert.ok(Math.abs(a - b) < eps, `${msg} ${a} != ${b}`);
let n = 0; const ok = (name) => { n++; console.log("  ok", name); };

// --- kin.ts
const m = { x0: 0, v0: 0, a: 2 };
close(vel(m, 5), 10); close(pos(m, 5), 25); ok("skenario tambah: v(5)=10, x(5)=25");
const up = { x0: 0, v0: 15, a: -9.8 };
close(turnTime(up), 15 / 9.8); close(turnTime(up), 1.5306, 1e-3);
close(pos(up, turnTime(up)), 225 / (2 * 9.8)); close(pos(up, turnTime(up)), 11.48, 5e-3);
close(vel(up, turnTime(up)), 0); assert.equal(speedTrend(up, turnTime(up)), "berhenti-sesaat"); ok("lempar atas: t*=1,53 s, h=11,5 m, v=0 tetapi a≠0");
const brake = { x0: 0, v0: 20, a: -4 };
close(turnTime(brake), 5); ok("rem: berhenti pada t=5 s");
assert.equal(turnTime({ x0: 0, v0: 5, a: 2 }), null); assert.equal(turnTime({ x0: 0, v0: 5, a: 0 }), null); ok("tanpa titik balik bila searah / a=0");
assert.equal(speedTrend({ x0: 0, v0: -5, a: -2 }, 1), "bertambah"); // soal q1
assert.equal(speedTrend({ x0: 0, v0: 5, a: -2 }, 1), "berkurang");
assert.equal(speedTrend({ x0: 0, v0: 30, a: 0 }, 1), "tetap");
assert.equal(speedTrend({ x0: 0, v0: 0, a: 0 }, 1), "diam"); ok("empat kasus tanda v dan a");
close(vel({ x0: 0, v0: -5, a: -2 }, 1), -7); close(vel({ x0: 0, v0: -5, a: -2 }, 2), -9); ok("q1: -5, -7, -9 m/s");
// konsistensi turunan numerik: dx/dt = v, dv/dt = a
const h = 1e-5, mm = { x0: 1, v0: 3, a: -1.5 };
for (const t of [0, 0.7, 2.2]) { close((pos(mm, t + h) - pos(mm, t - h)) / (2 * h), vel(mm, t), 1e-6); close((vel(mm, t + h) - vel(mm, t - h)) / (2 * h), mm.a, 1e-6); }
ok("turunan numerik x'=v dan v'=a");

// --- Contoh soal (angka yang tertulis di modul)
const v2 = (t) => 4 * t - t * t, a2 = (t) => 4 - 2 * t;
close(a2(0), 4); close(a2(3), -2); close((v2(3) - v2(0)) / 3, 1); close(a2(2), 0); close(v2(2), 4); close(v2(4), 0); close(a2(4), -4);
for (const t of [0, 1, 2, 3]) close((v2(t + 1e-6) - v2(t - 1e-6)) / 2e-6, a2(t), 1e-6);
ok("contoh 2: a(t)=4-2t, a(0)=4, a(3)=-2, ā(0-3)=1, a=0 di t=2 dengan v=4, v=0 di t=4 dengan a=-4");
close(72 / 3.6, 20); close(20 / 5, 4); close(0.5 * 4 * 25, 50);
close(-(20 * 20) / (2 * 40), -5); close(20 / 5, 4); close(0.5 * 20 * 4, 40); close(5 / 9.8, 0.51, 5e-3);
ok("contoh 3: 72 km/jam=20 m/s, ā=4, x=50 m; rem a=-5, t=4 s, 40 m, 0,51 g");
close(100 / 3.6 / 10, 2.78, 5e-3); ok("pembanding: 0-100 km/jam dalam 10 s ≈ 2,8 m/s²");

// --- Kuis: integritas
const ids = new Set();
for (const q of QUESTIONS) {
  assert.ok(!ids.has(q.id), "id soal unik: " + q.id); ids.add(q.id);
  assert.equal(q.options.filter((o) => o.correct).length, 1, `${q.id}: tepat satu jawaban benar`);
  assert.equal(q.options.length, 4, `${q.id}: 4 pilihan`);
  for (const o of q.options) {
    assert.ok(o.why && o.why.length > 20, `${q.id}: tiap pilihan punya penjelasan`);
    if (!o.correct) assert.ok(o.tag && MISCONCEPTIONS[o.tag], `${q.id}: pilihan salah harus dipetakan ke miskonsepsi yang ada (${o.tag})`);
    if (o.correct) assert.ok(!o.tag, `${q.id}: jawaban benar tidak bertag`);
  }
}
ok(`kuis: ${QUESTIONS.length} soal, satu jawaban benar, semua pilihan salah terpetakan`);
const core = QUESTIONS.filter((q) => q.core).length;
assert.equal(core, 7); assert.ok(PASS_CORE <= core); ok("7 soal inti, ambang lulus 6");
const pos_ = QUESTIONS.map((q) => q.options.findIndex((o) => o.correct));
assert.ok(new Set(pos_).size >= 3, "posisi jawaban benar bervariasi: " + pos_); ok("posisi jawaban benar bervariasi: " + pos_.join(","));
const used = new Set(QUESTIONS.flatMap((q) => q.options.map((o) => o.tag).filter(Boolean)));
for (const k of Object.keys(MISCONCEPTIONS)) assert.ok(used.has(k), `miskonsepsi ${k} dipakai minimal satu soal`);
ok("semua 9 miskonsepsi diuji oleh minimal satu soal");

// --- Skenario: jawaban yang dinyatakan benar sesuai hitungan
const [s1, s2, s3] = SCENARIOS;
close(vel(s1.motion, 5), 10); assert.equal(s1.choices[s1.answer], "10 m/s");
assert.equal(speedTrend(s2.motion, turnTime(s2.motion)), "berhenti-sesaat"); assert.ok(s2.choices[s2.answer].includes("−9,8"));
close(turnTime(s3.motion), s3.T); assert.equal(s3.choices[s3.answer], "5 s");
for (const s of SCENARIOS) { assert.ok(s.answer >= 0 && s.answer < s.choices.length); }
ok("skenario simulasi: jawaban sesuai perhitungan");
console.log(`content.test: ${n} kelompok uji lulus`);
