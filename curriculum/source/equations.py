# Equation Derivation Database - irisan awal: Kinematika -> Newton -> Energi/Momentum -> Osilasi
# -> Lagrange -> Maxwell/gelombang EM -> Relativitas -> Bohr/Schrodinger -> Termo/Kinetik.
# kind: definisi | turunan | hukum (empiris) | postulat | aproksimasi | model
# steps: (latex, alasan). Setiap langkah wajib punya alasan eksplisit.

E = []

def eq(id, concept, title, latex, kind, depends, assumptions, validity, steps, meaning, applied):
    E.append(dict(id=id, concept=concept, title=title, latex=latex, kind=kind,
                  depends_on=depends, assumptions=assumptions, validity=validity,
                  steps=[dict(latex=l, why=w) for l, w in steps],
                  meaning=meaning, applied_in=applied))

eq("eq.vel_avg", "k.kecepatan", "Kecepatan rata-rata", r"\bar v = \frac{\Delta x}{\Delta t} = \frac{x_2 - x_1}{t_2 - t_1}", "definisi", [],
   ["Posisi x(t) diketahui pada dua saat t1 dan t2", "Gerak satu dimensi; arah dinyatakan dengan tanda"],
   "Selang waktu berhingga. Hanya memuat posisi awal dan akhir: tidak memberi tahu apa yang terjadi di antaranya (benda bisa berbalik arah), dan tidak sama dengan laju rata-rata (jarak tempuh dibagi waktu).",
   [(r"x_1 = x(t_1),\quad x_2 = x(t_2)", "Ambil posisi pada dua saat yang berbeda."),
    (r"\Delta x = x_2 - x_1,\quad \Delta t = t_2 - t_1", "Hitung perpindahan (bukan jarak tempuh) dan selang waktu; tanda Delta x membawa informasi arah."),
    (r"\bar v = \frac{\Delta x}{\Delta t}", "Definisi: perpindahan per satuan waktu. Satuannya m/s. Secara grafik, ini kemiringan garis sekan yang menghubungkan dua titik pada grafik x-t.")],
   "Kecepatan rata-rata bisa nol walau benda bergerak (pergi lalu kembali ke titik awal); laju rata-rata tidak bisa nol bila benda bergerak.", ["k.percepatan"])

eq("eq.vel", "k.kecepatan", "Kecepatan sesaat", r"v = \frac{dx}{dt}", "definisi", [],
   ["Posisi x(t) fungsi kontinu dan terdiferensialkan"], "Gerak 1D; berlaku umum pada mekanika klasik.",
   [(r"\bar v = \frac{\Delta x}{\Delta t}", "Kecepatan rata-rata didefinisikan sebagai perpindahan per selang waktu."),
    (r"v = \lim_{\Delta t \to 0} \frac{x(t+\Delta t)-x(t)}{\Delta t}", "Kecepatan sesaat adalah limit kecepatan rata-rata saat selang waktu menuju nol (konsep limit)."),
    (r"v = \frac{dx}{dt}", "Limit tersebut adalah definisi turunan x terhadap t.")],
   "Laju perubahan posisi terhadap waktu; tanda menunjukkan arah.", ["k.percepatan", "k.vektor2d"])


eq("eq.acc", "k.percepatan", "Percepatan sesaat", r"a = \frac{dv}{dt} = \frac{d^2x}{dt^2}", "definisi", ["eq.vel"],
   ["v(t) terdiferensialkan"], "Gerak 1D; versi vektor berlaku per komponen.",
   [(r"\bar a = \frac{\Delta v}{\Delta t}", "Analog dengan kecepatan rata-rata, tetapi untuk perubahan kecepatan."),
    (r"a = \lim_{\Delta t \to 0}\frac{\Delta v}{\Delta t} = \frac{dv}{dt}", "Limit, sama seperti definisi kecepatan sesaat."),
    (r"a = \frac{d}{dt}\left(\frac{dx}{dt}\right) = \frac{d^2x}{dt^2}", "Substitusi v = dx/dt dari eq.vel.")],
   "Seberapa cepat kecepatan berubah; nol bila kecepatan konstan.", ["k.glbb", "d.hukum2"])

eq("eq.vt", "k.glbb", "Kecepatan pada percepatan konstan", r"v = v_0 + at", "turunan", ["eq.acc"],
   ["a konstan terhadap waktu"], "Hanya untuk percepatan KONSTAN; kerangka inersial; mekanika Newton.",
   [(r"\frac{dv}{dt} = a", "Mulai dari definisi percepatan (eq.acc)."),
    (r"dv = a\,dt", "Pisahkan variabel."),
    (r"\int_{v_0}^{v} dv' = a\int_0^t dt'", "Integrasikan kedua sisi; a konstan sehingga keluar dari integral."),
    (r"v - v_0 = at \;\Rightarrow\; v = v_0 + at", "Hitung integral tentu.")],
   "Kecepatan berubah linear terhadap waktu bila percepatan tetap.", ["k.jatuhbebas", "k.proyektil"])

eq("eq.xt", "k.glbb", "Posisi pada percepatan konstan", r"x = x_0 + v_0 t + \tfrac12 a t^2", "turunan", ["eq.vel", "eq.vt"],
   ["a konstan"], "Hanya untuk percepatan konstan.",
   [(r"\frac{dx}{dt} = v_0 + at", "Gunakan v(t) dari eq.vt pada definisi kecepatan (eq.vel)."),
    (r"\int_{x_0}^{x} dx' = \int_0^t (v_0 + at')\,dt'", "Pisahkan variabel dan integrasikan."),
    (r"x - x_0 = v_0 t + \tfrac12 a t^2", "Hitung integral tentu.")],
   "Luas di bawah grafik v-t adalah perpindahan.", ["k.proyektil"])

