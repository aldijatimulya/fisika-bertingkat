// Data modul "Percepatan" (k.percepatan): skenario simulasi, kuis, dan katalog miskonsepsi.
import type { Motion } from "@/lib/kin";

export const MISCONCEPTIONS: Record<string, { title: string; fix: string }> = {
  MK1: { title: "Menyamakan kecepatan dengan percepatan", fix: "Kecepatan menjawab 'seberapa cepat posisi berubah' (m/s). Percepatan menjawab 'seberapa cepat kecepatan berubah' (m/s²). Ulangi bagian Konsep." },
  MK2: { title: "Mengira tanda negatif pasti berarti melambat", fix: "Yang menentukan laju bertambah atau berkurang adalah hubungan arah kecepatan dan percepatan: searah → bertambah, berlawanan → berkurang. Coba keempat kasusnya di Simulasi." },
  MK3: { title: "Mengira kecepatan nol berarti percepatan nol", fix: "Kecepatan yang nol sesaat tidak berarti kecepatan berhenti berubah. Jalankan skenario 'Dilempar ke atas' dan perhatikan grafik percepatan di titik tertinggi." },
  MK4: { title: "Mengira percepatan nol berarti benda diam", fix: "Percepatan nol berarti kecepatan tidak berubah. Itu mencakup benda yang bergerak dengan kecepatan tetap yang tidak nol." },
  MK5: { title: "Mengira percepatan hanya ada bila laju berubah", fix: "Percepatan adalah perubahan vektor kecepatan, termasuk perubahan arah. Dibahas penuh di Gerak melingkar." },
  MK6: { title: "Mengira percepatan besar berarti kecepatan besar", fix: "Kecepatan yang besar tetapi konstan memiliki percepatan nol. Percepatan mengukur perubahannya." },
  MK7: { title: "Salah memaknai satuan m/s²", fix: "m/s² dibaca (m/s) per sekon: kecepatan berubah sekian m/s setiap detik, secara penjumlahan (3, 6, 9, ...), bukan perkalian." },
  MK8: { title: "Salah membaca grafik posisi-waktu", fix: "Kemiringan grafik x–t memberi kecepatan; kelengkungan grafik x–t memberi percepatan. Kemiringan grafik v–t memberi percepatan." },
  MK9: { title: "Menghitung v/t, bukan Δv/Δt", fix: "Percepatan = perubahan kecepatan dibagi selang waktu (Δv/Δt), bukan kecepatan akhir dibagi waktu." },
};

export type Option = { text: string; correct?: boolean; tag?: string; why: string };
export type Question = { id: string; core: boolean; prompt: string; options: Option[] };

