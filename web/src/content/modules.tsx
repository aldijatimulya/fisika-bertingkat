import Link from "next/link";
import type { ReactNode } from "react";
import { Tex } from "@/components/Tex";
import { Simulation } from "@/components/Simulation";
import { Quiz } from "@/components/Quiz";

export type ModuleSection = { key: string; title: string; node: ReactNode };
export type ModuleDef = {
  /** Bagian lain yang disusun otomatis oleh halaman (derivasi, keterkaitan) tetap dipakai; ini hanya sisipan tulisan. */
  fenomena: ReactNode; konsep: ReactNode; matematika: ReactNode; derivasiPengantar: ReactNode; derivasiPenutup: ReactNode;
  interpretasi: ReactNode; simulasi: ReactNode; contoh: ReactNode; evaluasi: ReactNode; keterkaitan: ReactNode;
};

const T = (s: string) => <Tex tex={s} />;
const TB = (s: string) => <Tex tex={s} block />;

function Example({ level, title, children, answer }: { level: string; title: string; children: ReactNode; answer: ReactNode }) {
  return (
    <details className="example">
      <summary><span className="lvl">{level}</span> {title}</summary>
      <div className="ex-body">
        <div>{children}</div>
        <details className="answer"><summary>Lihat pembahasan</summary><div>{answer}</div></details>
      </div>
    </details>
  );
}

