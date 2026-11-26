export interface MockCategory {
  id: string;
  nama: string;
  slug: string;
  jumlah_judul: number;
}

export const MOCK_CATEGORIES: MockCategory[] = [
  { id: "cat-1", nama: "Semua Buku", slug: "semua", jumlah_judul: 64 },
  { id: "cat-2", nama: "Teknologi & SIJA", slug: "teknologi-sija", jumlah_judul: 22 },
  { id: "cat-3", nama: "Pemrograman Web", slug: "pemrograman-web", jumlah_judul: 14 },
  { id: "cat-4", nama: "Jaringan Komputer", slug: "jaringan-komputer", jumlah_judul: 9 },
  { id: "cat-5", nama: "Keislaman & Akhlak", slug: "keislaman", jumlah_judul: 12 },
  { id: "cat-6", nama: "Sains & Matematika", slug: "sains-matematika", jumlah_judul: 8 },
  { id: "cat-7", nama: "Pengembangan Diri", slug: "pengembangan-diri", jumlah_judul: 10 },
  { id: "cat-8", nama: "Sastra & Bahasa", slug: "sastra-bahasa", jumlah_judul: 7 },
];

export interface MockAnnouncement {
  id: string;
  judul: string;
  ringkasan: string;
  isi: string;
  tanggal: string;
  tag: string;
  warna_tag: "primary" | "warning" | "success";
  tautan?: string;
  gambar_path?: string | null;
  gambar_url?: string | null;
}

export const MOCK_ANNOUNCEMENTS: MockAnnouncement[] = [
  {
    id: "ann-1",
    judul: "Pekan Literasi Siswa: Koleksi Baru Rekayasa SIJA & Cloud Computing",
    ringkasan: "Sebanyak 25 judul buku teknologi terbaru siap dipinjam di meja sirkulasi perpustakaan.",
    isi: "Menyambut pekan literasi sekolah berasrama SMK TI Bazma, perpustakaan telah menambahkan koleksi buku sistem informasi, jaringan, dan arsitektur cloud. Silakan ajukan pinjam online atau datang langsung.",
    tanggal: "19 Nov 2026",
    tag: "Koleksi Baru",
    warna_tag: "primary",
    gambar_path: "banners/pekan-literasi-lg.svg",
    gambar_url: "/images/banners/pekan-literasi-lg.svg",
  },
  {
    id: "ann-2",
    judul: "Ketentuan Batas Pengajuan Peminjaman 24 Jam",
    ringkasan: "Ajuan pinjam online akan disisihkan selama 24 jam di rak sirkulasi sebelum otomatis dialihkan.",
    isi: "Pastikan mengambil buku yang telah diajukan ke meja pustakawan sebelum batas waktu habis untuk menghindari pembatalan otomatis dan sanksi blokir sementara.",
    tanggal: "15 Nov 2026",
    tag: "Aturan Sirkulasi",
    warna_tag: "warning",
    gambar_path: "banners/aturan-booking-lg.svg",
    gambar_url: "/images/banners/aturan-booking-lg.svg",
  },
  {
    id: "ann-3",
    judul: "Jam Layanan Meja Sirkulasi Perpustakaan",
    ringkasan: "Senin - Jumat: 08.00 - 16.30 WIB. Istirahat salat Dhuhur dan Ashar.",
    isi: "Petugas pustakawan siap melayani serah terima buku, pengembalian, dan konfirmasi peminjaman sesuai jam operasional sekolah.",
    tanggal: "10 Nov 2026",
    tag: "Layanan",
    warna_tag: "success",
    gambar_path: "banners/buku-rekayasa-sija-lg.svg",
    gambar_url: "/images/banners/buku-rekayasa-sija-lg.svg",
  },
  {
    id: "ann-4",
    judul: "Pemeliharaan Sistem Digital dan Audit Tahunan",
    ringkasan: "Layanan mandiri tetap dapat diakses normal selama proses sinkronisasi data.",
    isi: "Pengumuman administratif untuk seluruh warga sekolah mengenai audit tahunan inventaris perpustakaan.",
    tanggal: "05 Nov 2026",
    tag: "Info",
    warna_tag: "primary",
    gambar_path: null, // Test case: 1 pengumuman tanpa gambar (fallback ke banner-umum.svg)
    gambar_url: null,
  },
];

export type BookAvailabilityStatus = "tersedia" | "antre" | "dibooking" | "penuh";

export interface MockBook {
  id: string;
  judul: string;
  subjudul?: string;
  penulis: string;
  penerbit: string;
  tahun: number;
  isbn: string;
  kategori_id: string;
  kategori_nama: string;
  subkategori?: string;
  bahasa?: string;
  jumlah_halaman?: number;
  edisi?: string;
  total_eksemplar: number;
  eksemplar_tersedia: number;
  eksemplar_dibooking: number;
  eksemplar_dipinjam: number;
  eksemplar_perbaikan?: number;
  jumlah_antrean: number;
  maks_antrean: number;
  sinopsis: string;
  deskripsi_lengkap?: string[];
  nomor_panggil: string;
  cover_path?: string | null;
  cover_url?: string | null;
  sumber_cover?: string;
  rating?: number;
  total_ulasan?: number;
  galeri_foto?: string[];
  is_populer?: boolean;
  is_baru?: boolean;
  is_pilihan_pekan?: boolean;
}