export const QUESTIONS: Question[] = [
  {
    id: "q1", core: true,
    prompt: "Sebuah benda bergerak lurus ke kiri. Arah kanan dipilih sebagai positif, sehingga v = −5 m/s. Percepatannya a = −2 m/s². Apa yang terjadi pada lajunya?",
    options: [
      { text: "Lajunya berkurang, karena percepatannya negatif.", tag: "MK2", why: "Tanda negatif hanya menyatakan arah (ke kiri). Benda juga bergerak ke kiri, jadi kecepatan dan percepatan searah dan laju bertambah." },
      { text: "Lajunya bertambah, karena kecepatan dan percepatan sama-sama mengarah ke kiri.", correct: true, why: "Searah berarti laju bertambah: kecepatan menjadi −5, −7, −9 m/s pada tiap detik berikutnya." },
      { text: "Lajunya tetap, karena −5 dan −2 saling meniadakan.", tag: "MK1", why: "Kecepatan dan percepatan adalah besaran yang berbeda, tidak saling meniadakan. Percepatan −2 m/s² berarti kecepatan berubah −2 m/s setiap detik." },
      { text: "Benda segera bergerak ke kanan.", tag: "MK2", why: "Benda berbalik arah hanya bila percepatannya berlawanan dengan kecepatan. Di sini keduanya searah." },
    ],
  },
  {
    id: "q2", core: true,
    prompt: "Bola dilempar lurus ke atas. Tepat di titik tertinggi, bagaimana kecepatan dan percepatan bola?",
    options: [
      { text: "Kecepatan nol dan percepatan nol, karena bola berhenti.", tag: "MK3", why: "Jika percepatan nol di puncak, kecepatan akan tetap nol dan bola melayang di sana. Bola justru langsung jatuh, jadi kecepatannya terus berubah." },
      { text: "Kecepatan maksimum dan percepatan nol.", tag: "MK1", why: "Di puncak laju bola justru nol, yaitu yang paling kecil sepanjang lintasan." },
      { text: "Kecepatan nol, dan percepatan tidak terdefinisi karena bola sedang berhenti.", tag: "MK3", why: "Percepatan menggambarkan perubahan kecepatan, bukan nilai kecepatan sesaat. Kecepatan bola tepat melewati nol dari positif ke negatif, jadi perubahannya jelas ada." },
      { text: "Kecepatan nol, dan percepatan sekitar 9,8 m/s² mengarah ke bawah.", correct: true, why: "Gravitasi tetap bekerja, sehingga kecepatan berubah sekitar 9,8 m/s setiap detik ke arah bawah sepanjang lintasan, termasuk di puncak." },
    ],
  },
  {
    id: "q3", core: true,
    prompt: "Sebuah benda memiliki percepatan nol dan tetap nol. Pernyataan mana yang pasti benar?",
    options: [
      { text: "Benda diam di tempatnya.", tag: "MK4", why: "Benda yang bergerak dengan kecepatan tetap juga memiliki percepatan nol." },
      { text: "Laju benda sedang bertambah dengan laju tetap.", tag: "MK1", why: "Laju yang bertambah secara tetap justru berarti ada percepatan konstan yang tidak nol." },
      { text: "Kecepatan benda tidak berubah: benda bisa diam, bisa juga bergerak dengan kecepatan tetap.", correct: true, why: "Percepatan nol berarti kecepatan tidak berubah. Nilai kecepatan itu sendiri boleh nol atau tidak nol." },
      { text: "Laju benda terus mengecil.", tag: "MK2", why: "Laju yang mengecil berarti percepatannya berlawanan dengan kecepatan, jadi tidak nol." },
    ],
  },
  {
    id: "q4", core: true,
    prompt: "Percepatan sebuah benda adalah 3 m/s². Apa artinya?",
    options: [
      { text: "Setiap 1 detik, kecepatan benda berubah 3 m/s dalam arah percepatan.", correct: true, why: "m/s² dibaca (m/s) per sekon: dari diam, kecepatannya menjadi 3, 6, 9 m/s pada 1, 2, 3 detik." },
      { text: "Benda menempuh 3 meter setiap detik.", tag: "MK1", why: "Itu kecepatan 3 m/s. Percepatan adalah perubahan kecepatannya." },
      { text: "Kecepatan benda saat ini 3 m/s.", tag: "MK1", why: "Percepatan tidak memberi tahu kecepatan saat ini, hanya seberapa cepat kecepatan itu berubah." },
      { text: "Kecepatan benda dikalikan 3 setiap detik.", tag: "MK7", why: "Percepatan konstan menambah kecepatan dengan jumlah yang sama tiap detik (3, 6, 9, ...), bukan mengalikannya." },
    ],
  },
  {
    id: "q5", core: true,
    prompt: "Grafik v–t sebuah benda berupa garis lurus dari v = 2 m/s pada t = 0 sampai v = 10 m/s pada t = 4 s. Berapa percepatannya?",
    options: [
      { text: "2,5 m/s²", tag: "MK9", why: "10/4 adalah kecepatan akhir dibagi waktu. Percepatan memerlukan perubahan kecepatan: (10 − 2)/4." },
      { text: "6 m/s²", tag: "MK1", why: "6 m/s adalah kecepatan rata-rata, (2 + 10)/2, dan satuannya m/s, bukan percepatan." },
      { text: "2 m/s²", correct: true, why: "Percepatan = kemiringan grafik v–t = (10 − 2) m/s dibagi 4 s = 2 m/s²." },
      { text: "8 m/s²", tag: "MK9", why: "8 m/s adalah perubahan kecepatannya; belum dibagi selang waktu 4 s." },
    ],
  },
  {
    id: "q6", core: true,
    prompt: "Mobil A melaju lurus dengan kecepatan tetap 30 m/s. Mobil B mulai dari diam, lalu kecepatannya bertambah 3 m/s setiap detik. Mana yang memiliki percepatan lebih besar?",
    options: [
      { text: "Mobil A, karena kecepatannya lebih besar.", tag: "MK6", why: "Kecepatan A besar tetapi tidak berubah, sehingga percepatannya nol." },
      { text: "Mobil B: kecepatannya berubah 3 m/s tiap detik, sedangkan kecepatan A tidak berubah.", correct: true, why: "Percepatan B = 3 m/s², percepatan A = 0." },
      { text: "Sama, karena keduanya sedang bergerak.", tag: "MK1", why: "Bergerak tidak berarti ada percepatan; percepatan hanya ada bila kecepatan berubah." },
      { text: "Tidak bisa dibandingkan karena satuannya berbeda (m/s dan m/s²).", tag: "MK7", why: "Yang dibandingkan adalah percepatan kedua mobil, keduanya dalam m/s²: A = 0 dan B = 3." },
    ],
  },
  {
    id: "q7", core: true,
    prompt: "Grafik posisi–waktu sebuah benda berupa garis lurus miring yang naik. Apa percepatan benda tersebut?",
    options: [
      { text: "Sama dengan kemiringan garis, jadi tidak nol.", tag: "MK8", why: "Kemiringan grafik x–t adalah kecepatan, bukan percepatan." },
      { text: "Konstan dan positif, karena posisinya terus bertambah.", tag: "MK8", why: "Posisi yang bertambah berarti kecepatan positif. Kecepatan konstan berarti percepatan nol." },
      { text: "Tidak bisa ditentukan dari grafik posisi.", tag: "MK8", why: "Bisa: percepatan terlihat dari kelengkungan grafik x–t. Garis lurus tidak melengkung, jadi percepatannya nol." },
      { text: "Nol, karena kemiringan grafik x–t (kecepatan) konstan.", correct: true, why: "Garis lurus berarti kecepatan konstan, sehingga percepatannya nol." },
    ],
  },
  {
    id: "q8", core: false,
    prompt: "Pengayaan. Sebuah mobil melaju dengan laju tetap 60 km/jam melewati tikungan. Apakah mobil memiliki percepatan?",
    options: [
      { text: "Ya, karena arah kecepatannya berubah.", correct: true, why: "Kecepatan adalah vektor: arah yang berubah berarti kecepatan berubah, sehingga ada percepatan walaupun lajunya tetap. Ini dibahas di Gerak melingkar." },
      { text: "Tidak, karena lajunya tetap.", tag: "MK5", why: "Laju tetap tidak cukup. Kecepatan melibatkan arah; percepatan muncul juga ketika hanya arahnya yang berubah." },
      { text: "Tidak, karena mobil tidak berhenti.", tag: "MK4", why: "Bergerak atau tidak bukan penentu percepatan; yang menentukan adalah apakah kecepatan (besar dan arah) berubah." },
      { text: "Ya, tetapi hanya bila rem diinjak.", tag: "MK5", why: "Percepatan tidak memerlukan rem. Perubahan arah saja sudah menimbulkan percepatan." },
    ],
  },
];

