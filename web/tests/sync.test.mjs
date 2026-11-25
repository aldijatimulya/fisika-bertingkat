// Jalankan: node --experimental-strip-types tests/sync.test.mjs
import assert from "node:assert/strict";
import { mergeStores } from "../src/lib/sync.ts";

// 1. Akun kosong: semua progres lokal diunggah
let r = mergeStores({ a: "kuasai", b: "sebagian" }, {});
assert.deepEqual(r.merged, { a: "kuasai", b: "sebagian" });
assert.deepEqual(r.toPush.map((x) => x.id).sort(), ["a", "b"]);

// 2. Konflik: akun menang, tidak diunggah ulang
r = mergeStores({ a: "belum", b: "kuasai" }, { a: "kuasai" });
assert.equal(r.merged.a, "kuasai");
assert.deepEqual(r.toPush, [{ id: "b", status: "kuasai" }]);

// 3. Hanya ada di akun: ikut ke lokal
r = mergeStores({}, { z: "sebagian" });
assert.deepEqual(r.merged, { z: "sebagian" });
assert.equal(r.toPush.length, 0);

// 4. Tidak mengubah objek masukan
const loc = { a: "kuasai" }; const rem = { b: "sebagian" };
mergeStores(loc, rem);
assert.deepEqual(loc, { a: "kuasai" }); assert.deepEqual(rem, { b: "sebagian" });

console.log("sync.test: 4/4 lulus");