export const MOCK_BOOKS: MockBook[] = [
  {
    id: "buku-laskar",
    judul: "Laskar Pelangi",
    subjudul: "Sebuah Novel Karya Fenomenal Andrea Hirata",
    penulis: "Andrea Hirata",
    penerbit: "Bentang Pustaka",
    tahun: 2005,
    isbn: "978-979-3062-79-2",
    kategori_id: "cat-8",
    kategori_nama: "Sastra & Bahasa",
    subkategori: "Novel / Inspiratif",
    bahasa: "Indonesia",
    jumlah_halaman: 529,
    edisi: "Edisi Pertama",
    total_eksemplar: 20,
    eksemplar_tersedia: 12,
    eksemplar_dibooking: 3,
    eksemplar_dipinjam: 4,
    eksemplar_perbaikan: 1,
    jumlah_antrean: 0,
    maks_antrean: 5,
    sinopsis:
      "Laskar Pelangi mengisahkan sepuluh anak di Belitung Timur yang berjuang menuntut ilmu di tengah keterbatasan fasilitas sekolah dasar Muhammadiyah. Penuh inspirasi, tawa, dan air mata persahabatan.",
    deskripsi_lengkap: [
      "Laskar Pelangi bermula dari sebuah kisah nyata tentang sepuluh anak dari keluarga miskin di Pulau Belitung, pulau kaya timah di Indonesia. Mereka bersekolah di SD Muhammadiyah Gantong yang sangat sederhana dan nyaris roboh. Meskipun hidup dalam keterbatasan fasilitas yang serba minim, anak-anak yang menyebut diri mereka sebagai 'Laskar Pelangi' ini memiliki semangat belajar dan keuletan yang luar biasa.",
      "Kisah ini berpusat pada tokoh Ikal, Lintang sang anak jenius pesisir yang rela mengayuh sepeda puluhan kilometer melewati rawa buaya demi sekolah, serta Mahar yang memiliki bakat seni luar biasa. Di bawah bimbingan guru yang penuh dedikasi tanpa pamrih, Bu Muslimah dan Pak Harfan, anak-anak ini belajar memaknai arti persahabatan, kejujuran, cita-cita luhur, dan keteguhan hati menghadapi kerasnya kenyataan hidup.",
      "Buku ini tidak hanya menyajikan drama pendidikan yang menggugah nurani, tetapi juga potret ironi sosial tentang kemakmuran alam yang kontras dengan kemiskinan masyarakat lokalnya. Melalui bahasa yang sarat metafora indah dan humor cerdas, Andrea Hirata berhasil membawa pembaca menyelami kehangatan jiwa anak-anak pulau yang membuktikan bahwa keterbatasan ekonomi bukanlah penghalang untuk menggantungkan cita-cita setinggi langit.",
    ],
    nomor_panggil: "813.01 HIR l",
    cover_path: "covers/laskar-pelangi.png",
    cover_url: "/images/covers/laskar-pelangi.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Bentang Pustaka, ISBN: 978-979-3062-79-2)",
    rating: 4.9,
    total_ulasan: 48,
    galeri_foto: [
      "/images/covers/laskar-pelangi.png",
      "/images/covers/bumi.png",
      "/images/covers/hujan.png",
      "/images/covers/laut-bercerita.png",
    ],
    is_populer: true,
    is_baru: true,
    is_pilihan_pekan: true,
  },
  {
    id: "buku-bumi",
    judul: "Bumi",
    subjudul: "Petualangan Dunia Paralel Klan Bulan dan Bumi",
    penulis: "Tere Liye",
    penerbit: "Gramedia Pustaka Utama",
    tahun: 2014,
    isbn: "978-602-03-0112-9",
    kategori_id: "cat-8",
    kategori_nama: "Sastra & Bahasa",
    subkategori: "Fiksi Fantasi",
    bahasa: "Indonesia",
    jumlah_halaman: 440,
    edisi: "Cetakan Pertama",
    total_eksemplar: 14,
    eksemplar_tersedia: 6,
    eksemplar_dibooking: 2,
    eksemplar_dipinjam: 6,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 5,
    sinopsis:
      "Raib, gadis remaja berusia 15 tahun, memiliki kemampuan rahasia menghilang. Bersama Seli dan Ali, ia membuka gerbang dunia paralel yang menyimpan konspirasi besar Klan Bulan.",
    deskripsi_lengkap: [
      "Bumi merupakan novel pembuka dari serial Dunia Paralel karya Tere Liye. Cerita berfokus pada Raib, seorang remaja putri biasa yang memiliki rahasia besar sejak kecil: ia dapat menghilang hanya dengan menutup wajahnya menggunakan kedua telapak tangan. Selama bertahun-tahun ia merahasiakan kekuatan ini, hingga suatu insiden di gardu listrik sekolah mengungkap bahwa ia tidak sendirian.",
      "Bersama dua sahabatnya, Seli yang mampu mengeluarkan petir dari tangannya dan Ali si genius yang serba tahu, mereka terlempar ke Klan Bulan melalui portal teleportasi misterius. Di klan berteknologi maju yang tersembunyi ini, mereka diburu oleh Tamus, sosok antagonis berkuasa yang ingin menguasai seluruh dunia paralel dengan memanfaatkan kekuatan klan bumi.",
      "Novel ini memadukan imajinasi sains fiksi dengan nilai persahabatan, keberanian, dan kesetiakawanan anak muda. Alur cerita yang bergerak cepat serta pembangunan dunia yang kaya membuat pembaca terbawa dalam pertarungan magis antardimensi yang menegangkan.",
    ],
    nomor_panggil: "813.02 TER b",
    cover_path: "covers/bumi.png",
    cover_url: "/images/covers/bumi.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Gramedia Pustaka Utama, ISBN: 978-602-03-0112-9)",
    rating: 4.8,
    total_ulasan: 42,
    galeri_foto: [
      "/images/covers/bumi.png",
      "/images/covers/matahari.png",
      "/images/covers/hujan.png",
    ],
    is_populer: true,
    is_baru: true,
    is_pilihan_pekan: true,
  },
  {
    id: "buku-cantik-itu-luka",
    judul: "Cantik Itu Luka",
    subjudul: "Kisah Tragedi, Sejarah, dan Realisme Magis Halimunda",
    penulis: "Eka Kurniawan",
    penerbit: "Gramedia Pustaka Utama",
    tahun: 2015,
    isbn: "978-602-03-1258-3",
    kategori_id: "cat-8",
    kategori_nama: "Sastra & Bahasa",
    subkategori: "Realisme Magis / Fiksi Sejarah",
    bahasa: "Indonesia",
    jumlah_halaman: 508,
    edisi: "Edisi Khusus",
    total_eksemplar: 8,
    eksemplar_tersedia: 3,
    eksemplar_dibooking: 1,
    eksemplar_dipinjam: 4,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 4,
    sinopsis:
      "Dewi Ayu bangkit dari kubur setelah dua puluh satu tahun kematiannya. Sebuah epos berlatar kota pesisir fiktif Halimunda yang merajut luka sejarah kolonialisme hingga kemerdekaan.",
    deskripsi_lengkap: [
      "Cantik Itu Luka merupakan mahakarya Eka Kurniawan yang telah diterjemahkan ke lebih dari tiga puluh bahasa dunia. Narasi dibuka dengan peristiwa menggegerkan ketika Dewi Ayu, perempuan tercantik di Halimunda yang berprofesi sebagai pelacur masa kolonial, bangkit kembali dari kuburnya setelah meninggal selama dua puluh satu tahun.",
      "Melalui silsilah keluarga Dewi Ayu dan keempat anak perempuannya, novel ini menggelar rentetan tragedi, kekerasan, cinta terlarang, serta kutukan kecantikan. Kota fiktif Halimunda menjadi mikrokosmos perjalanan sejarah bangsa Indonesia, mulai dari masa pendudukan Belanda, kekejaman tentara Jepang, gejolak revolusi kemerdekaan, hingga pergolakan politik nasional.",
      "Eka Kurniawan meramu realisme magis dengan dongeng rakyat Indonesia dan gaya tuturan pewayangan yang memikat. Novel ini menyajikan kritik tajam terhadap patriarki dan eksploitasi manusia, menjadikannya salah satu pilar sastra kontemporer Indonesia yang diakui secara global.",
    ],
    nomor_panggil: "813.02 KUR c",
    cover_path: "covers/cantik-itu-luka.png",
    cover_url: "/images/covers/cantik-itu-luka.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Gramedia Pustaka Utama, ISBN: 978-602-03-1258-3)",
    rating: 4.7,
    total_ulasan: 36,
    is_populer: true,
    is_baru: false,
    is_pilihan_pekan: false,
  },
  {
    id: "buku-gadis-kretek",
    judul: "Gadis Kretek",
    subjudul: "Pencarian Jeng Yah dan Rahasia Industri Kretek Nusantara",
    penulis: "Ratih Kumala",
    penerbit: "Gramedia Pustaka Utama",
    tahun: 2012,
    isbn: "978-979-22-8141-5",
    kategori_id: "cat-8",
    kategori_nama: "Sastra & Bahasa",
    subkategori: "Fiksi Sejarah / Drama",
    bahasa: "Indonesia",
    jumlah_halaman: 274,
    edisi: "Cetakan Pertama",
    total_eksemplar: 10,
    eksemplar_tersedia: 4,
    eksemplar_dibooking: 2,
    eksemplar_dipinjam: 4,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 4,
    sinopsis:
      "Menjelang ajal, pemilik Pabrik Kretek Djadjaja menyebut nama perempuan misterius: Jeng Yah. Ketiga putranya menjelajahi pelosok Jawa untuk menyingkap rahasia cinta dan resep saus tembakau legendaris.",
    deskripsi_lengkap: [
      "Gadis Kretek menghadirkan jalinan kisah perjalanan sejarah industri rokok kretek di tanah Jawa dari masa pra-kemerdekaan hingga era modern. Cerita dimulai saat Soeraja, pemilik pabrik Kretek Djadjaja yang sedang sekarat, menyebut nama Jeng Yah, bukan nama istrinya. Hal ini mendorong ketiga anak laki-lakinya melacak jejak masa lalu sang ayah.",
      "Pencarian ini membawa mereka menelusuri kota-kota di Jawa Tengah dan Jawa Timur, membuka lembaran rahasia tentang persaingan bisnis keluarga, intrik peracikan saus tembakau, dan asmara yang kandas akibat benturan politik tahun 1965. Sosok Jeng Yah tampil sebagai perempuan perajin kretek berbakat luar biasa yang mendobrak dominasi laki-laki.",
      "Ratih Kumala piawai merekonstruksi atmosfer aroma cengkih dan tembakau serta lika-liku sosial masyarakat pedesaan Jawa tempo dulu. Buku ini menjadi karya sastra bernilai budaya tinggi yang memperkaya wawasan tentang sejarah agrikultur dan kearifan lokal Nusantara.",
    ],
    nomor_panggil: "813.02 KUM g",
    cover_path: "covers/gadis-kretek.png",
    cover_url: "/images/covers/gadis-kretek.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Gramedia Pustaka Utama, ISBN: 978-979-22-8141-5)",
    rating: 4.8,
    total_ulasan: 39,
    is_populer: true,
    is_baru: true,
    is_pilihan_pekan: true,
  },
  {
    id: "buku-hujan",
    judul: "Hujan",
    subjudul: "Tentang Melupakan, Menerima, dan Keteguhan Hati",
    penulis: "Tere Liye",
    penerbit: "Gramedia Pustaka Utama",
    tahun: 2016,
    isbn: "978-602-03-2478-4",
    kategori_id: "cat-8",
    kategori_nama: "Sastra & Bahasa",
    subkategori: "Fiksi Ilmiah / Romansa",
    bahasa: "Indonesia",
    jumlah_halaman: 320,
    edisi: "Cetakan Pertama",
    total_eksemplar: 15,
    eksemplar_tersedia: 8,
    eksemplar_dibooking: 2,
    eksemplar_dipinjam: 5,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 5,
    sinopsis:
      "Berlatar dunia futuristik tahun 2042 pascabencana letusan gunung purba, Lail memilih mendatangi ruang modifikasi ingatan untuk menghapus kenangan tentang hujan dan seseorang yang dicintainya.",
    deskripsi_lengkap: [
      "Hujan berlatar tahun 2042 hingga 2050, ketika bumi telah bertransformasi ke era serba canggih berteknologi tinggi. Cerita bermula dari bencana letusan gunung api dahsyat yang melenyapkan sebagian besar populasi manusia. Lail, gadis berusia sepuluh tahun yang kehilangan kedua orang tuanya, diselamatkan oleh seorang pemuda bernama Esok.",
      "Selama bertahun-tahun pascabencana, hubungan persahabatan mereka bertumbuh di tengah dinginnya iklim bumi yang terus memburuk akibat rekayasa cuaca global yang gagal. Ketika Esok terpilih menjadi salah satu saintis perancang kapal antariksa penyelamat peradaban, jarak dan takdir mulai menguji ikatan emosional keduanya.",
      "Tere Liye mengeksplorasi tema penerimaan luka masa lalu dan esensi memaafkan diri sendiri. Dengan latar fiksi ilmiah yang solid dan narasi menyentuh, novel ini menegaskan bahwa bagian terpenting dari hidup bukanlah tentang menghapus kenangan menyakitkan, melainkan berdamai dengannya.",
    ],
    nomor_panggil: "813.02 TER h",
    cover_path: "covers/hujan.png",
    cover_url: "/images/covers/hujan.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Gramedia Pustaka Utama, ISBN: 978-602-03-2478-4)",
    rating: 4.9,
    total_ulasan: 52,
    is_populer: true,
    is_baru: true,
    is_pilihan_pekan: true,
  },
  {
    id: "buku-janji",
    judul: "Janji",
    subjudul: "Sebuah Perjalanan Mencari Makna Pengampunan dan Ketulusan",
    penulis: "Tere Liye",
    penerbit: "Sabak Grip Nusantara",
    tahun: 2021,
    isbn: "978-623-97673-0-3",
    kategori_id: "cat-5",
    kategori_nama: "Keislaman & Akhlak",
    subkategori: "Fiksi Inspiratif / Religi",
    bahasa: "Indonesia",
    jumlah_halaman: 488,
    edisi: "Edisi Spesial",
    total_eksemplar: 11,
    eksemplar_tersedia: 5,
    eksemplar_dibooking: 1,
    eksemplar_dipinjam: 5,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 4,
    sinopsis:
      "Tiga santri pembuat onar di pondok pesantren diutus Buya untuk mencari Bahar, santri terburuk sepanjang sejarah pesantren yang meninggalkan janji berharga bagi kehidupan banyak orang.",
    deskripsi_lengkap: [
      "Janji berkisah tentang tiga santri asrama pesantren: Baso, Kaharuddin, dan Hasan, yang terkenal sering melanggar aturan dan membuat kekacauan. Alih-alih mengeluarkan mereka, Buya memberikan hukuman unik sekaligus amanah besar: mengembara mencari seorang mantan santri bernama Bahar.",
      "Bahar adalah sosok legendaris di pesantren yang terkenal dengan catatan kenakalan luar biasa sebelum akhirnya diusir puluhan tahun lalu. Dalam perjalanan menelusuri jejak Bahar dari pelosok desa hingga sudut kota, ketiga santri ini justru mendapati kesaksian mengejutkan dari orang-orang yang hidupnya berubah berkat kebaikan tulus Bahar.",
      "Novel ini sarat dengan mutiara nasihat akhlak, adab berguru, dan kebijaksanaan hidup Islami. Tere Liye mengemasnya dengan gaya jenaka khas dunia santri, mengajak pembaca untuk tidak menilai seseorang semata-mata dari masa lalunya, melainkan dari tekadnya dalam menepati janji kepada Sang Pencipta.",
    ],
    nomor_panggil: "297.4 TER j",
    cover_path: "covers/janji.png",
    cover_url: "/images/covers/janji.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Sabak Grip Nusantara, ISBN: 978-623-97673-0-3)",
    rating: 4.9,
    total_ulasan: 31,
    is_populer: true,
    is_baru: false,
    is_pilihan_pekan: true,
  },
  {
    id: "buku-laut-bercerita",
    judul: "Laut Bercerita",
    subjudul: "Menolak Lupa Tragedi Aktivis Mahasiswa dan Keluarga yang Menanti",
    penulis: "Leila S. Chudori",
    penerbit: "Kepustakaan Populer Gramedia (KPG)",
    tahun: 2017,
    isbn: "978-602-424-694-5",
    kategori_id: "cat-8",
    kategori_nama: "Sastra & Bahasa",
    subkategori: "Fiksi Sejarah / Hak Asasi Manusia",
    bahasa: "Indonesia",
    jumlah_halaman: 379,
    edisi: "Cetakan Kedua Belas",
    total_eksemplar: 12,
    eksemplar_tersedia: 4,
    eksemplar_dibooking: 2,
    eksemplar_dipinjam: 6,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 5,
    sinopsis:
      "Kisah penyiksaan dan penghilangan paksa aktivis mahasiswa pra-reformasi 1998, serta duka mendalam keluarga yang setia menunggu kepulangan mereka di meja makan hampa.",
    deskripsi_lengkap: [
      "Laut Bercerita mengupas salah satu lembaran paling kelam dalam sejarah modern Indonesia: penculikan dan penghilangan paksa aktivis pro-demokrasi pada masa akhir Orde Baru tahun 1998. Bagian pertama novel ini dinarasikan oleh Biru Laut, mahasiswa sastra Inggris Universitas Gadjah Mada yang bergabung dalam gerakan bawah tanah membela rakyat kecil.",
      "Laut menceritakan detik-detik saat ia dan kawan-kawannya disekap, diinterogasi secara brutal di tempat rahasia, hingga akhirnya ditenggelamkan ke dasar laut dengan beban rantai besi. Bagian kedua beralih ke sudut pandang Asmara Jati, adik perempuan Laut, yang bersama para keluarga korban terus memperjuangkan keadilan dan menolak melupakan sanak famili mereka yang tak pernah kembali.",
      "Leila S. Chudori merajut fakta sejarah dengan kepiawaian bertutur sastrawi yang mengharukan dan mendalam. Novel ini menjadi monumen ingatan kemanusiaan yang sangat penting bagi generasi muda untuk memahami harga mahal dari kebebasan berekspresi dan demokrasi di Indonesia.",
    ],
    nomor_panggil: "813.02 CHU l",
    cover_path: "covers/laut-bercerita.png",
    cover_url: "/images/covers/laut-bercerita.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (KPG, ISBN: 978-602-424-694-5)",
    rating: 5.0,
    total_ulasan: 65,
    is_populer: true,
    is_baru: true,
    is_pilihan_pekan: true,
  },
  {
    id: "buku-matahari",
    judul: "Matahari",
    subjudul: "Eksplorasi Klan Bintang dan Misteri Lorong Bawah Tanah",
    penulis: "Tere Liye",
    penerbit: "Gramedia Pustaka Utama",
    tahun: 2016,
    isbn: "978-602-03-3211-6",
    kategori_id: "cat-8",
    kategori_nama: "Sastra & Bahasa",
    subkategori: "Fiksi Fantasi",
    bahasa: "Indonesia",
    jumlah_halaman: 400,
    edisi: "Cetakan Pertama",
    total_eksemplar: 10,
    eksemplar_tersedia: 5,
    eksemplar_dibooking: 1,
    eksemplar_dipinjam: 4,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 4,
    sinopsis:
      "Kelanjutan petualangan Raib, Seli, dan Ali menembus lapisan bumi menuju Klan Bintang yang misterius dan terisolasi, demi menemukan rahasia leluhur mereka.",
    deskripsi_lengkap: [
      "Matahari adalah buku ketiga dalam serial Dunia Paralel yang mengikuti kelanjutan petualangan trio sahabat Raib, Seli, dan Ali. Setelah berpetualang di Klan Bulan dan Klan Matahari, Ali si jenius menciptakan mesin kapsul penjelajah bawah tanah bernama ILY untuk menemukan Klan Bintang yang legendaris.",
      "Petualangan ini membawa mereka menyelam ribuan kilometer ke perut bumi, menghadapi medan gravitasi ekstrem, makhluk purba, dan peradaban Klan Bintang yang berteknologi amat maju namun dipimpin oleh dewan yang otoriter. Di tempat asing ini, nyawa mereka terancam ketika niat baik mereka disalahartikan sebagai ancaman keamanan klan.",
      "Melalui alur yang penuh aksi mendebarkan, Tere Liye mengeksplorasi tema loyalitas persahabatan, keberanian mengambil risiko, dan kecerdasan memecahkan masalah sains serta fisika. Buku ini sangat digemari siswa yang menyukai kombinasi petualangan magis dan konsep teknologi futuristik.",
    ],
    nomor_panggil: "813.02 TER m",
    cover_path: "covers/matahari.png",
    cover_url: "/images/covers/matahari.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Gramedia Pustaka Utama, ISBN: 978-602-03-3211-6)",
    rating: 4.8,
    total_ulasan: 34,
    is_populer: true,
    is_baru: false,
    is_pilihan_pekan: false,
  },
  {
    id: "buku-negeri-5-menara",
    judul: "Negeri 5 Menara",
    subjudul: "Man Jadda Wajada: Impian Enam Santri Menggapai Dunia",
    penulis: "A. Fuadi",
    penerbit: "Gramedia Pustaka Utama",
    tahun: 2009,
    isbn: "978-979-22-4861-6",
    kategori_id: "cat-7",
    kategori_nama: "Pengembangan Diri",
    subkategori: "Motivasi / Pendidikan",
    bahasa: "Indonesia",
    jumlah_halaman: 423,
    edisi: "Cetakan Pertama",
    total_eksemplar: 14,
    eksemplar_tersedia: 7,
    eksemplar_dibooking: 2,
    eksemplar_dipinjam: 5,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 5,
    sinopsis:
      "Enam santri dari latar belakang berbeda berkumpul di bawah menara Pondok Madani. Dengan mantra sakti 'Man Jadda Wajada', mereka bertekad menaklukkan benua-benua impian.",
    deskripsi_lengkap: [
      "Negeri 5 Menara diilhami dari pengalaman nyata penulis selama menempuh pendidikan di Pondok Modern Darussalam Gontor. Tokoh utama, Alif Fikri, pemuda asal Minangkabau, awalnya merasa terpaksa menuruti kehendak ibunya untuk masuk pesantren alih-alih SMA umum favoritnya.",
      "Di Pondok Madani, Alif bersahabat karib dengan lima santri lainnya: Raja dari Medan, Said dari Surabaya, Dulmajid dari Madura, Atang dari Bandung, dan Baso dari Gowa. Di bawah bayangan menara masjid pesantren setiap sore, mereka membayangkan impian besar melintasi benua Asia, Amerika, Afrika, dan Eropa berbekal prinsip 'Man Jadda Wajada' (siapa yang bersungguh-sungguh, ia akan berhasil).",
      "Novel ini memberikan gambaran jernih, modern, dan positif tentang kehidupan santri asrama yang disiplin, berwawasan global, dan menjunjung tinggi adab. Buku ini telah menjadi rujukan motivasi belajar bagi jutaan pelajar di seluruh Indonesia.",
    ],
    nomor_panggil: "813.02 FUA n",
    cover_path: "covers/negeri-5-menara.png",
    cover_url: "/images/covers/negeri-5-menara.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Gramedia Pustaka Utama, ISBN: 978-979-22-4861-6)",
    rating: 4.9,
    total_ulasan: 45,
    is_populer: true,
    is_baru: false,
    is_pilihan_pekan: true,
  },
  {
    id: "buku-perahu-kertas",
    judul: "Perahu Kertas",
    subjudul: "Pertemuan Dua Jiwa Unik, Mimpi, dan Arus Takdir",
    penulis: "Dee Lestari",
    penerbit: "Bentang Pustaka",
    tahun: 2009,
    isbn: "978-979-1227-78-0",
    kategori_id: "cat-8",
    kategori_nama: "Sastra & Bahasa",
    subkategori: "Novel / Romansa Remaja",
    bahasa: "Indonesia",
    jumlah_halaman: 444,
    edisi: "Edisi Khusus Bentang",
    total_eksemplar: 10,
    eksemplar_tersedia: 5,
    eksemplar_dibooking: 1,
    eksemplar_dipinjam: 4,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 4,
    sinopsis:
      "Kugy sang pemimpi pencinta dongeng dan Keenan pelukis muda berbakat. Dua hati yang saling melengkapi namun harus berlayar di atas perahu kertas mengikuti pasang surut kenyataan hidup.",
    deskripsi_lengkap: [
      "Perahu Kertas mengisahkan dinamika hubungan antara Kugy, gadis eksentrik yang bercita-cita menjadi juru dongeng anak, dan Keenan, pemuda cerdas yang memiliki bakat melukis luar biasa namun dipaksa ayahnya untuk kuliah di jurusan ekonomi. Pertemuan pertama mereka di Bandung melahirkan keserasian batin yang tidak pernah mereka rasakan sebelumnya.",
      "Meskipun memiliki perasaan yang sama kuatnya, berbagai situasi, kesalahpahaman, dan komitmen lain membuat keduanya memilih memendam rasa. Keenan terinspirasi oleh dongeng-dongeng karya Kugy untuk menghasilkan lukisan bernyawa tinggi, sementara Kugy terus melipat perahu kertas dan menghanyutkannya ke aliran air sebagai ritual penyampai pesan rahasianya kepada Dewa Neptunus.",
      "Dee Lestari menyajikan cerita yang memikat tentang eksplorasi jati diri anak muda, keberanian memperjuangkan panggilan jiwa, dan keikhlasan menerima takdir cinta. Gaya penceritaan yang ringan namun emosional menjadikan novel ini karya klasik modern Indonesia yang selalu dirindukan.",
    ],
    nomor_panggil: "813.02 LES p",
    cover_path: "covers/perahu-kertas.png",
    cover_url: "/images/covers/perahu-kertas.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Bentang Pustaka, ISBN: 978-979-1227-78-0)",
    rating: 4.8,
    total_ulasan: 37,
    is_populer: false,
    is_baru: false,
    is_pilihan_pekan: true,
  },
  {
    id: "buku-pulang",
    judul: "Pulang",
    subjudul: "Pertarungan Shadow Economy, Kesetiaan, dan Arti Rumah Sejati",
    penulis: "Tere Liye",
    penerbit: "Republika Penerbit",
    tahun: 2015,
    isbn: "978-602-0822-12-9",
    kategori_id: "cat-8",
    kategori_nama: "Sastra & Bahasa",
    subkategori: "Fiksi Aksi / Petualangan",
    bahasa: "Indonesia",
    jumlah_halaman: 400,
    edisi: "Cetakan Pertama",
    total_eksemplar: 12,
    eksemplar_tersedia: 6,
    eksemplar_dibooking: 2,
    eksemplar_dipinjam: 4,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 4,
    sinopsis:
      "Bujang, si Babi Hutan dari pedalaman Sumatra, menjelma menjadi jagal sekaligus otak di lingkaran elit shadow economy keluarga Tong. Namun hatinya terus mencari arti sejati pulang.",
    deskripsi_lengkap: [
      "Pulang menyajikan kisah penuh aksi tentang Bujang, seorang pemuda yang tumbuh di pedalaman hutan Bukit Barisan. Sejak kecil ia diajarkan untuk tidak pernah mengenal rasa takut. Ketika Tauke Muda mengajaknya bergabung dengan Keluarga Tong, Bujang bertransformasi dari pemburu babi hutan menjadi lulusan ekonomi luar negeri sekaligus eksekutor paling disegani dalam jaringan ekonomi bayangan (shadow economy).",
      "Di balik gemerlap dunia kejahatan terorganisasi dan adu strategi tingkat tinggi di berbagai belahan dunia, Bujang dihadapkan pada pengkhianatan internal yang mengancam kehancuran Keluarga Tong. Di tengah dentuman peluru dan pertempuran hidup mati, ia mulai merenungkan pesan mendalam sang ibunda tentang kesucian hati dan jalan kembali menuju fitrah.",
      "Tere Liye memadukan koreografi aksi yang memukau, intrik bisnis global, dan nilai-nilai spiritual yang kokoh. Buku ini menyadarkan pembaca bahwa sejauh apa pun seseorang melangkah dan sehebat apa pun kekuasaan yang diraih, tempat pulang paling bermakna adalah kedamaian batin dan pelukan orang tua.",
    ],
    nomor_panggil: "813.02 TER p",
    cover_path: "covers/pulang.png",
    cover_url: "/images/covers/pulang.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Republika Penerbit, ISBN: 978-602-0822-12-9)",
    rating: 4.9,
    total_ulasan: 44,
    is_populer: true,
    is_baru: false,
    is_pilihan_pekan: false,
  },
  {
    id: "buku-rindu",
    judul: "Rindu",
    subjudul: "Lima Pertanyaan Besar tentang Takdir dan Masa Lalu di Atas Kapal Haji",
    penulis: "Tere Liye",
    penerbit: "Republika Penerbit",
    tahun: 2014,
    isbn: "978-602-8997-90-4",
    kategori_id: "cat-5",
    kategori_nama: "Keislaman & Akhlak",
    subkategori: "Fiksi Sejarah Islami",
    bahasa: "Indonesia",
    jumlah_halaman: 544,
    edisi: "Cetakan Pertama",
    total_eksemplar: 12,
    eksemplar_tersedia: 5,
    eksemplar_dibooking: 2,
    eksemplar_dipinjam: 5,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 4,
    sinopsis:
      "Pelayaran kapal uap van der Wijck tahun 1938 menuju tanah suci Mekkah, merangkum perjalanan batin para jemaah dalam memecahkan lima teka-teki takdir, kebencian, dan cinta sejati.",
    deskripsi_lengkap: [
      "Rindu berlatar tahun 1938 pada era Hindia Belanda, mengisahkan pelayaran kapal uap van der Wijck yang membawa jemaah haji dari pelabuhan Makassar menuju Mekkah. Perjalanan lintas samudra yang memakan waktu berbulan-bulan ini menjadi wadah bertemunya beragam tokoh dengan luka masa lalu dan kegelisahan batin masing-masing.",
      "Di atas kapal, Gurutta Ahmad Daud, seorang ulama kharismatik yang dihormati, menjadi tempat bertanya bagi para penumpang. Ada pertanyaan tentang cara mengikhlaskan kehilangan anak tercinta, cara memaafkan pengkhianatan masa lampau, hingga pertanyaan tentang cinta sejati yang tak pernah tersampaikan selama puluhan tahun.",
      "Tere Liye menghadirkan novel bernuansa sejarah yang kaya akan pelajaran tasawuf dan psikologi manusia. Melalui bahasa yang teduh dan menyentuh, buku ini mengajak pembaca menyelami makna kerinduan hakiki manusia kepada ampunan Allah dan kedamaian jiwa.",
    ],
    nomor_panggil: "297.4 TER r",
    cover_path: "covers/rindu.png",
    cover_url: "/images/covers/rindu.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Republika Penerbit, ISBN: 978-602-8997-90-4)",
    rating: 4.8,
    total_ulasan: 38,
    is_populer: true,
    is_baru: false,
    is_pilihan_pekan: true,
  },
  {
    id: "buku-seperti-dendam",
    judul: "Seperti Dendam, Rindu Harus Dibayar Tuntas",
    subjudul: "Keberanian, Kejantanan, dan Luka Masa Lalu Ajo Kawir",
    penulis: "Eka Kurniawan",
    penerbit: "Gramedia Pustaka Utama",
    tahun: 2014,
    isbn: "978-602-03-0863-0",
    kategori_id: "cat-8",
    kategori_nama: "Sastra & Bahasa",
    subkategori: "Sastra Kontemporer / Aksi",
    bahasa: "Indonesia",
    jumlah_halaman: 256,
    edisi: "Cetakan Pertama",
    total_eksemplar: 8,
    eksemplar_tersedia: 3,
    eksemplar_dibooking: 1,
    eksemplar_dipinjam: 4,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 3,
    sinopsis:
      "Ajo Kawir, jagoan petarung jalanan yang tak kenal takut mati, menyembunyikan kelemahan rahasia akibat trauma masa kecil. Hanya perempuan tangguh Iteung yang mampu menyentuh sisi terdalam hidupnya.",
    deskripsi_lengkap: [
      "Seperti Dendam, Rindu Harus Dibayar Tuntas merupakan penghormatan Eka Kurniawan terhadap novel aksi jalanan Indonesia era 1980-an, namun dengan muatan dekonstruksi psikologis yang tajam. Tokoh utama, Ajo Kawir, dikenal sebagai jagoan pemberani yang selalu mencari perkelahian karena tidak takut mati.",
      "Di balik keganasannya, Ajo Kawir menyembunyikan kondisi impotensi yang dialaminya sejak menyaksikan peristiwa pemerkosaan traumatis di masa kanak-kanak. Kehidupannya berubah saat ia bertarung melawan Iteung, perempuan pengawal tangguh yang justru berhasil mengalahkannya sekaligus menumbuhkan benih cinta yang tulus.",
      "Eka Kurniawan menyuguhkan narasi bertenaga tinggi, sarat humor gelap dan satir tajam terhadap konsep maskulinitas toksik di masyarakat. Novel ini telah diadaptasi ke layar lebar dan memenangkan penghargaan Golden Leopard di Locarno International Film Festival.",
    ],
    nomor_panggil: "813.02 KUR s",
    cover_path: "covers/seperti-dendam-rindu-harus-dibayar-tuntas.png",
    cover_url: "/images/covers/seperti-dendam-rindu-harus-dibayar-tuntas.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Gramedia Pustaka Utama, ISBN: 978-602-03-0863-0)",
    rating: 4.7,
    total_ulasan: 29,
    is_populer: false,
    is_baru: false,
    is_pilihan_pekan: false,
  },
  {
    id: "buku-tentang-kamu",
    judul: "Tentang Kamu",
    subjudul: "Penyelidikan Warisan Triliunan Rupiah dan Jejak Hidup Sri Ningsih",
    penulis: "Tere Liye",
    penerbit: "Republika Penerbit",
    tahun: 2016,
    isbn: "978-602-0822-34-1",
    kategori_id: "cat-8",
    kategori_nama: "Sastra & Bahasa",
    subkategori: "Fiksi Inspiratif / Misteri",
    bahasa: "Indonesia",
    jumlah_halaman: 524,
    edisi: "Cetakan Pertama",
    total_eksemplar: 13,
    eksemplar_tersedia: 6,
    eksemplar_dibooking: 2,
    eksemplar_dipinjam: 5,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 5,
    sinopsis:
      "Zaman Zulkarnaen, pengacara muda di London, ditugaskan melacak ahli waris Sri Ningsih, wanita sederhana asal Pulau Bungin yang meninggalkan warisan bernilai satu miliar poundsterling.",
    deskripsi_lengkap: [
      "Tentang Kamu menghadirkan perpaduan memikat antara misteri hukum internasional dan kisah perjuangan hidup seorang perempuan tangguh. Zaman Zulkarnaen, seorang pengacara muda dari firma hukum bergengsi Thompson & Co di London, mendapat mandat untuk menelusuri keabsahan surat wasiat Sri Ningsih yang baru saja wafat di panti jompo Paris.",
      "Penyelidikan Zaman membawanya menyusuri jejak hidup Sri Ningsih melalui catatan di buku harian tuanya. Dari masa kecil yang perih di Pulau Bungin Sumbawa, perjuangan hidup di Batavia pasca-kemerdekaan, dinamika bisnis busana di London, hingga masa senjanya di Paris. Setiap lembar hidup Sri Ningsih diwarnai ketabahan luar biasa menghadapi pengkhianatan dan derita.",
      "Tere Liye berhasil menyusun plot investigatif yang sarat emosi dan kejutan. Novel ini menjadi refleksi berharga tentang ketulusan hati, kekuatan memaafkan, dan keikhlasan menjalani setiap takdir hidup tanpa pernah mengeluh.",
    ],
    nomor_panggil: "813.02 TER t",
    cover_path: "covers/tentang-kamu.png",
    cover_url: "/images/covers/tentang-kamu.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Republika Penerbit, ISBN: 978-602-0822-34-1)",
    rating: 4.9,
    total_ulasan: 49,
    is_populer: true,
    is_baru: true,
    is_pilihan_pekan: true,
  },
  {
    id: "buku-psychology-of-money",
    judul: "The Psychology of Money",
    subjudul: "Pelajaran Abadi Mengenai Kekayaan, Ketamakan, dan Kebahagiaan",
    penulis: "Morgan Housel",
    penerbit: "Penerbit Baca",
    tahun: 2021,
    isbn: "978-623-94943-4-7",
    kategori_id: "cat-7",
    kategori_nama: "Pengembangan Diri",
    subkategori: "Finansial / Literasi Keuangan",
    bahasa: "Indonesia",
    jumlah_halaman: 268,
    edisi: "Cetakan Kesepuluh",
    total_eksemplar: 16,
    eksemplar_tersedia: 8,
    eksemplar_dibooking: 2,
    eksemplar_dipinjam: 6,
    eksemplar_perbaikan: 0,
    jumlah_antrean: 0,
    maks_antrean: 5,
    sinopsis:
      "Kunci keberhasilan mengelola uang bukanlah seberapa pintar Anda di bidang matematika keuangan, melainkan bagaimana Anda mengendalikan perilaku dan ego psikologis Anda.",
    deskripsi_lengkap: [
      "The Psychology of Money menyajikan pendekatan segar dan revolusioner mengenai pengelolaan kekayaan finansial. Morgan Housel, mantan kolumnis Wall Street Journal, menegaskan bahwa kesuksesan finansial tidak semata-mata ditentukan oleh kecerdasan rumus matematika, melainkan oleh faktor perilaku (soft skill) seseorang saat berhubungan dengan uang.",
      "Melalui 19 cerita pendek bernas yang bersumber dari sejarah, psikologi, dan pengamatan dunia bisnis, buku ini mengupas berbagai ilusi finansial, bias keserakahan, dan pentingnya rasa cukup. Housel menjelaskan mengapa orang kaya bisa jatuh bangkrut karena ego mereka, sementara petugas kebersihan biasa bisa mewariskan jutaan dolar berkat kebiasaan berhemat dan kekuatan waktu (compounding interest).",
      "Diterjemahkan secara apik ke dalam bahasa Indonesia oleh Penerbit Baca, buku ini merupakan bacaan wajib bagi generasi muda, santri, dan calon profesional untuk membangun kemerdekaan finansial yang sehat, rasional, dan berkelanjutan.",
    ],
    nomor_panggil: "332.024 HOU p",
    cover_path: "covers/the-psychology-of-money.png",
    cover_url: "/images/covers/the-psychology-of-money.png",
    sumber_cover: "Koleksi Resmi Perpustakaan (Penerbit Baca, ISBN: 978-623-94943-4-7)",
    rating: 4.9,
    total_ulasan: 72,
    is_populer: true,
    is_baru: true,
    is_pilihan_pekan: true,
  },
];