export const PASS_CORE = 6; // dari 7 soal inti: ≥6 disarankan "sudah paham", 4-5 "sebagian"

export type Scenario = {
  id: string; label: string; motion: Motion; T: number;
  ask: string; choices: string[]; answer: number; reveal: string; focusTurn?: boolean;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "tambah", label: "Mobil menambah kecepatan", motion: { x0: 0, v0: 0, a: 2 }, T: 10,
    ask: "Benda mulai dari diam dengan percepatan 2 m/s². Berapa kecepatannya setelah 5 detik?",
    choices: ["5 m/s", "10 m/s", "25 m/s"], answer: 1,
    reveal: "v = v₀ + at = 0 + 2·5 = 10 m/s. Angka 25 adalah posisi pada t = 5 s (x = ½·2·5² = 25 m), bukan kecepatan.",
  },
  {
    id: "lempar", label: "Dilempar ke atas", motion: { x0: 0, v0: 15, a: -9.8 }, T: 3.5, focusTurn: true,
    ask: "Bola dilempar ke atas (arah atas positif). Di titik tertinggi, percepatannya…",
    choices: ["nol, karena bola berhenti sesaat", "tetap sekitar −9,8 m/s² (ke bawah)", "bernilai maksimum"], answer: 1,
    reveal: "Pada t ≈ 1,53 s kecepatan tepat nol, tetapi percepatannya tetap −9,8 m/s². Jika percepatannya nol di puncak, bola akan melayang di sana. Tinggi maksimum: v₀²/(2g) ≈ 11,5 m.",
  },
  {
    id: "rem", label: "Mengerem", motion: { x0: 0, v0: 20, a: -4 }, T: 5,
    ask: "Benda bergerak 20 m/s lalu diperlambat dengan percepatan −4 m/s². Kapan benda berhenti?",
    choices: ["4 s", "5 s", "8 s"], answer: 1,
    reveal: "Berhenti saat v = 0: 20 − 4t = 0 → t = 5 s. Simulasi berhenti di sini. Rumus percepatan konstan akan terus 'menarik' benda mundur setelahnya; rem nyata tidak melakukan itu, jadi rumusnya tidak berlaku setelah benda berhenti.",
  },
];

export const FREE: Scenario = {
  id: "bebas", label: "Atur sendiri", motion: { x0: 0, v0: 5, a: -2 }, T: 10,
  ask: "", choices: [], answer: 0, reveal: "",
};
