# Panduan menjalankan Fisika bertingkat

Panduan ini membawa Anda dari nol sampai situs hidup di internet, dengan akun pengguna dan status paham yang tersimpan di Supabase. Waktu yang dibutuhkan sekitar 45 menit pertama kali.

## Gambaran: apa berbicara dengan apa

```
Peramban pengguna  ──►  GitHub Pages (situs statis: HTML/JS dari folder web/)
        │
        └──► Supabase  (login + tabel user_mastery; database juga menyimpan salinan kurikulum)
```

- **Isi pelajaran** (konsep, relasi, derivasi) dibaca dari berkas JSON yang ikut dibangun ke dalam situs. Situs tetap cepat dan tetap bisa dibuka tanpa Supabase.
- **Supabase hanya mengurus pengguna**: login, dan status paham per konsep (`user_mastery`). Tanpa akun, status paham tersimpan di peramban saja.
- **GitHub** menyimpan kode dan membangun serta menerbitkan situs otomatis setiap kali Anda mengunggah perubahan.

## Yang perlu disiapkan

| Kebutuhan | Keterangan |
|---|---|
| Akun GitHub | Gratis. Untuk GitHub Pages di paket gratis, repositori harus **publik**. |
| Akun Supabase | Gratis di supabase.com. |
| Node.js 22 | Hanya untuk menjalankan di komputer sendiri. Cek dengan `node -v`. |
| Git | Untuk mengunggah kode. Cek dengan `git --version`. |
| Python 3 | Hanya jika Anda mengubah kurikulum di komputer sendiri. |

---

## Bagian A. Menyiapkan Supabase

### A1. Buat proyek
1. Masuk ke supabase.com, klik **New project**.
2. Isi nama (mis. `fisika-bertingkat`), buat **Database password** dan simpan di tempat aman, pilih region terdekat (mis. Singapore).
3. Tunggu sampai proyek siap (1-2 menit).

### A2. Buat tabel dan isi kurikulum
Buka **SQL Editor** → **New query**. Jalankan **satu per satu, berurutan**: tempel isi berkas, klik **Run**, tunggu "Success", baru lanjut.

| Urutan | Berkas (di folder `curriculum/supabase/`) | Isi |
|---|---|---|
| 1 | `schema.sql` | Tabel, aturan keamanan (RLS), dan fungsi graf. **Jalankan sekali saja.** |
| 2 | `seed_1_kurikulum.sql` | Tingkat, area, 216 konsep, 477 relasi |
| 3 | `seed_2_pendukung.sql` | Buku acuan, luaran belajar, pemetaan matematika |
| 4 | `seed_3_persamaan.sql` | 30 persamaan dan langkah derivasinya |

Berkas seed aman dijalankan ulang kapan saja.

**Periksa hasilnya.** Buka **Table Editor**: tabel `concepts` harus berisi 216 baris. Atau jalankan di SQL Editor:
```sql
select count(*) from concepts;                -- 216
select * from prerequisite_chain('q.tdse');   -- daftar prasyarat Schrödinger
```

> Jika `schema.sql` menampilkan galat "already exists", berarti sudah pernah dijalankan. Lewati, lanjut ke seed.

### A3. Atur login
Buka **Authentication**.

1. **Sign In / Providers** (atau Providers): pastikan **Email** aktif.
2. **Confirm email**: untuk percobaan boleh dimatikan agar pendaftaran kata sandi langsung masuk. Untuk situs yang dipakai banyak orang, biarkan aktif.
3. **URL Configuration**: isi setelah situs Anda punya alamat (Bagian C). Sementara, isi:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: tambahkan `http://localhost:3000/masuk/`

> **Penting untuk kelas.** Layanan email bawaan Supabase hanya mengirim beberapa email per jam. Bila banyak mahasiswa mendaftar bersamaan, login lewat "Tautan email" akan gagal dengan pesan *rate limit*. Solusinya: (a) pakai tab **Kata sandi** di halaman masuk, atau (b) pasang SMTP sendiri di **Authentication → SMTP Settings** (mis. dari layanan email transaksional).

### A4. Ambil dua nilai yang dibutuhkan aplikasi
Buka **Project Settings → API** (atau **API Keys**). Salin:

