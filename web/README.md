# web: aplikasi Fisika bertingkat

Next.js (ekspor statis) + Supabase (login dan sinkron status paham). Panduan lengkap ada di `../PANDUAN.md`.

```bash
cp .env.example .env.local   # isi URL dan anon key Supabase (opsional: tanpa ini jalan dalam mode lokal)
npm ci
npm run dev                  # http://localhost:3000
npm test                     # uji logika sinkronisasi
npm run sync-data            # validasi ../curriculum lalu salin data ke src/data/
npm run build                # situs statis di out/
```

Halaman: `/` beranda, `/peta/` peta konsep, `/konsep/<id>/`, `/persamaan/`, `/persamaan/<id>/`, `/jalur/` jalur belajar, `/masuk/` login.

Kode yang paling sering disentuh: `src/lib/data.ts` (graf), `src/lib/sync.ts` + `src/lib/mastery.ts` + `src/lib/supabase.ts` (sinkron), `src/components/Ledger.tsx` (tampilan derivasi).
