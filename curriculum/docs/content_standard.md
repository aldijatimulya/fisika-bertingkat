# Content Development Standard (komponen 7)

Standar ini berlaku untuk semua modul. Tujuannya: setiap modul menjawab 9 pertanyaan mahasiswa (Jalan Program, bagian 3) dan tidak pernah menampilkan persamaan tanpa "cerita ilmiahnya".

## 1. Satu modul = satu konsep (satu `concepts.id`)

| # | Bagian | Pertanyaan yang dijawab | Wajib | Sumber data |
|---|---|---|---|---|
| 1 | Fenomena fisik | Mengapa ini terjadi? | ya | teks + media |
| 2 | Pemahaman konsep | Apa yang sebenarnya dipelajari? | ya | teks |
| 3 | Fondasi matematika | Mengapa matematika ini diperlukan? | ya | tautan ke node `m.*` |
| 4 | Derivasi | Dari mana persamaannya? | ya (kecuali definisi/postulat) | `equations` + `equation_steps` |
| 5 | Interpretasi fisis | Apa makna persamaan itu? | ya | `equations.meaning` |
| 6 | Visualisasi/simulasi | Bagaimana jika parameter berubah? | ya untuk L1-L4 | simulasi |
| 7 | Contoh soal | Bagaimana menggunakannya? | ya (3 tingkat) | problem bank |
| 8 | Evaluasi konseptual | Apakah saya benar-benar paham? | ya | assessment |
| 9 | Keterkaitan | Apa hubungannya dengan materi lain? | otomatis | `concept_edges` |

## 2. Aturan derivasi (tidak boleh dilanggar)

1. Setiap langkah punya **alasan tertulis** (kolom `reason`); "dengan demikian" tidak cukup.
2. Setiap derivasi mencantumkan **asumsi** dan **batas keberlakuan** (`validity` wajib terisi). Contoh: `v = v0 + at` hanya untuk percepatan konstan.
3. Label **jenis** persamaan harus jujur:
   - `definisi`: dipilih manusia (v = dx/dt).
   - `hukum`: hasil eksperimen, tidak diturunkan (Hukum II Newton).
   - `postulat`: dasar teori (persamaan Schrodinger). Tampilkan motivasi/heuristik dan nyatakan "bukan derivasi".
   - `turunan`: diturunkan dari persamaan lain yang tercantum di `depends_on`.
   - `aproksimasi`: turunan + pendekatan eksplisit (sin θ ≈ θ).
   - `model`: gagasan semiklasik/teoretis yang bertumpu pada postulat tambahan (model atom Bohr); tuliskan semua postulatnya dan kegagalannya.
4. Derivasi **tidak boleh melompat** ke prasyarat yang belum ada di graf. Jika perlu konsep baru, tambahkan node dan relasinya dahulu.
5. Satu jalur kanonik per persamaan. Jalur alternatif ditulis sebagai bagian "Cara lain" dan tidak masuk `depends_on`.

## 3. Aturan graf konsep

- Relasi prasyarat hanya ke level yang sama atau lebih rendah (divalidasi otomatis oleh `tools/build.py`).
- Tidak boleh ada siklus.
- `derived_from` harus merupakan prasyarat (langsung atau tidak langsung); validator memberi peringatan jika tidak.
- Tambahkan node baru lewat `source/concepts.txt`, lalu jalankan `python3 -I tools/build.py`. Jangan sunting CSV/SQL secara manual.

## 4. Visualisasi dan simulasi

- Setiap simulasi menampilkan **persamaan yang aktif** di samping grafik, dan nilainya ikut berubah ketika parameter diubah.
- Satu simulasi = satu pertanyaan konsep ("apa yang terjadi bila sudut diperbesar?"), diikuti prediksi pengguna sebelum menjalankan simulasi (predict-observe-explain).
- Sertakan keterbatasan model (tanpa drag, sudut kecil, dst.) pada panel simulasi.

## 5. Soal dan evaluasi

- Tiga kategori: **konseptual** (tanpa hitungan), **matematis/derivasi**, **aplikatif** (fenomena nyata).
- Setiap pilihan jawaban salah dipetakan ke satu **miskonsepsi** (`attempts.misconception_tag`) agar analisis kesalahan dan rekomendasi prasyarat bisa otomatis.
- Penguasaan (`user_mastery`) naik hanya jika soal konseptual dijawab benar, bukan hanya soal hitungan.
- Soal ditulis orisinal. Jangan menyalin soal dari buku berhak cipta.

## 6. Referensi dan hak cipta

- Buku adalah **rujukan**, bukan sumber salinan. Materi ditulis ulang dengan kata sendiri dan mencantumkan sitasi (buku, edisi, bab).
- Materi OpenStax (CC BY 4.0) boleh diadaptasi dengan atribusi sesuai lisensi.
- Kolom `chapters_verified` pada `area_references` bernilai `false` sampai bab dicocokkan dengan edisi yang benar-benar dipegang tim.
- Gambar dan simulasi: buat sendiri atau gunakan sumber berlisensi terbuka; jangan memasang gambar dari situs lain.

## 7. Alur peninjauan

`rencana → draf → ditinjau → terbit` (kolom `concepts.status`)

1. **Draf**: penulis mengisi 9 bagian.
2. **Tinjauan fisika**: pakar menguji tiap langkah derivasi, asumsi, dan batas keberlakuan.
3. **Tinjauan pedagogi**: uji ke 3-5 mahasiswa; catat titik mereka macet.
4. **Tinjauan teknis**: rumus tampil benar, simulasi sesuai persamaan.
5. **Terbit**: hanya jika semua langkah di atas lulus.

## 8. Kriteria "selesai" untuk satu modul

- Semua prasyarat langsung sudah berstatus `terbit` atau tertaut.
- Derivasi lengkap dengan asumsi dan batas keberlakuan.
- Minimal 1 simulasi, 3 contoh soal, 5 soal konseptual dengan miskonsepsi terpetakan.
- Lulus tinjauan fisika dan satu uji mahasiswa.