eq("eq.v2", "k.glbb", "Hubungan kecepatan-posisi (tanpa waktu)", r"v^2 = v_0^2 + 2a(x-x_0)", "turunan", ["eq.acc"],
   ["a konstan"], "Hanya untuk percepatan konstan.",
   [(r"a = \frac{dv}{dt} = \frac{dv}{dx}\frac{dx}{dt} = v\frac{dv}{dx}", "Aturan rantai: ganti variabel bebas dari t ke x."),
    (r"a\,dx = v\,dv", "Pisahkan variabel."),
    (r"a(x-x_0) = \tfrac12 (v^2 - v_0^2)", "Integrasikan; a konstan."),
    (r"v^2 = v_0^2 + 2a(x-x_0)", "Susun ulang.")],
   "Berguna bila waktu tidak diketahui; juga bibit teorema usaha-energi.", ["e.ek"])

eq("eq.acc_avg", "k.percepatan", "Percepatan rata-rata", r"\bar a = \frac{\Delta v}{\Delta t} = \frac{v_2 - v_1}{t_2 - t_1}", "definisi", [],
   ["Kecepatan v(t) diketahui pada dua saat t1 dan t2"], "Selang waktu berhingga. Hasilnya hanya menggambarkan perubahan kecepatan rata-rata; percepatan sesungguhnya di setiap saat bisa berbeda-beda.",
   [(r"v_1 = v(t_1),\quad v_2 = v(t_2)", "Ambil kecepatan pada dua saat yang berbeda."),
    (r"\Delta v = v_2 - v_1,\quad \Delta t = t_2 - t_1", "Hitung perubahan kecepatan dan selang waktunya; tanda Delta v membawa informasi arah."),
    (r"\bar a = \frac{\Delta v}{\Delta t}", "Definisi: perubahan kecepatan per satuan waktu. Satuannya (m/s)/s = m/s^2.")],
   "Sama seperti kemiringan garis yang menghubungkan dua titik pada grafik v-t.", ["k.glbb"])

eq("eq.acc_from_x", "k.percepatan", "Percepatan dari fungsi posisi kuadratik", r"x=x_0+v_0t+\tfrac12at^2\ \Rightarrow\ \frac{d^2x}{dt^2}=a", "turunan", ["eq.vel", "eq.acc", "eq.xt"],
   ["Posisi berbentuk x(t) = x0 + v0 t + (1/2) a t^2 dengan x0, v0, a konstan"], "Hanya memeriksa konsistensi untuk percepatan konstan; fungsi posisi lain memberi percepatan lain.",
   [(r"x(t)=x_0+v_0t+\tfrac12at^2", "Fungsi posisi gerak dengan percepatan konstan (eq.xt)."),
    (r"v=\frac{dx}{dt}=0+v_0\cdot1+\tfrac12a\cdot2t=v_0+at", "Turunkan suku demi suku (eq.vel): turunan konstanta = 0, turunan t = 1, turunan t^2 = 2t."),
    (r"a=\frac{dv}{dt}=0+a=a", "Turunkan sekali lagi (eq.acc): v0 konstan sehingga turunannya 0, turunan a t terhadap t adalah a."),
    (r"\frac{d^2x}{dt^2}=a", "Hasilnya a, sama dengan percepatan yang dipakai membangun x(t): konsisten.")],
   "Menegaskan bahwa percepatan adalah turunan kedua posisi: kelengkungan grafik x-t.", ["k.glbb"])

eq("eq.range", "k.proyektil", "Jangkauan proyektil", r"R = \frac{v_0^2 \sin 2\theta}{g}", "turunan", ["eq.xt", "eq.vt"],
   ["Tanpa hambatan udara", "g konstan", "Permukaan datar, ketinggian awal = akhir", "Bumi diperlakukan datar"],
   "Jangkauan kecil dibanding jari-jari Bumi; tanpa drag.",
   [(r"x = v_0\cos\theta\, t", "Komponen horizontal: a_x = 0, gunakan eq.xt."),
    (r"y = v_0\sin\theta\, t - \tfrac12 g t^2", "Komponen vertikal: a_y = -g, gunakan eq.xt."),
    (r"y=0 \Rightarrow t = \frac{2 v_0 \sin\theta}{g}", "Waktu terbang: y = 0 punya dua akar (t = 0 adalah titik awal); ambil akar nontrivial."),
    (r"R = v_0\cos\theta \cdot \frac{2v_0\sin\theta}{g} = \frac{v_0^2 \sin 2\theta}{g}", "Substitusi t ke x dan gunakan 2 sin cos = sin 2theta.")],
   "Jangkauan maksimum pada sudut 45 derajat (hanya dalam kondisi asumsi di atas).", [])