| Nilai | Contoh | Dipakai sebagai |
|---|---|---|
| **Project URL** | `https://abcdxyz.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon / publishable key** | `eyJ...` atau `sb_publishable_...` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

> **Jangan pernah** memakai kunci **`service_role`** atau **secret** di proyek ini. Kunci anon/publishable memang publik; data pengguna aman karena aturan RLS di database hanya mengizinkan seseorang membaca dan menulis barisnya sendiri (sudah diuji).

---

## Bagian B. Menjalankan di komputer sendiri

```bash
cd web
cp .env.example .env.local        # Windows PowerShell: Copy-Item .env.example .env.local
```
Buka `web/.env.local`, isi dua nilai dari A4 (biarkan `NEXT_PUBLIC_BASE_PATH` kosong), lalu:

```bash
npm ci
npm run dev
```
Buka http://localhost:3000.

**Periksa:**
1. Beranda tampil dengan contoh derivasi.
2. Menu **Masuk** muncul di kanan atas. Bila tidak muncul, kedua nilai di `.env.local` belum terbaca; hentikan server (Ctrl+C) dan jalankan `npm run dev` lagi.
3. Daftar akun (tab **Kata sandi**, centang "Saya belum punya akun"), lalu masuk.
4. Buka **Jalur belajar**, tandai satu konsep sebagai "Sudah paham". Di header akan tertulis *tersimpan*.
5. Di Supabase → **Table Editor → user_mastery**: baris Anda harus muncul.
6. Muat ulang halaman, atau masuk dari peramban lain: status harus ikut.

Tanpa mengisi `.env.local`, aplikasi tetap jalan dalam **mode lokal** (tanpa tombol Masuk).

---

## Bagian C. Mengunggah ke GitHub dan menerbitkan situs

### C1. Buat repositori
Di github.com klik **New repository**. Beri nama (mis. `fisika-bertingkat`), pilih **Public**, **jangan** centang "Add a README". Klik **Create repository**.

### C2. Unggah kode
Dari folder utama proyek (yang berisi `web/`, `curriculum/`, `PANDUAN.md`):

```bash
git init -b main
git add .
git status                         # pastikan TIDAK ada .env.local atau node_modules di daftar
git commit -m "Versi awal: kurikulum, aplikasi web, integrasi Supabase"
git remote add origin https://github.com/USERNAME/fisika-bertingkat.git
git push -u origin main
```
Ganti `USERNAME` dan nama repo. GitHub akan meminta login; pakai **Personal Access Token** sebagai kata sandi bila diminta.

### C3. Aktifkan GitHub Pages
Di repositori: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### C4. Masukkan nilai Supabase ke GitHub
**Settings → Secrets and variables → Actions → tab Variables → New repository variable**. Buat dua variabel (nama harus persis):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL dari A4 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon/publishable key dari A4 |

### C5. Jalankan build
Buka tab **Actions** → workflow **Deploy ke GitHub Pages** → **Run workflow**. (Setelah ini setiap `git push` ke `main` menjalankannya otomatis.) Workflow memvalidasi kurikulum, menjalankan uji, membangun situs, lalu menerbitkannya. Tunggu hingga kedua langkah (build dan deploy) hijau, sekitar 2-4 menit.

Alamat situs: `https://USERNAME.github.io/fisika-bertingkat/`

### C6. Beri tahu Supabase alamat situs
Kembali ke Supabase → **Authentication → URL Configuration**:
- **Site URL**: `https://USERNAME.github.io/fisika-bertingkat/`
- **Redirect URLs**: tambahkan `https://USERNAME.github.io/fisika-bertingkat/masuk/` (biarkan yang `localhost` tetap ada)

Tanpa langkah ini, tautan di email masuk akan mengarah ke alamat yang salah.

### C7. Uji di situs hidup
Ulangi daftar periksa Bagian B nomor 3-6, kali ini di alamat GitHub Pages.

> Bila nama repositori Anda `USERNAME.github.io`, situs dilayani di akar (`https://USERNAME.github.io/`) dan alamat di C6 menyesuaikan. Workflow mengatur ini otomatis.

---

## Bagian D. Setelah berjalan: mengubah isi

| Yang ingin diubah | Caranya |
|---|---|
| Tambah/ubah konsep, prasyarat | Sunting `curriculum/source/concepts.txt` (format dijelaskan di barisnya) |
| Tambah/ubah derivasi | Sunting `curriculum/source/equations.py` |
| Aturan penulisan modul | `curriculum/docs/content_standard.md` |
| Tampilan | Berkas di `web/src/` |

Alur kerja biasa:

```bash
cd web
npm run sync-data       # validasi kurikulum + salin data ke aplikasi (butuh Python 3)
npm run dev             # lihat hasilnya
git add . && git commit -m "Tambah konsep ..." && git push
```
Validator **menolak** perubahan yang merusak graf (siklus prasyarat, referensi tidak dikenal, derivasi tanpa alasan), dan workflow GitHub menjalankan pemeriksaan yang sama sebelum menerbitkan.