export interface MockUserActiveReservation {
  id: string;
  jenis: "booking" | "antre";
  buku_id: string;
  buku_judul: string;
  buku_penulis: string;
  kode_booking?: string;
  nomor_induk_eksemplar?: string;
  status: "siap_diambil" | "antre";
  posisi_antrean?: number;
  total_antrean?: number;
  waktu_tenggat_iso: string; // ISO timestamp
  sisa_waktu_teks: string;   // misal "18 jam 30 menit"
}

export interface MockUserSession {
  id: string;
  nama: string;
  identitas: string; // NISN / NIP
  peran: "warga" | "pustakawan" | "admin";
  kelas_atau_unit: string;
  denda_aktif: number;
  is_blocked: boolean;
  foto_path?: string | null;
  foto_url?: string | null;
  reservasi_aktif: MockUserActiveReservation | null;
}

export const MOCK_LOGGED_IN_USER: MockUserSession = {
  id: "usr-01",
  nama: "Muhammad Fadhil",
  identitas: "0061234567",
  peran: "warga",
  kelas_atau_unit: "XII SIJA 1",
  denda_aktif: 0,
  is_blocked: false,
  foto_path: "avatars/user-1.png",
  foto_url: "/images/avatars/user-1.png",
  reservasi_aktif: {
    id: "res-101",
    jenis: "booking",
    buku_id: "buku-bumi",
    buku_judul: "Bumi",
    buku_penulis: "Tere Liye",
    kode_booking: "BKG-202611-0042",
    nomor_induk_eksemplar: "BK-0004",
    status: "siap_diambil",
    waktu_tenggat_iso: "2026-11-20T14:30:00+07:00",
    sisa_waktu_teks: "16 jam tersisa",
  },
};