export const K_PERCEPATAN: ModuleDef = {
  fenomena: (
    <>
      <p>Lampu lalu lintas berubah hijau, dan sebuah mobil yang tadinya diam mulai bergerak. Beberapa detik kemudian speedometer menunjuk 40 km/jam. Pengemudi merasakan punggungnya didorong ke sandaran jok. Saat lampu berikutnya merah, ia menginjak rem, dan tubuhnya condong ke depan.</p>
      <p>Di sini terjadi tiga hal yang berbeda dan sering tercampur dalam bahasa sehari-hari: mobil <em>bergerak</em>, mobil <em>bergerak cepat</em>, dan mobil <em>kecepatannya sedang berubah</em>. Yang terakhirlah yang dirasakan tubuh. Di jalan tol dengan kecepatan tetap 100 km/jam, penumpang tidak merasa apa pun. Perasaan terdorong atau terlempar hanya datang ketika kecepatan berubah.</p>
      <p>Contoh lain: bola dilempar lurus ke atas. Di puncak lintasan, bola berhenti sesaat. Pertanyaannya, apakah bola yang berhenti itu juga tidak mengalami perubahan apa-apa? Jawaban yang akan kita bangun di modul ini mungkin mengejutkan: di titik itu kecepatannya nol, tetapi kecepatannya sedang berubah paling “biasa” saja, sama seperti di titik lain.</p>
      <p className="ui small muted">Pertanyaan penuntun: apa yang berubah, seberapa cepat perubahannya, dan ke arah mana?</p>
    </>
  ),

  konsep: (
    <>
      <p>Kecepatan menjawab “seberapa cepat posisi berubah”. Percepatan menjawab satu tingkat di atasnya: <strong>seberapa cepat kecepatan berubah</strong>. Karena kecepatan punya arah (di satu dimensi, tanda plus atau minus), percepatan juga punya arah.</p>
      <h3>Percepatan rata-rata dan sesaat</h3>
      <p>Bila kecepatan berubah sebesar {T(String.raw`\Delta v`)} dalam selang waktu {T(String.raw`\Delta t`)}, percepatan rata-ratanya {T(String.raw`\bar a=\Delta v/\Delta t`)}. Mengecilkan selang waktu sampai mendekati nol memberi percepatan sesaat {T(String.raw`a=dv/dt`)}. Keduanya dituliskan lengkap dengan alasannya pada bagian Derivasi di bawah.</p>
      <h3>Arti satuan m/s²</h3>
      <p>Percepatan 3 m/s² berarti kecepatan bertambah 3 m/s <em>setiap sekon</em>. Dari diam: 3 m/s setelah 1 s, 6 m/s setelah 2 s, 9 m/s setelah 3 s. Satuan “meter per sekon per sekon” harus dibaca persis seperti itu.</p>
      <h3>Tanda percepatan dan arti gerak</h3>
      <p>Yang menentukan apakah benda makin cepat atau makin lambat bukan tanda percepatan saja, tetapi <strong>tanda percepatan dibandingkan tanda kecepatan</strong>:</p>
      <table className="tbl">
        <thead><tr><th>Kecepatan v</th><th>Percepatan a</th><th>Yang terjadi pada laju</th></tr></thead>
        <tbody>
          <tr><td>positif</td><td>positif</td><td>bertambah (searah)</td></tr>
          <tr><td>positif</td><td>negatif</td><td>berkurang (berlawanan arah)</td></tr>
          <tr><td>negatif</td><td>negatif</td><td>bertambah (searah, ke arah negatif)</td></tr>
          <tr><td>negatif</td><td>positif</td><td>berkurang (berlawanan arah)</td></tr>
        </tbody>
      </table>
      <p>Jadi “percepatan negatif” tidak otomatis berarti “melambat”. Benda yang bergerak ke arah negatif dengan percepatan negatif justru makin cepat.</p>
      <h3>Dua pasangan yang sering tertukar</h3>
      <ul>
        <li><strong>v = 0 tidak berarti a = 0.</strong> Bola di puncak lintasan: v = 0, tetapi a tetap sekitar −9,8 m/s². Kecepatan hanya sedang melewati nol.</li>
        <li><strong>a = 0 tidak berarti v = 0.</strong> Mobil di jalan tol berkecepatan tetap: a = 0, v ≠ 0.</li>
      </ul>
      <h3>Membaca grafik</h3>
      <ul>
        <li>Pada grafik x–t, <em>kemiringan</em> garis singgung = v.</li>
        <li>Pada grafik v–t, <em>kemiringan</em> garis singgung = a.</li>
        <li>Pada grafik x–t, <em>kelengkungan</em> (cekung ke atas atau ke bawah) menunjukkan tanda a: cekung ke atas berarti a positif, cekung ke bawah berarti a negatif.</li>
      </ul>
    </>
  ),

  matematika: (
    <>
      <p>Percepatan adalah turunan dari kecepatan, dan kecepatan adalah turunan dari posisi. Maka percepatan adalah <strong>turunan kedua</strong> posisi terhadap waktu:</p>
      {TB(String.raw`a=\frac{dv}{dt}=\frac{d}{dt}\!\left(\frac{dx}{dt}\right)=\frac{d^2x}{dt^2}`)}
      <p>Tiga hal dari kalkulus yang dipakai di modul ini:</p>
      <ul>
        <li><strong>Turunan sebagai kemiringan.</strong> Turunan fungsi di satu titik adalah kemiringan garis singgung di titik itu, yaitu batas kemiringan garis sekan ketika dua titik didekatkan (<Link href="/konsep/m.limit/">Limit dan kontinuitas</Link>).</li>
        <li><strong>Aturan dasar.</strong> Turunan konstanta adalah 0, turunan {T("t")} adalah 1, turunan {T("t^2")} adalah {T("2t")}, dan turunan penjumlahan adalah penjumlahan turunan (<Link href="/konsep/m.turunan/">Turunan: definisi, aturan, aturan rantai</Link>).</li>
        <li><strong>Fungsi sebagai deskripsi gerak.</strong> Posisi, kecepatan, dan percepatan sama-sama fungsi waktu, sehingga bisa digambar sebagai grafik (<Link href="/konsep/m.fungsi/">Fungsi, grafik, eksponensial dan logaritma</Link>).</li>
      </ul>
      <p>Contohnya, untuk {T(String.raw`x(t)=3+2t+5t^2`)}: {T(String.raw`v=2+10t`)} dan {T(String.raw`a=10`)}. Konstanta 3 hilang saat diturunkan karena posisi awal tidak mengubah kecepatan, dan 2 hilang pada turunan kedua karena kecepatan awal tidak mengubah percepatan.</p>
    </>
  ),

  derivasiPengantar: (
    <p>Percepatan rata-rata dan sesaat adalah <strong>definisi</strong>: kita memilih mengukur perubahan kecepatan per waktu. Tidak ada yang “dibuktikan”. Yang bisa diturunkan adalah hubungannya dengan posisi, yaitu persamaan ketiga di bawah. Label jenis di tiap buku besar mengikuti itu.</p>
  ),
  derivasiPenutup: (
    <p className="small muted">Catatan keberlakuan: semua persamaan di atas dibatasi gerak satu dimensi. Untuk gerak di bidang atau ruang, percepatan menjadi vektor; lihat <Link href="/konsep/k.vektor2d/">Gerak 2D/3D</Link>. Persamaan yang memuat percepatan <em>konstan</em> sebagai kasus khusus ada di <Link href="/konsep/k.glbb/">Gerak percepatan konstan (GLBB)</Link>.</p>
  ),

  interpretasi: (
    <>
      <h3>Kinematika menjawab “bagaimana”, bukan “mengapa”</h3>
      <p>Percepatan di modul ini hanya <em>mendeskripsikan</em> perubahan kecepatan. Penyebabnya, yaitu gaya dan massa, adalah urusan <Link href="/konsep/d.hukum2/">Hukum II Newton</Link>. Sekarang kita sudah punya sisi gerak dari hubungan itu.</p>
      <h3>Patokan ukuran (untuk mengembangkan intuisi)</h3>
      <ul>
        <li>Percepatan jatuh bebas di dekat permukaan bumi: sekitar 9,8 m/s², sering dibulatkan 10 untuk perkiraan cepat.</li>
        <li>Mobil yang mencapai 100 km/jam dari diam dalam 10 s: {T(String.raw`\bar a\approx 2{,}8\ \text{m/s}^2`)}, atau sekitar 0,28 g.</li>
        <li>Pengereman darurat mobil di jalan kering: kira-kira 6 sampai 9 m/s². Ini perkiraan kasar; nilai nyata bergantung pada ban, jalan, dan kendaraan.</li>
      </ul>
      <h3>Tanda bergantung pada pilihan sumbu</h3>
      <p>Bola yang dilempar ke atas berpercepatan −9,8 m/s² bila sumbu ke atas dipilih positif, dan +9,8 m/s² bila sumbu ke bawah dipilih positif. Fisikanya sama; hanya pencatatannya yang berbeda. Pilih sumbu di awal, lalu konsisten.</p>
      <h3>Batas model</h3>
      <ul>
        <li>Simulasi dan contoh memakai percepatan <em>konstan</em>. Banyak keadaan nyata tidak begitu: mobil yang tancap gas dengan percepatan berubah, atau benda jatuh yang makin terhambat udara.</li>
        <li>Hanya satu dimensi. Gerak melingkar punya percepatan walau lajunya tetap, karena arah kecepatan berubah. Itu bagian dari <Link href="/konsep/k.vektor2d/">gerak 2D/3D</Link>.</li>
      </ul>
    </>
  ),

  simulasi: (
    <>
      <p>Satu pertanyaan untuk simulasi ini: <strong>bagaimana tanda v dan a menentukan apakah benda makin cepat atau makin lambat?</strong> Pilih skenario, tulis prediksi Anda, kunci, baru jalankan. Perhatikan persamaan yang aktif di bawah grafik: angkanya ikut berubah.</p>
      <Simulation />
    </>
  ),

  contoh: (
    <>
      <p>Coba kerjakan sendiri dahulu sebelum membuka pembahasan.</p>
      <Example level="Konseptual" title="Bola di puncak lintasan" answer={
        <>
          <p>Di puncak, <strong>v = 0 tetapi a ≈ −9,8 m/s²</strong> (sumbu ke atas positif). Gaya gravitasi tidak ikut berhenti ketika bola berhenti sesaat, sehingga kecepatan terus berubah: sedikit sebelum puncak v positif kecil, sedikit sesudahnya negatif kecil. Kecepatan melewati nol dengan laju perubahan yang sama seperti titik lain. Bola tidak “diam”, ia hanya berada di satu instan di mana kecepatannya bernilai nol.</p>
          <p>Cek ke simulasi “Lempar ke atas” dan lihat titik berlabel “v = 0”.</p>
        </>
      }>
        <p>Bola dilempar lurus ke atas. Di titik tertinggi, berapa kecepatan dan percepatannya? Jelaskan mengapa percepatannya tidak nol.</p>
      </Example>

      <Example level="Matematis" title="Dari kecepatan ke percepatan" answer={
        <>
          <p>Percepatan sesaat adalah turunan: {T(String.raw`a(t)=\dfrac{dv}{dt}=4-2t\ \text{m/s}^2`)}.</p>
          <ol>
            <li>{T(String.raw`a(0)=4\ \text{m/s}^2`)} dan {T(String.raw`a(3)=4-6=-2\ \text{m/s}^2`)}.</li>
            <li>{T(String.raw`v(0)=0`)}, {T(String.raw`v(3)=12-9=3\ \text{m/s}`)}, sehingga {T(String.raw`\bar a=\dfrac{3-0}{3-0}=1\ \text{m/s}^2`)}. Ini bukan rata-rata dari 4 dan −2; percepatannya berubah-ubah, sehingga rata-rata sejati harus dihitung dari Δv/Δt.</li>
            <li>{T(String.raw`a=0`)} ketika {T(String.raw`t=2\ \text{s}`)}; saat itu {T(String.raw`v=8-4=4\ \text{m/s}`)}, kecepatan maksimum, bukan nol. Contoh a = 0 tetapi v ≠ 0.</li>
            <li>{T(String.raw`v=0`)} ketika {T(String.raw`t(4-t)=0`)}, yaitu {T(String.raw`t=4\ \text{s}`)} (selain {T(String.raw`t=0`)}); saat itu {T(String.raw`a=4-8=-4\ \text{m/s}^2`)}. Contoh v = 0 tetapi a ≠ 0.</li>
          </ol>
        </>
      }>
        <p>Kecepatan sebuah benda: {T(String.raw`v(t)=4t-t^2`)} (m/s, t dalam sekon). Tentukan (1) percepatan sesaat pada t = 0 dan t = 3 s, (2) percepatan rata-rata selama 0 sampai 3 s, (3) saat a = 0 dan nilai v saat itu, (4) saat v = 0 (selain t = 0) dan nilai a saat itu.</p>
      </Example>

      <Example level="Aplikatif" title="Sepeda motor dan pengereman" answer={
        <>
          <p><strong>(a)</strong> 72 km/jam = 72 ÷ 3,6 = 20 m/s. Percepatan rata-rata {T(String.raw`\bar a=\dfrac{20-0}{5}=4\ \text{m/s}^2`)}. Bila percepatan dianggap konstan, jarak = kecepatan rata-rata × waktu = {T(String.raw`\dfrac{0+20}{2}\times5=50\ \text{m}`)}.</p>
          <p><strong>(b)</strong> Pada percepatan konstan, kecepatan rata-ratanya {T(String.raw`(20+0)/2=10\ \text{m/s}`)}. Waktu henti {T(String.raw`t=\dfrac{40}{10}=4\ \text{s}`)}. Percepatan {T(String.raw`a=\dfrac{0-20}{4}=-5\ \text{m/s}^2`)}; tanda negatif karena berlawanan dengan arah gerak. Dibanding g: 5 ÷ 9,8 ≈ 0,51 g. Ini masuk akal terhadap rentang pengereman darurat yang disebut di Interpretasi.</p>
          <p className="small muted">Asumsi: percepatan konstan, lintasan lurus. Pengereman nyata tidak persis konstan, sehingga hasilnya adalah perkiraan.</p>
        </>
      }>
        <p>(a) Sepeda motor dari diam mencapai 72 km/jam dalam 5 s. Berapa percepatan rata-ratanya (m/s²), dan berapa jauh ia berjalan bila percepatannya konstan? (b) Mobil 20 m/s direm hingga berhenti dalam jarak 40 m dengan percepatan konstan. Berapa waktu henti dan percepatannya? Berapa kali g?</p>
      </Example>
    </>
  ),

  evaluasi: (
    <>
      <p>Tujuh soal inti dan satu soal pengayaan. Setiap jawaban salah ditautkan ke satu miskonsepsi tertentu, sehingga hasil akhir menunjukkan <em>pola</em> kesalahan Anda, bukan hanya skor. Status penguasaan hanya disarankan naik bila soal konseptual dijawab benar; Anda yang memutuskan apakah menerapkannya.</p>
      <Quiz conceptId="k.percepatan" />
    </>
  ),

  keterkaitan: (
    <>
      <p><strong>Ke belakang:</strong> percepatan membutuhkan <Link href="/konsep/k.kecepatan/">Kecepatan rata-rata dan sesaat</Link> sebagai prasyarat langsung, dan turunan dari <Link href="/konsep/m.turunan/">Turunan</Link> sebagai alatnya.</p>
      <p><strong>Ke depan:</strong> bila percepatannya konstan, seluruh persamaan gerak diperoleh dengan mengintegralkan sekali dan dua kali (<Link href="/konsep/k.glbb/">GLBB</Link>). Bila gerak berlangsung di bidang atau ruang, percepatan menjadi vektor (<Link href="/konsep/k.vektor2d/">Gerak 2D/3D</Link>). Dan penyebab percepatan dijelaskan oleh <Link href="/konsep/d.hukum2/">Hukum II Newton</Link>.</p>
    </>
  ),
};

export const MODULES: Record<string, ModuleDef> = { "k.percepatan": K_PERCEPATAN };