**Wajib bila Anda menambah konsep baru:** jalankan ulang `curriculum/supabase/seed_1_kurikulum.sql` (dan seed lain yang berubah) di SQL Editor Supabase. Tabel `user_mastery` merujuk ke tabel `concepts`; konsep yang belum ada di database membuat penyimpanan status untuk konsep itu gagal (header menampilkan *gagal menyimpan ke akun*).

---

## Pemecahan masalah

| Gejala | Penyebab dan solusi |
|---|---|
| Tombol **Masuk** tidak muncul | Variabel Supabase kosong saat build. Lokal: periksa `.env.local` lalu restart `npm run dev`. GitHub: periksa nama variabel di C4 (persis, huruf besar) lalu jalankan ulang workflow. |
| Workflow gagal di langkah "Validasi dan bangun data kurikulum" | Ada galat di `concepts.txt`/`equations.py`; pesannya menyebut baris/ID yang bermasalah. Jalankan `python3 -I curriculum/tools/build.py` di komputer untuk melihatnya. |
| Situs tampil tanpa gaya atau halaman 404 setelah deploy | **Settings → Pages → Source** belum diatur ke *GitHub Actions*, atau workflow belum selesai. |
| Email tautan masuk tidak datang / "rate limit" | Batas email bawaan Supabase. Pakai tab **Kata sandi**, atau pasang SMTP sendiri (A3). Periksa juga folder spam. |
| Klik tautan email lalu muncul "tautan kedaluwarsa" atau halaman salah | **Site URL / Redirect URLs** belum sesuai alamat situs (C6). Buka tautan di perangkat yang sama dengan yang meminta tautan. |
| "Email atau kata sandi salah" padahal benar | Email belum dikonfirmasi (cek kotak masuk), atau **Confirm email** aktif dan Anda belum mengklik tautannya. |
| Header menulis *gagal menyimpan ke akun* | (1) Konsep baru belum di-seed ke database (lihat Bagian D). (2) `schema.sql` belum dijalankan. (3) Koneksi terputus: data tetap aman di peramban dan dikirim ulang pada perubahan berikutnya. Detail galat ada di tab **Network** peramban, permintaan ke `user_mastery`. |
| Status paham "hilang" setelah keluar | Disengaja: saat keluar, cache lokal dihapus agar tidak terbaca pengguna berikutnya di komputer bersama. Masuk lagi untuk memuatnya dari akun. |
| Proyek Supabase "paused" | Proyek gratis yang lama tidak aktif dijeda otomatis. Buka dashboard dan klik **Restore**. Periksa kebijakan terbaru di halaman harga Supabase. |
| `npm ci` gagal / versi Node salah | Gunakan Node 22 (`node -v`). |

---

## Catatan keamanan dan privasi

- Kunci `anon`/`publishable` boleh publik. **Jangan** menaruh kunci `service_role`/secret, kata sandi database, atau berkas `.env.local` di GitHub. Berkas `.gitignore` sudah mengecualikan `.env*`; tetap periksa `git status` sebelum `git push`.
- Aturan RLS membuat setiap pengguna hanya bisa membaca dan menulis baris `user_mastery` miliknya. Pengunjung tanpa akun hanya bisa membaca kurikulum. Perilaku ini sudah diuji di PostgreSQL.
- Data yang disimpan per pengguna: email dan status paham per konsep. Bila situs dipakai untuk kelas, beri tahu mahasiswa data apa yang disimpan dan untuk apa.

## Apa yang sudah dan belum teruji

**Sudah diuji:** skema dan seed di PostgreSQL 16 (dijalankan dua kali, RLS dua pengguna); logika penggabungan data (4 uji otomatis); alur login-sinkron-hapus-keluar di peramban dengan server Supabase tiruan; build dan navigasi di subpath GitHub Pages; seluruh langkah workflow dijalankan lokal.

**Belum bisa diuji dari sini:** koneksi ke proyek Supabase dan akun GitHub **Anda** (saya tidak punya aksesnya), pengiriman email asli, dan eksekusi workflow di server GitHub. Karena itu ikuti daftar periksa di Bagian B dan C7; bila ada langkah yang tidak sesuai, kirimkan pesan galatnya.

## Langkah pengembangan berikutnya

1. Tes diagnostik yang mengisi `user_mastery` dan `attempts`.
2. Satu modul penuh sebagai teladan (fenomena, simulasi, soal konseptual).
3. Halaman admin/CMS agar dosen bisa menulis modul tanpa menyentuh kode.
