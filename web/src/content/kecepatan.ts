// Data modul "Kecepatan rata-rata dan sesaat" (k.kecepatan).
import type { Question, Scenario } from "./percepatan";

export const MISCONCEPTIONS: Record<string, { title: string; fix: string }> = {
  KV1: { title: "Menyamakan jarak tempuh dengan perpindahan", fix: "Jarak adalah panjang seluruh lintasan (selalu ≥ 0). Perpindahan hanya selisih posisi akhir dan awal, dengan arah. Coba skenario 'Pergi lalu kembali' di Simulasi." },
  KV2: { title: "Menyamakan laju rata-rata dengan besar kecepatan rata-rata", fix: "Laju rata-rata = jarak tempuh ÷ waktu. Kecepatan rata-rata = perpindahan ÷ waktu. Bila benda berbalik arah, keduanya berbeda." },
  KV3: { title: "Mengira tanda negatif berarti lebih lambat atau lebih kecil", fix: "Tanda hanya menyatakan arah terhadap sumbu yang dipilih. Laju ditentukan oleh besarnya: |−3| m/s lebih cepat daripada +2 m/s." },
  KV4: { title: "Menganggap kecepatan rata-rata = rata-rata kedua kecepatan", fix: "Kecepatan rata-rata = total perpindahan ÷ total waktu. Rata-rata dua kecepatan hanya benar bila selang waktunya sama." },
  KV5: { title: "Salah membaca grafik posisi-waktu", fix: "Kecepatan adalah kemiringan grafik x–t, bukan tinggi grafik. Garis lurus miring berarti kecepatan tetap, bukan nol dan bukan bertambah." },
  KV6: { title: "Menyamakan kecepatan sesaat dengan x/t", fix: "x/t hanya kecepatan rata-rata sejak t = 0. Kecepatan sesaat adalah turunan dx/dt pada saat itu." },
  KV7: { title: "Salah konversi km/jam ↔ m/s", fix: "1 m/s = 3,6 km/jam. Dari km/jam ke m/s dibagi 3,6; dari m/s ke km/jam dikali 3,6." },
};

const o = (text: string, why: string, tag?: string, correct?: boolean) => ({ text, why, ...(tag ? { tag } : {}), ...(correct ? { correct } : {}) });