eq("eq.ac", "k.melingkar", "Percepatan sentripetal", r"a_c = \frac{v^2}{r}", "turunan", ["eq.vel", "eq.acc"],
   ["Lintasan lingkaran jari-jari r", "Laju sudut omega konstan"], "Derivasi ini untuk gerak melingkar beraturan. Untuk omega tidak konstan, komponen radial tetap -v^2/r tetapi ada tambahan percepatan tangensial.",
   [(r"\vec r(t) = r(\cos\omega t,\ \sin\omega t)", "Parametrisasi lingkaran dengan laju sudut konstan."),
    (r"\vec v = \frac{d\vec r}{dt} = r\omega(-\sin\omega t,\ \cos\omega t)", "Turunan pertama (kecepatan); besarnya v = r omega."),
    (r"\vec a = \frac{d\vec v}{dt} = -\omega^2 \vec r", "Turunan kedua: percepatan berlawanan arah vektor posisi, yaitu menuju pusat."),
    (r"a = \omega^2 r = \frac{v^2}{r}", "Besar a, dengan v = omega r.")],
   "Percepatan ada walaupun laju tetap, karena ARAH kecepatan berubah.", ["d.dinamika_melingkar", "g.newton"])

eq("eq.newton2", "d.hukum2", "Hukum II Newton", r"\sum \vec F = \frac{d\vec p}{dt} = m\vec a", "hukum", ["eq.acc"],
   ["Kerangka inersial", "Massa konstan (untuk bentuk F = ma)"],
   "Kerangka inersial; skala makroskopik (bukan kuantum). F = dp/dt tetap berlaku secara relativistik dengan p = gamma m v; bentuk F = ma hanya untuk m konstan dan v << c. Bukan hasil derivasi - ini hukum empiris.",
   [(r"\vec p = m\vec v", "Definisi momentum linear."),
    (r"\sum\vec F = \frac{d\vec p}{dt}", "Pernyataan hukum: gaya total menentukan laju perubahan momentum (didukung eksperimen)."),
    (r"\sum\vec F = m\frac{d\vec v}{dt} = m\vec a", "Bila m konstan, m keluar dari turunan.")],
   "Gaya total adalah penyebab perubahan gerak (percepatan).", ["p.momentum", "e.ek", "o.shm"])

eq("eq.work", "e.kerja", "Usaha oleh gaya", r"W = \int_{\vec r_1}^{\vec r_2} \vec F \cdot d\vec r", "definisi", [],
   ["Lintasan terdefinisi"], "Berlaku umum dalam mekanika klasik.",
   [(r"W = F\,\Delta x \quad (F\ \text{konstan, searah gerak})", "Kasus paling sederhana sebagai intuisi."),
    (r"dW = \vec F\cdot d\vec r", "Untuk perpindahan sangat kecil, gaya dianggap konstan (perkalian titik menangkap komponen searah gerak)."),
    (r"W = \int \vec F\cdot d\vec r", "Jumlahkan seluruh kontribusi sepanjang lintasan (integral garis).")],
   "Besaran skalar yang mengukur transfer energi lewat gaya.", ["e.ek", "e.ep"])

eq("eq.wke", "e.ek", "Teorema usaha-energi kinetik", r"W_{net} = \Delta K, \quad K=\tfrac12 mv^2", "turunan", ["eq.newton2", "eq.work"],
   ["Massa konstan", "Kerangka inersial"], "Mekanika Newton (v << c). Gambaran 1D; 3D identik dengan perkalian titik.",
   [(r"W_{net} = \int F\,dx = \int m\frac{dv}{dt}\,dx", "Substitusi F = ma = m dv/dt (eq.newton2)."),
    (r"dx = v\,dt \Rightarrow W_{net} = \int m v\,dv", "Ganti dx dengan v dt sehingga variabel integrasi menjadi v."),
    (r"W_{net} = \tfrac12 m v_f^2 - \tfrac12 m v_i^2", "Hitung integral; m konstan."),
    (r"K \equiv \tfrac12 mv^2 \Rightarrow W_{net}=\Delta K", "Definisikan energi kinetik.")],
   "Usaha total menjadi perubahan energi kinetik.", ["e.kekekalan", "f.bernoulli"])

eq("eq.pe", "e.ep", "Energi potensial dari gaya konservatif", r"\Delta U = -W_c, \quad F=-\frac{dU}{dx}", "definisi", ["eq.work"],
   ["Usaha tidak bergantung lintasan (gaya konservatif)", "F hanya fungsi posisi (tidak bergantung kecepatan atau waktu)", "U ditentukan sampai konstanta aditif; titik acuan bebas dipilih"], "Hanya untuk gaya konservatif (gesekan tidak punya U).",
   [(r"W_c \text{ tidak bergantung lintasan}", "Ini definisi gaya konservatif; membuat U fungsi posisi saja."),
    (r"\Delta U \equiv -W_c = -\int F\,dx", "Definisi perubahan energi potensial."),
    (r"F = -\frac{dU}{dx}", "Turunkan kedua sisi terhadap x (teorema fundamental kalkulus).")],
   "U menyimpan kemampuan gaya konservatif untuk melakukan usaha.", ["e.kekekalan"])

eq("eq.mechE", "e.kekekalan", "Kekekalan energi mekanik", r"K + U = \text{konstan}", "turunan", ["eq.wke", "eq.pe"],
   ["Semua gaya yang melakukan usaha adalah konservatif (W_nc = 0)"], "Berlaku bila usaha gaya nonkonservatif nol. Gaya yang tegak lurus gerak (normal, tegangan tali) boleh ada; gesekan kinetik mengubah energi mekanik menjadi kalor.",
   [(r"W_{net} = W_c = \Delta K", "Teorema usaha-energi (eq.wke) dengan hanya gaya konservatif."),
    (r"W_c = -\Delta U", "Definisi energi potensial (eq.pe)."),
    (r"\Delta K = -\Delta U \Rightarrow \Delta(K+U)=0", "Gabungkan kedua persamaan.")],
   "Energi berubah bentuk tetapi totalnya tetap, dalam batas asumsi.", ["o.energi", "g.orbit"])