export const MOCK_POPULAR_SEARCHES: string[] = [
  "Laskar Pelangi",
  "Bumi",
  "Laut Bercerita",
  "Gadis Kretek",
  "Hujan",
  "The Psychology of Money",
];

export interface MockLoanItem {
  id: string;
  nomor_transaksi: string;
  buku_id: string;
  judul_buku: string;
  penulis_buku: string;
  kategori: string;
  cover_url: string;
  nomor_induk_eksemplar: string;
  tanggal_pinjam: string;
  tanggal_jatuh_tempo: string;
  tanggal_kembali?: string | null;
  status: "aktif" | "terlambat" | "kembali" | "perpanjangan_diajukan";
  denda: number;
  sisa_hari: number;
  bisa_diperpanjang: boolean;
  alasan_perpanjangan?: string;
}

export const MOCK_USER_LOANS: MockLoanItem[] = [
  {
    id: "loan-01",
    nomor_transaksi: "TRX-202611-0012",
    buku_id: "buku-bumi",
    judul_buku: "Bumi",
    penulis_buku: "Tere Liye",
    kategori: "Sastra & Bahasa",
    cover_url: "/images/covers/bumi.png",
    nomor_induk_eksemplar: "EXM-0032-01",
    tanggal_pinjam: "14 Nov 2026",
    tanggal_jatuh_tempo: "21 Nov 2026",
    status: "aktif",
    denda: 0,
    sisa_hari: 1,
    bisa_diperpanjang: true,
  },
  {
    id: "loan-02",
    nomor_transaksi: "TRX-202610-0089",
    buku_id: "buku-hujan",
    judul_buku: "Hujan",
    penulis_buku: "Tere Liye",
    kategori: "Sastra & Bahasa",
    cover_url: "/images/covers/hujan.png",
    nomor_induk_eksemplar: "EXM-0021-02",
    tanggal_pinjam: "20 Okt 2026",
    tanggal_jatuh_tempo: "27 Okt 2026",
    tanggal_kembali: "26 Okt 2026",
    status: "kembali",
    denda: 0,
    sisa_hari: 0,
    bisa_diperpanjang: false,
  },
  {
    id: "loan-03",
    nomor_transaksi: "TRX-202610-0045",
    buku_id: "buku-rindu",
    judul_buku: "Rindu",
    penulis_buku: "Tere Liye",
    kategori: "Keislaman & Akhlak",
    cover_url: "/images/covers/rindu.png",
    nomor_induk_eksemplar: "EXM-0041-01",
    tanggal_pinjam: "01 Okt 2026",
    tanggal_jatuh_tempo: "08 Okt 2026",
    tanggal_kembali: "08 Okt 2026",
    status: "kembali",
    denda: 0,
    sisa_hari: 0,
    bisa_diperpanjang: false,
  },
];