export const QUESTIONS: Question[] = [
  { id: "q1", core: true,
    prompt: "Seorang pelari mengitari lintasan 400 m dan kembali ke titik awal setelah 80 s. Berapa kecepatan rata-ratanya?",
    options: [
      o("5 m/s, karena itu laju rata-ratanya.", "5 m/s adalah laju rata-rata (jarak ÷ waktu). Kecepatan rata-rata memakai perpindahan, yaitu nol karena kembali ke titik awal.", "KV2"),
      o("0 m/s", "Perpindahan nol (posisi akhir = posisi awal), sehingga kecepatan rata-rata nol walau pelari terus bergerak.", undefined, true),
      o("−5 m/s, karena ia kembali ke arah semula.", "Kembali ke titik awal membuat perpindahan nol, bukan negatif. Tanda negatif tidak muncul karena 'kembali'.", "KV3"),
      o("5 m/s, karena perpindahannya sama dengan jarak yang ditempuh.", "Perpindahan dan jarak berbeda: jarak 400 m, perpindahan 0.", "KV1"),
    ] },
  { id: "q2", core: true,
    prompt: "Mobil menempuh 60 km dengan 60 km/jam (1 jam), lalu 60 km dengan 20 km/jam (3 jam), searah. Kecepatan rata-rata seluruh perjalanan?",
    options: [
      o("40 km/jam, rata-rata dari 60 dan 20.", "Rata-rata dua kecepatan hanya benar bila selang waktunya sama. Di sini waktunya 1 jam dan 3 jam.", "KV4"),
      o("60 km/jam, kecepatan awalnya.", "Kecepatan di satu bagian bukan kecepatan rata-rata seluruh perjalanan.", "KV6"),
      o("20 km/jam, karena bagian terlama.", "Bagian terlama berpengaruh besar tetapi bukan satu-satunya: harus dihitung total perpindahan ÷ total waktu.", "KV6"),
      o("30 km/jam", "Total perpindahan 120 km, total waktu 4 jam: 120 ÷ 4 = 30 km/jam.", undefined, true),
    ] },
  { id: "q3", core: true,
    prompt: "Grafik posisi–waktu sebuah benda berupa garis lurus miring naik dengan kemiringan 2 m/s. Apa yang benar tentang kecepatannya?",
    options: [
      o("Bertambah terus, karena grafiknya naik.", "Grafik x–t yang naik berarti posisi bertambah, bukan kecepatan bertambah. Kecepatan adalah kemiringannya.", "KV5"),
      o("Sama dengan posisi pada saat itu.", "Kecepatan bukan tinggi grafik, melainkan kemiringannya.", "KV5"),
      o("Tetap 2 m/s.", "Kemiringan tetap berarti kecepatan tetap, nilainya 2 m/s.", undefined, true),
      o("Nol, karena grafiknya lurus.", "Garis lurus berarti kemiringan tetap. Hanya garis mendatar yang berarti kecepatan nol.", "KV5"),
    ] },
  { id: "q4", core: true,
    prompt: "Benda A berkecepatan −3 m/s dan benda B +2 m/s (sumbu yang sama). Mana yang lajunya lebih besar?",
    options: [
      o("A: lajunya 3 m/s, lebih besar daripada 2 m/s.", "Laju adalah besar kecepatan; tanda hanya menunjukkan arah.", undefined, true),
      o("B, karena 2 lebih besar daripada −3.", "Itu membandingkan bilangan bertanda. Yang ditanya laju, yaitu besarnya.", "KV3"),
      o("Sama, karena tanda saling menyamakan.", "Besarnya 3 dan 2, tidak sama.", "KV3"),
      o("Tidak dapat dibandingkan karena arahnya berbeda.", "Laju bisa dibandingkan; arah tidak memengaruhinya.", "KV3"),
    ] },
  { id: "q5", core: true,
    prompt: "Sebuah sepeda motor melaju 90 km/jam. Berapa m/s?",
    options: [
      o("324 m/s", "Anda mengalikan dengan 3,6. Dari km/jam ke m/s, bagi 3,6.", "KV7"),
      o("1,5 m/s", "Itu membagi dengan 60. 1 km/jam = 1000 m ÷ 3600 s ≈ 0,278 m/s.", "KV7"),
      o("25 m/s", "90 ÷ 3,6 = 25 m/s.", undefined, true),
      o("90 m/s", "Angkanya tidak berubah hanya bila satuan dilupakan. Konversi wajib dilakukan.", "KV7"),
    ] },
  { id: "q6", core: true,
    prompt: "Posisi sebuah benda x(t) = t² (m, t dalam s). Berapa kecepatan sesaatnya pada t = 4 s?",
    options: [
      o("4 m/s, yaitu x/t = 16/4.", "x/t adalah kecepatan rata-rata sejak t = 0. Kecepatan sesaat adalah dx/dt = 2t.", "KV6"),
      o("8 m/s", "v = dx/dt = 2t, sehingga v(4) = 8 m/s.", undefined, true),
      o("16 m/s, yaitu posisi pada t = 4.", "16 adalah posisi (m), bukan kecepatan.", "KV6"),
      o("2 m/s, koefisien t.", "2 adalah faktor dalam v = 2t; nilainya bergantung pada t.", "KV6"),
    ] },
  { id: "q7", core: true,
    prompt: "Benda bergerak 3 m ke kanan lalu 5 m ke kiri. Berapa perpindahannya?",
    options: [
      o("8 m ke kiri", "8 m adalah jarak tempuh, dan arahnya tidak tunggal.", "KV1"),
      o("2 m ke kanan", "Posisi akhir berada di sebelah kiri titik awal.", "KV3"),
      o("5 m ke kiri", "5 m hanya bagian terakhir. Perpindahan = posisi akhir − posisi awal = 3 − 5 = −2.", "KV1"),
      o("2 m ke kiri", "x akhir − x awal = (3 − 5) − 0 = −2 m: 2 m ke kiri.", undefined, true),
    ] },
  { id: "q8", core: false,
    prompt: "Pengayaan: benda bergerak 10 m ke kanan lalu 10 m ke kiri dalam 10 s. Berapa laju rata-rata dan kecepatan rata-ratanya?",
    options: [
      o("0 dan 0", "Laju rata-rata memakai jarak 20 m, bukan nol.", "KV2"),
      o("2 m/s dan 0", "Laju rata-rata = 20/10 = 2 m/s; kecepatan rata-rata = 0/10 = 0.", undefined, true),
      o("2 m/s dan 2 m/s", "Perpindahan total nol, sehingga kecepatan rata-rata nol.", "KV2"),
      o("0 dan 2 m/s", "Terbalik: yang nol adalah kecepatan rata-rata, bukan laju.", "KV2"),
    ] },
];

export const PASS_CORE = 6;

export const SCENARIOS: Scenario[] = [
  { id: "tetap", label: "Kecepatan tetap", motion: { x0: 0, v0: 3, a: 0 }, T: 10,
    ask: "Benda bergerak 3 m/s dengan kecepatan tetap dari x = 0. Posisinya setelah 4 s?",
    choices: ["3 m", "12 m", "7 m"], answer: 1,
    reveal: "x = x₀ + vt = 0 + 3·4 = 12 m. Grafik x–t berupa garis lurus dan kemiringannya 3 m/s, yaitu kecepatannya." },
  { id: "pulang", label: "Pergi lalu kembali", motion: { x0: 0, v0: 6, a: -2 }, T: 6, focusTurn: true,
    ask: "Benda bergerak dan berbalik arah. Setelah 6 s kembali ke x = 0. Berapa perpindahan dan jarak tempuhnya?",
    choices: ["perpindahan 0, jarak 18 m", "perpindahan 18 m, jarak 18 m", "perpindahan 0, jarak 0"], answer: 0,
    reveal: "x(6) = 0, jadi perpindahan 0 dan kecepatan rata-rata 0. Benda berbalik di t = 3 s pada x = 9 m, sehingga jarak = 9 + 9 = 18 m dan laju rata-rata 3 m/s." },
  { id: "mundur", label: "Bergerak mundur", motion: { x0: 20, v0: -4, a: 0 }, T: 10,
    ask: "Benda di x = 20 m dengan v = −4 m/s. Apa arti tanda minus?",
    choices: ["benda diam", "benda bergerak ke arah x yang mengecil", "benda melambat"], answer: 1,
    reveal: "Tanda minus hanya arah: posisi turun 4 m tiap sekon (x = 20 − 4t), melewati x = 0 pada t = 5 s lalu menjadi negatif. Lajunya tetap 4 m/s." },
];

export const FREE: Scenario = { id: "bebas", label: "Atur sendiri", motion: { x0: 0, v0: 3, a: 0 }, T: 10, ask: "", choices: [], answer: 0, reveal: "" };