eq("eq.impulse", "p.momentum", "Teorema impuls-momentum", r"\vec J = \int \vec F\,dt = \Delta\vec p", "turunan", ["eq.newton2"],
   ["Hukum II Newton dalam bentuk F = dp/dt"], "Kerangka inersial; berlaku juga untuk gaya yang berubah terhadap waktu.",
   [(r"\vec F = \frac{d\vec p}{dt}", "Hukum II Newton (eq.newton2)."),
    (r"\int_{t_1}^{t_2} \vec F\,dt = \int_{\vec p_1}^{\vec p_2} d\vec p", "Integrasikan terhadap waktu."),
    (r"\vec J = \Delta\vec p", "Hitung; ruas kiri didefinisikan sebagai impuls.")],
   "Gaya yang bekerja selama selang waktu mengubah momentum.", ["p.tumbukan"])

eq("eq.pcons", "p.kekekalan", "Kekekalan momentum linear", r"\sum\vec p = \text{konstan}\ (\vec F_{ext}=0)", "turunan", ["eq.newton2"],
   ["Gaya eksternal total nol", "Gaya internal mematuhi Hukum III Newton", "Derivasi untuk dua partikel; N partikel dengan menjumlahkan semua pasangan"], "Kerangka inersial. Bila medan (mis. EM antar muatan bergerak) membawa momentum, yang kekal adalah momentum partikel + medan.",
   [(r"\frac{d\vec p_1}{dt}=\vec F_{12},\quad \frac{d\vec p_2}{dt}=\vec F_{21}", "Hukum II Newton untuk tiap partikel; hanya gaya internal."),
    (r"\vec F_{12} = -\vec F_{21}", "Hukum III Newton."),
    (r"\frac{d}{dt}(\vec p_1+\vec p_2)=0", "Jumlahkan; gaya internal saling meniadakan.")],
   "Gaya internal tidak mengubah momentum total.", ["p.tumbukan", "sr.momenergi"])

eq("eq.shm", "o.shm", "Solusi osilasi harmonik sederhana", r"x(t)=A\cos(\omega t+\varphi),\ \omega=\sqrt{k/m}", "turunan", ["eq.newton2", "eq.pe"],
   ["Gaya pemulih linear F = -kx", "Tanpa redaman"], "Hanya untuk simpangan kecil di sekitar kesetimbangan (gaya linear).",
   [(r"m\ddot x = -kx", "Hukum II Newton dengan gaya pegas (Hooke)."),
    (r"\ddot x + \omega^2 x = 0,\quad \omega^2 = k/m", "Susun ulang dan beri nama omega^2."),
    (r"x = e^{\lambda t} \Rightarrow \lambda^2 + \omega^2 = 0 \Rightarrow \lambda=\pm i\omega", "Coba solusi eksponensial (persamaan diferensial orde-2 linear), dapatkan persamaan karakteristik."),
    (r"x = C_1 e^{i\omega t}+C_2 e^{-i\omega t}", "Solusi umum dari dua akar."),
    (r"x(t)=A\cos(\omega t+\varphi)", "Syarat x real dan rumus Euler memberi bentuk kosinus; A dan phi ditentukan oleh syarat awal.")],
   "Periode bergantung pada k dan m, bukan pada amplitudo.", ["o.energi", "o.pendulum", "q.osilator"])

eq("eq.pend", "o.pendulum", "Periode pendulum sederhana (sudut kecil)", r"T \approx 2\pi\sqrt{L/g}", "aproksimasi", ["eq.shm", "eq.torque_L"],
   ["Massa titik pada tali ringan tak mulur", "Tanpa gesekan di pivot dan tanpa hambatan udara", "g seragam, gerak planar", "Sudut kecil: sin(theta) ~ theta"], "Hanya untuk simpangan kecil (< sekitar 10 derajat); untuk sudut besar periode bergantung amplitudo.",
   [(r"I\ddot\theta = -mgL\sin\theta,\quad I = mL^2", "Dinamika rotasi (tau = I theta-dot-dot, eq.torque_L): torsi pemulih dari gravitasi."),
    (r"\ddot\theta = -\frac{g}{L}\sin\theta", "Sederhanakan; massa saling meniadakan."),
    (r"\sin\theta \approx \theta", "Ekspansi Taylor orde pertama (aproksimasi sudut kecil)."),
    (r"\ddot\theta + \frac{g}{L}\theta = 0 \Rightarrow \omega=\sqrt{g/L}", "Bentuknya sama dengan eq.shm."),
    (r"T = \frac{2\pi}{\omega}=2\pi\sqrt{L/g}", "Periode dari frekuensi sudut.")],
   "Periode tidak bergantung massa; hanya aproksimasi untuk sudut kecil.", [])

eq("eq.torque_L", "r.momsudut", "Torsi dan laju perubahan momentum sudut", r"\vec\tau = \frac{d\vec L}{dt}", "turunan", ["eq.newton2"],
   ["Titik acuan tetap di kerangka inersial"], "Kerangka inersial; titik acuan tetap.",
   [(r"\vec L = \vec r\times\vec p", "Definisi momentum sudut partikel."),
    (r"\frac{d\vec L}{dt} = \frac{d\vec r}{dt}\times\vec p + \vec r\times\frac{d\vec p}{dt}", "Aturan turunan hasil kali untuk perkalian silang."),
    (r"\frac{d\vec r}{dt}\times\vec p = \vec v\times m\vec v = 0", "Vektor sejajar: perkalian silang nol."),
    (r"\frac{d\vec L}{dt}=\vec r\times\vec F=\vec\tau", "Gunakan eq.newton2 dan definisi torsi.")],
   "Torsi adalah penyebab perubahan momentum sudut.", ["r.kekekalan", "g.kepler"])