export interface MockQueueItem {
  id: string;
  jenis: "booking" | "antrean";
  buku_id: string;
  judul_buku: string;
  penulis_buku: string;
  kategori: string;
  cover_url: string;
  kode_booking?: string;
  nomor_induk_eksemplar?: string;
  status: "siap_diambil" | "menunggu_antrean" | "ditolak" | "selesai" | "kedaluwarsa";
  alasan_penolakan?: string;
  nomor_antrean?: number;
  total_antrean?: number;
  waktu_pengajuan: string;
  batas_ambil_iso?: string;
  sisa_waktu_teks?: string;
}

// Tenggat default booking 24 jam ke depan (23:59:12) untuk live countdown
const DEFAULT_BOOKING_EXPIRY = new Date(Date.now() + 23 * 3600 * 1000 + 59 * 60 * 1000 + 12 * 1000).toISOString();

export const MOCK_USER_QUEUES: MockQueueItem[] = [
  {
    id: "res-101",
    jenis: "booking",
    buku_id: "buku-bumi",
    judul_buku: "Bumi",
    penulis_buku: "Tere Liye",
    kategori: "Sastra & Bahasa",
    cover_url: "/images/covers/bumi.png",
    kode_booking: "BKG-202611-0042",
    nomor_induk_eksemplar: "BK-0004",
    status: "siap_diambil",
    waktu_pengajuan: "20 Nov 2026, 08:30 WIB",
    batas_ambil_iso: DEFAULT_BOOKING_EXPIRY,
    sisa_waktu_teks: "24 jam tersisa",
  },
  {
    id: "res-102",
    jenis: "antrean",
    buku_id: "buku-laut-bercerita",
    judul_buku: "Laut Bercerita",
    penulis_buku: "Leila S. Chudori",
    kategori: "Sastra & Bahasa",
    cover_url: "/images/covers/laut-bercerita.png",
    status: "menunggu_antrean",
    nomor_antrean: 1,
    total_antrean: 3,
    waktu_pengajuan: "18 Nov 2026, 14:15 WIB",
    sisa_waktu_teks: "Menunggu pengembalian peminjam aktif",
  },
];

