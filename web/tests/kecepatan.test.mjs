import assert from "node:assert/strict";
import { pos, vel, turnTime } from "../src/lib/kin.ts";
import { QUESTIONS, MISCONCEPTIONS, SCENARIOS } from "../src/content/kecepatan.ts";
const near = (a, b, e = 1e-9) => assert.ok(Math.abs(a - b) < e, `${a} != ${b}`);

// contoh soal 2: x = t^3 - 6t^2 + 9t
const x = (t) => t ** 3 - 6 * t ** 2 + 9 * t, v = (t) => 3 * t ** 2 - 12 * t + 9;
near(v(0), 9); near(v(2), -3); near(v(1), 0); near(v(3), 0);
near(x(1), 4); near(x(2), 2); near(x(3), 0); near((x(2) - x(0)) / 2, 1); near((x(3) - x(0)) / 3, 0);
near(8 / 3, 2.6667, 1e-3);
// numerik: turunan x ~ v
for (const t of [0.5, 2, 2.7]) near((x(t + 1e-6) - x(t - 1e-6)) / 2e-6, v(t), 1e-4);
// contoh soal 3
near(10000 / 3000 * 3.6, 12, 1e-9); near(72 / (36 / 72 + 36 / 36), 48);
// soal kuis
near((120) / 4, 30); near(90 / 3.6, 25); near(2 * 4, 8); near(3 - 5, -2);
// skenario
const [tetap, pulang, mundur] = SCENARIOS.map((s) => s.motion);
near(pos(tetap, 4), 12);
near(turnTime(pulang), 3); near(pos(pulang, 3), 9); near(pos(pulang, 6), 0);
near(pos(mundur, 5), 0); near(vel(mundur, 3), -4);
// integritas kuis
assert.equal(QUESTIONS.filter((q) => q.core).length, 7);
const used = new Set();
for (const q of QUESTIONS) {
  assert.equal(q.options.length, 4);
  assert.equal(q.options.filter((o) => o.correct).length, 1);
  for (const o of q.options) { assert.ok(o.why.length > 10); if (!o.correct) { assert.ok(MISCONCEPTIONS[o.tag], `${q.id}: tag ${o.tag}`); used.add(o.tag); } else assert.ok(!o.tag); }
}
assert.deepEqual([...used].sort(), Object.keys(MISCONCEPTIONS).sort());
assert.ok(new Set(QUESTIONS.map((q) => q.options.findIndex((o) => o.correct))).size >= 3);
SCENARIOS.forEach((s) => assert.ok(s.answer < s.choices.length));
console.log("kecepatan.test: lulus");