eq("eq.kepler2", "g.kepler", "Hukum Kepler II (luas sapuan)", r"\frac{dA}{dt}=\frac{L}{2m}=\text{konstan}", "turunan", ["eq.torque_L"],
   ["Gaya sentral (torsi terhadap pusat nol)"], "Setiap gaya sentral, bukan hanya gravitasi. Secara historis Kepler II adalah temuan empiris; di sini ditunjukkan sebagai konsekuensi kekekalan momentum sudut.",
   [(r"\vec\tau=\vec r\times\vec F_{sentral}=0 \Rightarrow \vec L=\text{konstan}", "Gaya sentral sejajar r sehingga torsi nol (eq.torque_L); L konstan berarti gerak terkurung pada satu bidang tegak lurus L, sehingga koordinat polar di bidang itu sah."),
    (r"dA = \tfrac12 r^2 d\theta", "Luas sektor sempit yang disapu vektor posisi."),
    (r"L = mr^2\dot\theta \Rightarrow \frac{dA}{dt}=\tfrac12 r^2\dot\theta=\frac{L}{2m}", "Ganti theta-dot dengan L; L konstan sehingga dA/dt konstan.")],
   "Hukum Kepler II adalah kekekalan momentum sudut.", ["g.orbit"])

eq("eq.bernoulli", "f.bernoulli", "Persamaan Bernoulli", r"p + \tfrac12\rho v^2 + \rho g y = \text{konstan}", "turunan", ["eq.wke", "eq.pe"],
   ["Fluida tak termampatkan", "Tak kental (nonviscous)", "Aliran tunak (steady)", "Sepanjang satu garis arus", "Tanpa pompa/turbin; g seragam"],
   "Gagal untuk fluida kental, aliran turbulen, atau termampatkan (kompresibilitas mulai penting pada Mach sekitar 0,3 ke atas).",
   [(r"\Delta V_1=\Delta V_2=\Delta V", "Persamaan kontinuitas: volume yang masuk sama dengan volume yang keluar (tak termampatkan)."),
    (r"W_{tek}=(p_1-p_2)\Delta V", "Usaha oleh tekanan pada elemen fluida; tekanan pada dinding samping tabung arus tegak lurus gerak sehingga tidak melakukan usaha."),
    (r"\Delta K=\tfrac12\rho\Delta V(v_2^2-v_1^2),\quad \Delta U=\rho\Delta V g(y_2-y_1)", "Perubahan energi kinetik dan potensial elemen."),
    (r"W_{tek}+W_{grav}=\Delta K,\ W_{grav}=-\Delta U\ \Rightarrow\ W_{tek}=\Delta K+\Delta U", "Teorema usaha-energi (eq.wke) dengan usaha gravitasi = -Delta U (eq.pe)."),
    (r"p_1+\tfrac12\rho v_1^2+\rho g y_1 = p_2+\tfrac12\rho v_2^2+\rho g y_2", "Bagi dengan Delta V dan kelompokkan indeks 1 dan 2.")],
   "Bernoulli adalah kekekalan energi untuk fluida ideal.", [])

eq("eq.el", "l.eulerlagrange", "Persamaan Euler-Lagrange", r"\frac{d}{dt}\frac{\partial L}{\partial\dot q}-\frac{\partial L}{\partial q}=0", "turunan", [],
   ["Prinsip aksi stasioner dipostulatkan (bukan diturunkan di sini)", "Koordinat umum bebas (kendala holonomik)", "Lagrangian mulus (integran kontinu)"], "Berlaku untuk sistem yang memiliki Lagrangian (termasuk potensial bergantung kecepatan/waktu, mis. elektromagnetik); gaya disipatif murni (gesekan kinetik) tidak punya Lagrangian sederhana.",
   [(r"S[q]=\int_{t_1}^{t_2}L(q,\dot q,t)\,dt", "Aksi didefinisikan sebagai integral Lagrangian."),
    (r"q\to q+\epsilon\eta,\ \eta(t_1)=\eta(t_2)=0", "Variasi lintasan dengan ujung tetap."),
    (r"\frac{dS}{d\epsilon}\Big|_0=\int\left(\frac{\partial L}{\partial q}\eta+\frac{\partial L}{\partial\dot q}\dot\eta\right)dt=0", "Syarat stasioner: aksi tidak berubah di orde pertama."),
    (r"\int\frac{\partial L}{\partial\dot q}\dot\eta\,dt = -\int \frac{d}{dt}\!\left(\frac{\partial L}{\partial\dot q}\right)\eta\,dt", "Integrasi parsial; suku batas hilang karena eta = 0 di ujung."),
    (r"\int\left[\frac{\partial L}{\partial q}-\frac{d}{dt}\frac{\partial L}{\partial\dot q}\right]\eta\,dt=0\ \forall\eta", "Gabungkan suku-suku."),
    (r"\Rightarrow \frac{d}{dt}\frac{\partial L}{\partial\dot q}-\frac{\partial L}{\partial q}=0", "Lema dasar kalkulus variasi: integran harus nol.")],
   "Persamaan gerak dari satu fungsi skalar (L), bebas pilihan koordinat.", ["l.simetri", "h.hamiltonian", "qft.kuantisasi"])