export interface MockCirculationItem {
  id: string;
  nomor_transaksi: string;
  kode_booking?: string;
  nama_peminjam: string;
  identitas_peminjam: string;
  peran_peminjam: "warga" | "guru" | "staff";
  kelas_atau_unit: string;
  buku_id: string;
  judul_buku: string;
  nomor_induk_eksemplar: string;
  tanggal_pinjam: string;
  tanggal_jatuh_tempo: string;
  status: "aktif" | "terlambat" | "menunggu_booking";
  denda: number;
  keterlambatan_hari: number;
}

export const MOCK_CIRCULATION_ITEMS: MockCirculationItem[] = [
  {
    id: "circ-01",
    nomor_transaksi: "TRX-202611-0012",
    nama_peminjam: "Muhammad Fadhil",
    identitas_peminjam: "0061234567",
    peran_peminjam: "warga",
    kelas_atau_unit: "XII SIJA 1",
    buku_id: "buku-gadis-kretek",
    judul_buku: "Gadis Kretek",
    nomor_induk_eksemplar: "EXM-0032-01",
    tanggal_pinjam: "14 Nov 2026",
    tanggal_jatuh_tempo: "21 Nov 2026",
    status: "aktif",
    denda: 0,
    keterlambatan_hari: 0,
  },
  {
    id: "circ-02",
    nomor_transaksi: "BKG-202611-0042",
    kode_booking: "BKG-202611-0042",
    nama_peminjam: "Muhammad Fadhil",
    identitas_peminjam: "0061234567",
    peran_peminjam: "warga",
    kelas_atau_unit: "XII SIJA 1",
    buku_id: "buku-bumi",
    judul_buku: "Bumi",
    nomor_induk_eksemplar: "BK-0004",
    tanggal_pinjam: "20 Nov 2026",
    tanggal_jatuh_tempo: "21 Nov 2026",
    status: "menunggu_booking",
    denda: 0,
    keterlambatan_hari: 0,
  },
  {
    id: "circ-03",
    nomor_transaksi: "TRX-202611-0005",
    nama_peminjam: "Ananda Pratama",
    identitas_peminjam: "0061234588",
    peran_peminjam: "warga",
    kelas_atau_unit: "XI SIJA 2",
    buku_id: "buku-laut-bercerita",
    judul_buku: "Laut Bercerita",
    nomor_induk_eksemplar: "EXM-0071-01",
    tanggal_pinjam: "05 Nov 2026",
    tanggal_jatuh_tempo: "12 Nov 2026",
    status: "terlambat",
    denda: 4000,
    keterlambatan_hari: 8,
  },
  {
    id: "circ-04",
    nomor_transaksi: "TRX-202611-0009",
    nama_peminjam: "Siti Rahmawati",
    identitas_peminjam: "0061234599",
    peran_peminjam: "warga",
    kelas_atau_unit: "X SIJA 1",
    buku_id: "buku-psychology-of-money",
    judul_buku: "The Psychology of Money",
    nomor_induk_eksemplar: "EXM-0061-02",
    tanggal_pinjam: "15 Nov 2026",
    tanggal_jatuh_tempo: "22 Nov 2026",
    status: "aktif",
    denda: 0,
    keterlambatan_hari: 0,
  },
];

