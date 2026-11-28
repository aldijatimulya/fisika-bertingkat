# Spesifikasi modul JSON (satu berkas = satu konsep)

Berkas: `web/src/content/modul/<id konsep>.json`. Validasi: `cd web && node tests/modul.test.mjs`. Tipe: `web/src/content/fromJson.tsx` (RawModule). Teladan gaya dan kedalaman: modul Percepatan di `web/src/content/modules.tsx` dan `percepatan.ts`.

## Teks
String biasa = satu paragraf. `$...$` rumus sebaris, `$$...$$` rumus blok (KaTeX; di JSON, garis miring dilipat dua: `"$\\frac{a}{b}$"`).
Id konsep (mis. `k.glbb`) dan id persamaan (mis. `eq.xt`) di dalam teks otomatis menjadi tautan; gunakan itu untuk menaut ke prasyarat dan lanjutan.
Blok selain string: `{"h":"subjudul"}`, `{"ul":["..."]}`, `{"ol":["..."]}`, `{"note":"catatan kecil"}`, `{"table":{"head":["..."],"rows":[["..."]]}}`.

## Kerangka
```json
{
  "id": "k.contoh", "status": "draf",
  "fenomena": [ ... ], "konsep": [ ... ], "matematika": [ ... ], "interpretasi": [ ... ], "keterkaitan": [ ... ],
  "derivasi": { "intro": [ ... ], "extra": [ {"title": "...", "steps": [ {"tex": "...", "why": "alasan tiap langkah"} ], "validity": "batas keberlakuan"} ], "outro": [ ... ] },
  "simulasi": null,
  "contoh": [ {"level": "Konseptual|Matematis|Aplikatif", "title": "...", "problem": [ ... ], "answer": [ ... ]} ],
  "kuis": { "pass": 4, "misconceptions": { "A1": {"title": "...", "fix": "..."} },
            "questions": [ {"id": "q1", "core": true, "prompt": "...", "options": [ {"text": "...", "why": "...", "tag": "A1"}, {"text": "...", "why": "...", "correct": true} ] } ] }
}
```
`simulasi` boleh `null` bila konsep tidak bisa divisualkan dengan jujur; kalau diisi: `{"question":[...], "scenarios":[...], "free":{...}}` dengan skenario gerak 1D `{id,label,motion:{x0,v0,a},T,ask,choices,answer,reveal}` (lihat `percepatan.ts`). Simulasi hanya untuk gerak lurus percepatan konstan.

## Aturan isi (dari docs/content_standard.md)
1. Sembilan bagian terisi; fenomena dibuka dengan situasi nyata; konsep dijelaskan tanpa bergantung pada rumus.
2. Derivasi: tiap langkah beralasan; wajib `validity`. Persamaan yang sudah ada di basis data (`web/src/data/equations.json`, per konsep) otomatis tampil; jangan menyalinnya ke `extra`. Hanya tulis `extra` untuk turunan yang belum ada. Bila konsep memang tak punya derivasi (definisi/gagasan), `intro` harus menjelaskannya dengan kata "definisi", "tidak ada", atau "bukan".
3. Jangan melompat ke prasyarat yang belum ada di graf (cek `directPrereqs` di `knowledge_graph.json`).
4. Tiga contoh soal: Konseptual, Matematis, Aplikatif; angka harus dicek dengan menghitung (jalankan Python), tulis asumsi.
5. Kuis: minimal 5 soal inti (`core: true`), 4 pilihan, tepat satu benar, tiap pilihan salah punya `tag` ke katalog miskonsepsi dan `why`; semua miskonsepsi terpakai; posisi jawaban benar bervariasi; `pass` ≈ 70-85% soal inti. Soal orisinal, bukan salinan buku.
6. Patokan angka dari dunia nyata yang tidak pasti harus ditandai sebagai perkiraan. Jangan mengarang sitasi bab buku.
7. Bahasa Indonesia, sapaan netral, kalimat pendek.