eq("eq.el_newton", "l.eulerlagrange", "Euler-Lagrange menghasilkan Hukum II Newton", r"m\ddot x=-\frac{dU}{dx}", "turunan", ["eq.el", "eq.pe"],
   ["L = K - U", "Satu dimensi, koordinat kartesius"], "Menunjukkan konsistensi dengan mekanika Newton.",
   [(r"L=\tfrac12 m\dot x^2-U(x)", "Pilih Lagrangian L = K - U."),
    (r"\frac{\partial L}{\partial\dot x}=m\dot x\ \Rightarrow\ \frac{d}{dt}\frac{\partial L}{\partial\dot x}=m\ddot x", "Hitung suku pertama eq.el."),
    (r"\frac{\partial L}{\partial x}=-\frac{dU}{dx}", "Hitung suku kedua."),
    (r"m\ddot x+\frac{dU}{dx}=0\ \Rightarrow\ m\ddot x=F", "Masukkan ke eq.el dan gunakan F = -dU/dx (eq.pe).")],
   "Mekanika Lagrangian mencakup Newton sebagai kasus khusus.", [])

eq("eq.maxwell_wave", "x.gelombang_em", "Persamaan gelombang EM di ruang hampa", r"\nabla^2\vec E=\mu_0\varepsilon_0\frac{\partial^2\vec E}{\partial t^2},\quad c=\frac{1}{\sqrt{\mu_0\varepsilon_0}}", "turunan", [],
   ["Persamaan Maxwell (Gauss, Faraday, Ampere-Maxwell) diterima sebagai hukum dasar", "Ruang hampa: tanpa muatan dan arus (rho = 0, J = 0)", "Medan cukup mulus (turunan ruang dan waktu dapat dipertukarkan)"], "Ruang hampa. Di dalam materi, mu0 dan epsilon0 diganti mu dan epsilon hanya untuk dielektrik linear, homogen, isotropik, tak berdispersi, tanpa muatan/arus bebas.",
   [(r"\nabla\times\vec E=-\frac{\partial\vec B}{\partial t},\quad \nabla\times\vec B=\mu_0\varepsilon_0\frac{\partial\vec E}{\partial t}", "Hukum Faraday dan Ampere-Maxwell di ruang hampa."),
    (r"\nabla\times(\nabla\times\vec E)=-\frac{\partial}{\partial t}(\nabla\times\vec B)=-\mu_0\varepsilon_0\frac{\partial^2\vec E}{\partial t^2}", "Ambil curl hukum Faraday, lalu masukkan hukum Ampere-Maxwell."),
    (r"\nabla\times(\nabla\times\vec E)=\nabla(\nabla\cdot\vec E)-\nabla^2\vec E=-\nabla^2\vec E", "Identitas vektor, dan Gauss ruang hampa: divergensi E = 0."),
    (r"\nabla^2\vec E=\mu_0\varepsilon_0\frac{\partial^2\vec E}{\partial t^2}", "Samakan kedua hasil."),
    (r"v=\frac{1}{\sqrt{\mu_0\varepsilon_0}}=c", "Bandingkan dengan persamaan gelombang bentuk standar; kecepatan rambat adalah c.")],
   "Cahaya adalah gelombang elektromagnetik; c ditentukan oleh konstanta listrik dan magnet.", ["sr.postulat", "o2.interferensi"])

eq("eq.timedil", "sr.dilatasi", "Dilatasi waktu", r"\Delta t=\gamma\,\Delta\tau,\quad \gamma=\frac{1}{\sqrt{1-v^2/c^2}}", "turunan", [],
   ["Kecepatan cahaya sama di semua kerangka inersial (postulat 2)", "Prinsip relativitas (postulat 1)", "Jam cahaya tegak lurus terhadap v; panjang transversal d sama di kedua kerangka (konsekuensi prinsip relativitas)", "Delta tau = waktu proper: selang antara dua kejadian di tempat yang sama dalam kerangka diam jam"], "Kerangka inersial; berlaku untuk semua v < c.",
   [(r"\Delta\tau=\frac{2d}{c}", "Jam cahaya: dalam kerangka diam jam, cahaya menempuh jarak 2d."),
    (r"\left(\frac{c\Delta t}{2}\right)^2=d^2+\left(\frac{v\Delta t}{2}\right)^2", "Dalam kerangka pengamat, jam bergerak sehingga lintasan cahaya miring; c tetap (postulat 2). Gunakan Pythagoras."),
    (r"\Delta t^2\left(c^2-v^2\right)=4d^2", "Susun ulang."),
    (r"\Delta t=\frac{2d/c}{\sqrt{1-v^2/c^2}}=\gamma\Delta\tau", "Substitusi 2d/c = Delta tau.")],
   "Jam yang bergerak terukur lebih lambat oleh pengamat yang relatif bergerak.", ["n.peluruhan"])