export type EksemplarStatus = "tersedia" | "dibooking" | "dipinjam" | "perbaikan" | "hilang";

export interface MockBookCopy {
  barcode: string;
  buku_id: string;
  buku_judul: string;
  buku_penulis: string;
  nomor_panggil: string;
  status: EksemplarStatus;
  cover_url?: string;
  dialokasikan_ke?: {
    pengguna_id: string;
    nama: string;
    identitas: string;
    jenis: "booking" | "pinjaman";
    tenggat?: string;
  } | null;
}

export const MOCK_BOOK_COPIES: MockBookCopy[] = [
  {
    barcode: "BK-0001",
    buku_id: "buku-laskar",
    buku_judul: "Laskar Pelangi",
    buku_penulis: "Andrea Hirata",
    nomor_panggil: "813.01 HIR l",
    status: "tersedia",
    cover_url: "/images/covers/laskar-pelangi.png",
    dialokasikan_ke: null,
  },
  {
    barcode: "BK-0002",
    buku_id: "buku-laskar",
    buku_judul: "Laskar Pelangi",
    buku_penulis: "Andrea Hirata",
    nomor_panggil: "813.01 HIR l",
    status: "dibooking",
    cover_url: "/images/covers/laskar-pelangi.png",
    dialokasikan_ke: {
      pengguna_id: "usr-05",
      nama: "Ahmad Dahlan",
      identitas: "0061234590",
      jenis: "booking",
      tenggat: "21 Nov 2026, 09:00 WIB",
    },
  },
  {
    barcode: "BK-0003",
    buku_id: "buku-laskar",
    buku_judul: "Laskar Pelangi",
    buku_penulis: "Andrea Hirata",
    nomor_panggil: "813.01 HIR l",
    status: "dipinjam",
    cover_url: "/images/covers/laskar-pelangi.png",
    dialokasikan_ke: {
      pengguna_id: "usr-04",
      nama: "Siti Rahmawati",
      identitas: "0061234599",
      jenis: "pinjaman",
      tenggat: "22 Nov 2026",
    },
  },
  {
    barcode: "BK-0004",
    buku_id: "buku-bumi",
    buku_judul: "Bumi",
    buku_penulis: "Tere Liye",
    nomor_panggil: "813.02 TER b",
    status: "dibooking",
    cover_url: "/images/covers/bumi.png",
    dialokasikan_ke: {
      pengguna_id: "usr-01",
      nama: "Muhammad Fadhil",
      identitas: "0061234567",
      jenis: "booking",
      tenggat: "21 Nov 2026, 14:30 WIB",
    },
  },
  {
    barcode: "BK-0005",
    buku_id: "buku-bumi",
    buku_judul: "Bumi",
    buku_penulis: "Tere Liye",
    nomor_panggil: "813.02 TER b",
    status: "tersedia",
    cover_url: "/images/covers/bumi.png",
    dialokasikan_ke: null,
  },
  {
    barcode: "BK-0006",
    buku_id: "buku-hujan",
    buku_judul: "Hujan",
    buku_penulis: "Tere Liye",
    nomor_panggil: "813.02 TER h",
    status: "tersedia",
    cover_url: "/images/covers/hujan.png",
    dialokasikan_ke: null,
  },
  {
    barcode: "BK-0007",
    buku_id: "buku-hujan",
    buku_judul: "Hujan",
    buku_penulis: "Tere Liye",
    nomor_panggil: "813.02 TER h",
    status: "perbaikan",
    cover_url: "/images/covers/hujan.png",
    dialokasikan_ke: null,
  },
  {
    barcode: "BK-0008",
    buku_id: "buku-janji",
    buku_judul: "Janji",
    buku_penulis: "Tere Liye",
    nomor_panggil: "297.4 TER j",
    status: "hilang",
    cover_url: "/images/covers/janji.png",
    dialokasikan_ke: null,
  },
  {
    barcode: "EXM-0021-02",
    buku_id: "buku-laut-bercerita",
    buku_judul: "Laut Bercerita",
    buku_penulis: "Leila S. Chudori",
    nomor_panggil: "813.02 CHU l",
    status: "tersedia",
    cover_url: "/images/covers/laut-bercerita.png",
    dialokasikan_ke: null,
  },
  {
    barcode: "EXM-0032-01",
    buku_id: "buku-gadis-kretek",
    buku_judul: "Gadis Kretek",
    buku_penulis: "Ratih Kumala",
    nomor_panggil: "813.02 KUM g",
    status: "dipinjam",
    cover_url: "/images/covers/gadis-kretek.png",
    dialokasikan_ke: {
      pengguna_id: "usr-01",
      nama: "Muhammad Fadhil",
      identitas: "0061234567",
      jenis: "pinjaman",
      tenggat: "21 Nov 2026",
    },
  },
  {
    barcode: "EXM-0071-01",
    buku_id: "buku-laut-bercerita",
    buku_judul: "Laut Bercerita",
    buku_penulis: "Leila S. Chudori",
    nomor_panggil: "813.02 CHU l",
    status: "dipinjam",
    cover_url: "/images/covers/laut-bercerita.png",
    dialokasikan_ke: {
      pengguna_id: "usr-03",
      nama: "Ananda Pratama",
      identitas: "0061234588",
      jenis: "pinjaman",
      tenggat: "12 Nov 2026",
    },
  },
];

export interface MockMemberPersona {
  id: string;
  nama: string;
  identitas: string; // NISN
  kelas_atau_unit: string;
  status_kelayakan: "memenuhi_syarat" | "ada_denda" | "kuota_penuh" | "diblokir";
  alasan_kelayakan?: string;
  denda: number;
  pinjaman_aktif_count: number;
  booking_aktif: {
    id: string;
    buku_id: string;
    buku_judul: string;
    barcode_eksemplar: string;
    kode_booking: string;
    waktu_tenggat: string;
    sisa_waktu_teks: string;
  } | null;
  foto_url: string;
}

