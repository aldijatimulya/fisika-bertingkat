# Master Physics Curriculum & Knowledge Framework

Hasil eksekusi tahap 1 dari dokumen "Jalan Program" (Concept-Driven Physics Learning). Seluruh data bersifat **terstruktur dan tervalidasi**, siap dimuat ke Supabase dan dipakai Knowledge Map, Equation Lineage, serta Adaptive Learning Path.

## Isi 7 komponen

| # | Komponen (Jalan Program, dok. 24) | Berkas | Isi |
|---|---|---|---|
| 1 | Master Curriculum Map | `data/levels.csv`, `areas.csv`, `concepts.csv` | 6 level, 35 area, **216 konsep** |
| 2 | Learning Dependency Framework | `data/edges.csv`, `knowledge_graph.json` | **477 relasi**: prerequisite, derived_from, special_case_of, approximation_of, generalized_by, motivated_by |
| 3 | Equation Derivation Database | `data/equations.json`, `equations.csv` | **33 persamaan** (126 langkah, tiap langkah beralasan), irisan Kinematika → Newton → Energi → Osilasi → Lagrange → Maxwell → Relativitas → Bohr/Schrodinger → Termo |
| 4 | Mathematical Foundation Mapping | `data/math_mapping.csv` | Matematika yang dibutuhkan tiap area, langsung/tidak langsung, dihitung otomatis dari graf |
| 5 | Reference & Bibliography | `data/references.csv`, `area_references.csv` | 14 buku, rujukan per area |
| 6 | Learning Outcome Framework | `data/learning_outcomes.csv` | Luaran (Bloom) dan indikator penguasaan per area |
| 7 | Content Development Standard | `docs/content_standard.md` | Template 9 bagian, aturan derivasi, standar simulasi/soal, alur tinjauan |

Tambahan: `supabase/schema.sql` + tiga berkas seed `seed_1_kurikulum.sql`, `seed_2_pendukung.sql`, `seed_3_persamaan.sql` (aman dijalankan ulang; sudah diuji pada PostgreSQL 16 termasuk isolasi RLS antar pengguna), fungsi `prerequisite_chain()` ("Telusuri ke belakang") dan `applied_in()` ("Lihat ke depan"), dan `tools/build.py` (validator graf).

## Cara memakai

```bash
python3 -I tools/build.py          # validasi + regenerasi data/ dan supabase/seed_*.sql
# di Supabase SQL editor: jalankan schema.sql, lalu seed_1, seed_2, seed_3 berurutan
```

Sunting hanya berkas di `source/` (`concepts.txt`, `extra_edges.txt`, `equations.py`, `outcomes.py`, `references.json`), lalu jalankan ulang build. Validator menolak: siklus prasyarat, prasyarat ke level lebih tinggi, referensi tidak dikenal, derivasi tanpa alasan/batas keberlakuan.

## Keputusan dan temuan yang perlu Anda tinjau

1. **Listrik-magnet dasar dan optik dasar ditambahkan di Level 01** (area `EMB`, `OPT`, bertanda `usulan`). Di dokumen awal Level 01 tidak memuatnya, padahal persamaan Maxwell (L02) dan atom (L03) membutuhkannya. Hapus bila sudah Anda anggap tercakup.
2. **Metode matematika fisika (Fourier, PDP, fungsi khusus, variasi, tensor) ditempatkan di Level 02**, bukan Level 00, karena baru dibutuhkan mulai mekanika Lagrange dan elektrodinamika.
3. **Graf cukup padat**: Persamaan Schrodinger bergantung pada 92 konsep prasyarat (transitif), dan atom hidrogen pada 100. Ini wajar sebagai peta ketergantungan, tetapi untuk jalur belajar sebaiknya relasi dibedakan menjadi "wajib" dan "membantu" pada tahap berikutnya.
4. **Persamaan Schrodinger dan Hukum II Newton ditandai jujur** sebagai `postulat` dan `hukum`, bukan turunan. Model Bohr ditandai `model` dengan semua postulat dan kegagalannya.
5. **Nomor bab referensi** hanya `chapters_verified = true` untuk HRW, Taylor, Griffiths (EM dan QM), dan Schroeder. Sisanya (OpenStax, Krane, Hartle, Boas, dst.) masih perlu dicocokkan dengan edisi yang Anda pegang.
6. **Derivasi sudah ditinjau silang** oleh pemeriksa independen; 20 temuan (asumsi hilang, klaim terlalu luas, `depends_on` kurang) sudah diperbaiki. Tetap perlu **tinjauan pakar fisika Anda/dosen** sebelum konten terbit, terutama untuk Level 03-05 yang baru berisi kerangka konsep, belum derivasi.
7. Status semua konsep masih `rencana`; derivasi baru tersedia untuk 33 persamaan inti; modul penuh (Percepatan, Kecepatan) ada di `web/src/content`.

## Langkah berikutnya yang disarankan

1. Tinjau `concepts.txt` (judul dan prasyarat) dan hapus/tambah node sesuai kurikulum program studi Anda.
2. Bangun **MVP aplikasi** di atas data ini: Knowledge Map (Cytoscape.js), halaman modul 9 bagian, Equation Lineage, tes diagnostik.
3. Perluas derivasi dari 30 ke seluruh konsep Level 00-02, lalu tulis modul penuh untuk irisan Kinematika → Newton → Energi.