eq("eq.E2", "sr.momenergi", "Hubungan energi-momentum relativistik", r"E^2=(pc)^2+(mc^2)^2", "turunan", ["eq.timedil"],
   ["Definisi relativistik: p = gamma m v dan E = gamma m c^2 (m = massa diam)", "Faktor gamma dari kedua postulat relativitas khusus"], "Relativitas khusus; berlaku untuk benda bermassa dengan semua v < c. Untuk foton (m = 0), E = pc diterima sebagai limit/perluasan (norma empat-momentum nol), bukan hasil derivasi ini.",
   [(r"E=\gamma mc^2,\quad p=\gamma mv,\quad \gamma=\frac{1}{\sqrt{1-v^2/c^2}}", "Definisi energi dan momentum relativistik; gamma berasal dari transformasi Lorentz/dilatasi waktu (eq.timedil)."),
    (r"E^2-(pc)^2=\gamma^2m^2c^4\left(1-\frac{v^2}{c^2}\right)", "Kuadratkan keduanya dan kurangkan."),
    (r"\gamma^2\left(1-\frac{v^2}{c^2}\right)=1\ \Rightarrow\ E^2-(pc)^2=(mc^2)^2", "Gunakan definisi gamma."),
    (r"P^\mu=(E/c,\vec p),\ P^\mu P_\mu=(mc)^2", "Tafsir geometris: kombinasi ini adalah norma empat-momentum, invarian di semua kerangka inersial.")],
   "Benda diam (p = 0): E = mc^2. Foton: E = pc diterima sebagai limit m -> 0.", ["mo.compton", "n.struktur", "q.relativistik"])

eq("eq.bohr", "a.bohr", "Tingkat energi atom Bohr (hidrogen, Z = 1)", r"E_n=-\frac{13{,}6\ \text{eV}}{n^2}", "model", ["eq.newton2", "eq.ac"],
   ["Orbit lingkaran klasik", "Postulat Bohr 1: orbit stasioner tidak memancar (bertentangan dengan elektrodinamika klasik)", "Postulat Bohr 2: L = n hbar; transisi memancarkan foton dengan h nu = E_i - E_f", "Inti diam (massa tereduksi diabaikan), satu elektron"], "Hidrogen (Z = 1) dalam aproksimasi inti diam; untuk ion mirip-hidrogen E_n memuat faktor Z^2. Gagal secara kualitatif: keadaan dasar Bohr punya L = hbar, padahal yang benar L = 0; tidak menjelaskan spin, struktur halus, intensitas garis, atau atom multielektron.",
   [(r"\frac{mv^2}{r}=\frac{ke^2}{r^2}", "Hukum II Newton untuk orbit lingkaran dengan gaya Coulomb (eq.ac)."),
    (r"mvr=n\hbar\quad (\text{postulat})", "Kuantisasi momentum sudut - ini asumsi baru Bohr, bukan hasil derivasi."),
    (r"r_n=\frac{n^2\hbar^2}{mke^2}=n^2a_0", "Eliminasi v dari dua persamaan."),
    (r"E=\tfrac12mv^2-\frac{ke^2}{r}=-\frac{ke^2}{2r}", "Energi total dengan v dari langkah pertama."),
    (r"E_n=-\frac{mk^2e^4}{2\hbar^2}\frac{1}{n^2}=-\frac{13{,}6\ \text{eV}}{n^2}", "Substitusi r_n.")],
   "Menjelaskan spektrum hidrogen dengan baik, tetapi kuantisasinya dipostulatkan; dijelaskan lebih mendalam oleh persamaan Schrodinger.", ["a.spektrum", "q.hidrogen"])

eq("eq.tdse", "q.tdse", "Persamaan Schrodinger bergantung waktu", r"i\hbar\frac{\partial\psi}{\partial t}=-\frac{\hbar^2}{2m}\frac{\partial^2\psi}{\partial x^2}+V\psi", "postulat", [],
   ["Postulat mekanika kuantum", "Partikel non-relativistik", "V riil (agar peluang kekal)", "Persamaan linear dalam psi"], "v << c; tidak menjelaskan spin atau pasangan partikel-antipartikel tanpa perluasan.",
   [(r"\psi=e^{i(kx-\omega t)},\ p=\hbar k,\ E=\hbar\omega", "Heuristik (bukan derivasi): gelombang bidang untuk partikel bebas, hubungan de Broglie dan Planck."),
    (r"E=\frac{p^2}{2m}+V", "Energi klasik partikel non-relativistik."),
    (r"i\hbar\frac{\partial}{\partial t}\to E,\quad -i\hbar\frac{\partial}{\partial x}\to p", "Aturan korespondensi dari bentuk gelombang bidang."),
    (r"i\hbar\partial_t\psi=-\frac{\hbar^2}{2m}\partial_x^2\psi+V\psi", "Terapkan operator ke psi. Kecocokan dengan eksperimen adalah pembenarannya.")],
   "Tidak diturunkan dari fisika klasik: ia adalah postulat yang dimotivasi oleh gelombang materi dan diuji eksperimen.", ["eq.tise"])

eq("eq.tise", "q.tise", "Persamaan Schrodinger tak bergantung waktu", r"-\frac{\hbar^2}{2m}\frac{d^2\varphi}{dx^2}+V\varphi=E\varphi", "turunan", ["eq.tdse"],
   ["V tidak bergantung waktu", "Solusi dapat dipisah: psi = phi(x) T(t)"], "Hanya untuk potensial yang tidak bergantung waktu.",
   [(r"\psi(x,t)=\varphi(x)T(t)", "Separasi variabel."),
    (r"i\hbar\frac{T'}{T}=\frac{1}{\varphi}\left[-\frac{\hbar^2}{2m}\varphi''+V\varphi\right]", "Substitusi ke eq.tdse dan bagi dengan phi T."),
    (r"\text{kedua sisi} = E\ (\text{konstanta})", "Ruas kiri hanya bergantung t, ruas kanan hanya x, jadi keduanya konstanta."),
    (r"T(t)=e^{-iEt/\hbar}", "Selesaikan persamaan waktu."),
    (r"-\frac{\hbar^2}{2m}\varphi''+V\varphi=E\varphi", "Persamaan ruang; E menjadi nilai eigen energi.")],
   "Keadaan stasioner: rapat peluang tidak berubah terhadap waktu.", ["q.kotak", "q.osilator", "q.hidrogen"])