export const MOCK_MEMBERS: MockMemberPersona[] = [
  {
    id: "usr-01",
    nama: "Muhammad Fadhil",
    identitas: "0061234567",
    kelas_atau_unit: "XII SIJA 1",
    status_kelayakan: "memenuhi_syarat",
    denda: 0,
    pinjaman_aktif_count: 0,
    booking_aktif: {
      id: "res-101",
      buku_id: "buku-bumi",
      buku_judul: "Bumi",
      barcode_eksemplar: "BK-0004",
      kode_booking: "BKG-202611-0042",
      waktu_tenggat: "21 Nov 2026, 14:30 WIB",
      sisa_waktu_teks: "16 jam tersisa",
    },
    foto_url: "/images/avatars/user-1.png",
  },
  {
    id: "usr-02",
    nama: "Farhan Rizki Pratama",
    identitas: "0061234577",
    kelas_atau_unit: "XI SIJA 1",
    status_kelayakan: "memenuhi_syarat",
    denda: 0,
    pinjaman_aktif_count: 0,
    booking_aktif: null,
    foto_url: "/images/avatars/user-2.png",
  },
  {
    id: "usr-03",
    nama: "Ananda Pratama",
    identitas: "0061234588",
    kelas_atau_unit: "XI SIJA 2",
    status_kelayakan: "ada_denda",
    alasan_kelayakan: "Memiliki denda keterlambatan sebesar Rp 4.000 yang belum dilunasi.",
    denda: 4000,
    pinjaman_aktif_count: 1,
    booking_aktif: null,
    foto_url: "/images/avatars/user-3.png",
  },
  {
    id: "usr-04",
    nama: "Siti Rahmawati",
    identitas: "0061234599",
    kelas_atau_unit: "X SIJA 1",
    status_kelayakan: "kuota_penuh",
    alasan_kelayakan: "Telah mencapai batas maksimal 1 peminjaman buku aktif (The Psychology of Money).",
    denda: 0,
    pinjaman_aktif_count: 1,
    booking_aktif: null,
    foto_url: "/images/avatars/user-1.png",
  },
  {
    id: "usr-05",
    nama: "Ahmad Dahlan",
    identitas: "0061234590",
    kelas_atau_unit: "X SIJA 2",
    status_kelayakan: "memenuhi_syarat",
    denda: 0,
    pinjaman_aktif_count: 0,
    booking_aktif: {
      id: "res-103",
      buku_id: "buku-laskar",
      buku_judul: "Laskar Pelangi",
      barcode_eksemplar: "BK-0002",
      kode_booking: "BKG-202611-0088",
      waktu_tenggat: "21 Nov 2026, 09:00 WIB",
      sisa_waktu_teks: "10 jam tersisa",
    },
    foto_url: "/images/avatars/user-2.png",
  },
];

export interface MockAuditLog {
  id: string;
  waktu: string;
  aktor: string;
  aksi: string;
  target: string;
  tipe: "sirkulasi" | "eksemplar" | "pengguna" | "sistem";
}

export const MOCK_AUDIT_LOGS: MockAuditLog[] = [
  {
    id: "log-01",
    waktu: "20 Nov 2026, 08:30 WIB",
    aktor: "Muhammad Fadhil (0061234567)",
    aksi: "Pengajuan Peminjaman Eksemplar",
    target: "Bumi (BK-0004)",
    tipe: "sirkulasi",
  },
  {
    id: "log-02",
    waktu: "19 Nov 2026, 14:10 WIB",
    aktor: "Ibu Nurul Hidayah (PUST-001)",
    aksi: "Pencetakan Barcode Eksemplar Baru",
    target: "BK-0001 s/d BK-0008",
    tipe: "eksemplar",
  },
  {
    id: "log-03",
    waktu: "18 Nov 2026, 10:00 WIB",
    aktor: "Pak Ridwan Santoso (ADMIN-001)",
    aksi: "Pembaruan Parameter Aturan Sirkulasi",
    target: "Durasi Pengajuan: 24 Jam, Kuota: 1 Buku",
    tipe: "sistem",
  },
  {
    id: "log-04",
    waktu: "15 Nov 2026, 09:15 WIB",
    aktor: "Pak Ridwan Santoso (ADMIN-001)",
    aksi: "Aktivasi Akun Warga Baru",
    target: "Ahmad Dahlan (0061234590)",
    tipe: "pengguna",
  },
];

export interface MockReview {
  id: string;
  buku_id: string;
  pengguna_id: string;
  pengguna_nama: string;
  pengguna_avatar?: string | null;
  rating: number; // 1-5
  tanggal: string;
  isi: string;
  foto_url?: string | null;
  berguna_count: number;
  user_voted?: "ya" | "tidak" | null;
}

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: "rev-01",
    buku_id: "buku-laskar",
    pengguna_id: "usr-fauzan",
    pengguna_nama: "Ahmad Fauzan",
    pengguna_avatar: "/images/avatars/user-1.png",
    rating: 5,
    tanggal: "20 November 2026",
    isi: "Buku ini sangat menarik. Alur ceritanya bagus dan memberikan banyak pelajaran tentang kehidupan, pengorbanan guru di daerah terpencil, dan arti persahabatan sejati.",
    foto_url: null,
    berguna_count: 12,
  },
  {
    id: "rev-02",
    buku_id: "buku-laskar",
    pengguna_id: "usr-aisyah",
    pengguna_nama: "Nur Aisyah",
    pengguna_avatar: "/images/avatars/user-2.png",
    rating: 4,
    tanggal: "18 November 2026",
    isi: "Ceritanya bagus, tetapi beberapa bagian metafora dan deskripsi suasana terasa cukup panjang. Namun tetap sangat layak dibaca seluruh siswa asrama.",
    foto_url: null,
    berguna_count: 5,
  },
  {
    id: "rev-03",
    buku_id: "buku-laskar",
    pengguna_id: "usr-01",
    pengguna_nama: "Muhammad Fadhil",
    pengguna_avatar: "/images/avatars/user-1.png",
    rating: 5,
    tanggal: "15 November 2026",
    isi: "Kisah perjuangan Lintang yang mengayuh sepeda melintasi rawa buaya demi belajar sangat membakar motivasi kami sebagai santri teknologi di SMK TI Bazma.",
    foto_url: null,
    berguna_count: 9,
  },
  {
    id: "rev-04",
    buku_id: "buku-laskar",
    pengguna_id: "usr-04",
    pengguna_nama: "Siti Rahmawati",
    pengguna_avatar: "/images/avatars/user-3.png",
    rating: 5,
    tanggal: "12 November 2026",
    isi: "Salah satu karya sastra terbaik sepanjang masa yang selalu berhasil membuat terharu. Sangat direkomendasikan untuk koleksi perpustakaan sekolah.",
    foto_url: null,
    berguna_count: 4,
  },
  {
    id: "rev-05",
    buku_id: "buku-laskar",
    pengguna_id: "usr-02",
    pengguna_nama: "Farhan Rizki Pratama",
    pengguna_avatar: "/images/avatars/user-2.png",
    rating: 3,
    tanggal: "10 November 2026",
    isi: "Penuh haru dan inspiratif, tapi gaya bahasanya menuntut konsentrasi tinggi bagi pembaca pemula. Penokohan Mahar dan Lintang sangat berkesan.",
    foto_url: null,
    berguna_count: 2,
  },
  {
    id: "rev-06",
    buku_id: "buku-laskar",
    pengguna_id: "usr-budi",
    pengguna_nama: "Budi Santoso",
    pengguna_avatar: "/images/avatars/user-default.png",
    rating: 5,
    tanggal: "05 November 2026",
    isi: "Karya luar biasa yang membuktikan bahwa tekad belajar mampu menembus segala dinding keterbatasan fasilitas sekolah.",
    foto_url: null,
    berguna_count: 7,
  },
  {
    id: "rev-07",
    buku_id: "buku-laskar",
    pengguna_id: "usr-hendra",
    pengguna_nama: "Hendra Wijaya",
    pengguna_avatar: "/images/avatars/user-default.png",
    rating: 2,
    tanggal: "01 November 2026",
    isi: "Bukunya cukup tebal dan ritme penceritaan di beberapa bab tengah terasa agak lambat bagi saya.",
    foto_url: null,
    berguna_count: 1,
  },
  {
    id: "rev-08",
    buku_id: "buku-bumi",
    pengguna_id: "usr-01",
    pengguna_nama: "Muhammad Fadhil",
    pengguna_avatar: "/images/avatars/user-1.png",
    rating: 5,
    tanggal: "19 November 2026",
    isi: "Serial petualangan dunia paralel yang sangat seru dan imajinatif. Karakter Ali dan Seli melengkapi Raib dengan sempurna.",
    foto_url: null,
    berguna_count: 15,
  },
  {
    id: "rev-09",
    buku_id: "buku-bumi",
    pengguna_id: "usr-02",
    pengguna_nama: "Farhan Rizki Pratama",
    pengguna_avatar: "/images/avatars/user-2.png",
    rating: 4,
    tanggal: "16 November 2026",
    isi: "Pembangunan dunia klan bulan sangat detail dan menarik untuk dibaca di sela-sela waktu istirahat asrama.",
    foto_url: null,
    berguna_count: 6,
  },
];