eq("eq.uncertainty", "q.komutator", "Prinsip ketidakpastian umum", r"\sigma_A\sigma_B\ge\tfrac12\left|\langle[\hat A,\hat B]\rangle\right|", "turunan", [],
   ["Operator hermitian A dan B", "Keadaan ternormalisasi dan berada di domain operator; variansi berhingga"], "Mekanika kuantum; bentuk x-p: sigma_x sigma_p >= hbar/2 dari [x,p] = i hbar.",
   [(r"\sigma_A^2\sigma_B^2\ge|\langle f|g\rangle|^2", "Definisikan f = (A - <A>)psi dan g = (B - <B>)psi. Karena A, B hermitian: sigma_A^2 = <f|f> dan sigma_B^2 = <g|g>; lalu gunakan ketaksamaan Cauchy-Schwarz <f|f><g|g> >= |<f|g>|^2."),
    (r"\langle f|g\rangle=\tfrac12\langle\{\Delta A,\Delta B\}\rangle+\tfrac12\langle[\hat A,\hat B]\rangle", "Pisahkan ke bagian simetris (riil) dan antisimetris (imajiner murni)."),
    (r"|\langle f|g\rangle|^2\ge\left|\tfrac12\langle[\hat A,\hat B]\rangle\right|^2", "Buang bagian riil yang tidak negatif."),
    (r"[\hat x,\hat p]=i\hbar\ \Rightarrow\ \sigma_x\sigma_p\ge\hbar/2", "Kasus posisi-momentum.")],
   "Ketidakpastian bukan cacat alat ukur: ia lahir dari non-komutatifnya observabel.", ["q.hidrogen"])

eq("eq.kinetic_p", "t.kinetik", "Tekanan dari teori kinetik", r"pV=\tfrac13Nm\langle v^2\rangle\ \Rightarrow\ \langle K\rangle=\tfrac32kT", "turunan", ["eq.impulse", "eq.pcons"],
   ["Gas ideal: tumbukan elastis dengan dinding", "Tanpa interaksi antarmolekul", "Distribusi kecepatan isotropik", "pV = NkT diterima sebagai hukum gas empiris, dipakai untuk MENGIDENTIFIKASI suhu T", "Gaya pada dinding dari Hukum III Newton (dinding mendorong balik dengan impuls yang sama)"], "Gas encer; non-relativistik (v << c); suhu tidak terlalu rendah (efek kuantum diabaikan). Hasil 3/2 kT adalah energi kinetik TRANSLASI rata-rata per molekul.",
   [(r"\Delta p=2mv_x\ \text{per tumbukan}", "Tumbukan elastis dengan dinding membalik v_x."),
    (r"F=\frac{N}{V}\cdot\tfrac12 A v_x\Delta t\cdot\frac{2mv_x}{\Delta t}", "Jumlah tumbukan per selang waktu (setengah molekul bergerak ke dinding), kali impuls per tumbukan (eq.impulse)."),
    (r"p=\frac{F}{A}=\frac{N}{V}m\langle v_x^2\rangle=\tfrac13\frac{N}{V}m\langle v^2\rangle", "Isotropi: <v_x^2> = <v^2>/3."),
    (r"pV=NkT\ \Rightarrow\ \tfrac13 m\langle v^2\rangle=kT", "Identifikasi suhu: samakan dengan hukum gas empiris pV = NkT."),
    (r"\langle K\rangle=\tfrac12m\langle v^2\rangle=\tfrac32kT", "Energi kinetik translasi rata-rata per molekul.")],
   "Suhu adalah ukuran energi kinetik acak rata-rata molekul.", ["s.mb"])

eq("eq.carnot", "t.carnot", "Efisiensi Carnot", r"\eta=1-\frac{T_c}{T_h}", "turunan", [],
   ["Gas ideal dengan gamma konstan", "Siklus reversibel (proses kuasi-statik)", "Dua isoterm dan dua adiabat; T adalah suhu gas ideal (setara suhu termodinamika)"], "Efisiensi siklus Carnot gas ideal. Bahwa ini batas atas untuk SEMUA mesin kalor antara T_h dan T_c dibuktikan terpisah dengan hukum II termodinamika (t.hukum2), bukan oleh derivasi ini.",
   [(r"Q_h=nRT_h\ln\frac{V_2}{V_1},\quad Q_c=nRT_c\ln\frac{V_3}{V_4}", "Kalor pada dua isoterm (energi dalam gas ideal tidak berubah pada isoterm)."),
    (r"T_hV_2^{\gamma-1}=T_cV_3^{\gamma-1},\quad T_hV_1^{\gamma-1}=T_cV_4^{\gamma-1}\ \Rightarrow\ \frac{V_2}{V_1}=\frac{V_3}{V_4}", "Tulis TV^(gamma-1) = konstan untuk kedua adiabat (2->3 dan 4->1), lalu bagi persamaannya."),
    (r"\frac{Q_c}{Q_h}=\frac{T_c}{T_h}", "Bagi kedua kalor; logaritma sama."),
    (r"\eta=\frac{W}{Q_h}=1-\frac{Q_c}{Q_h}=1-\frac{T_c}{T_h}", "Definisi efisiensi dan hukum I (W = Q_h - Q_c).")],
   "Efisiensi hanya bergantung pada dua suhu reservoir. (Teorema Carnot: tidak ada mesin yang lebih efisien - dibuktikan dengan hukum II.)", ["t.hukum2"])
