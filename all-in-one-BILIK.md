# BILIK --- All-in-One

## Dokumen Konsolidasi Konsep, Workflow, Role, dan Standar Sistem

**Versi:** 1.0 --- Konsolidasi pembahasan\
**Tanggal:** 24 November 2026\
**Status:** Draft spesifikasi kerja; beberapa keputusan masih perlu
validasi\
**Cakupan:** Platform perpustakaan BILIK untuk tahap awal penggunaan di
satu institusi.

> **Catatan sumber dan status:** Dokumen ini disusun dari keputusan dan
> penjelasan yang muncul dalam percakapan perancangan BILIK. File
> `all-in-one.md` versi sebelumnya tidak tersedia untuk diperiksa ulang
> pada sesi penyusunan ini. Karena itu, dokumen ini adalah konsolidasi
> konteks yang telah dibahas, bukan klaim bahwa seluruh isi dokumen lama
> telah disalin atau diverifikasi. Bagian "Perlu dipertimbangkan"
> sengaja memisahkan hal yang belum diputuskan dari keputusan yang sudah
> dinyatakan.

------------------------------------------------------------------------

# Daftar Isi

1.  Ringkasan Proyek
2.  Prinsip dan Ruang Lingkup
3.  Model Pengguna dan Workspace
4.  Role, Permission, dan Kewenangan
5.  Pengalaman Warga
6.  Katalog, Detail Buku, dan Fitur Sosial
7.  Workflow Pengajuan Peminjaman Online
8.  Workflow Antrean FIFO dan Promosi
9.  Workflow Sirkulasi di Meja Petugas
10. Pembatalan dan Penanganan Eksemplar Bermasalah
11. Pengembalian dan Denda
12. Pengelolaan Koleksi dan Inventaris
13. Dashboard dan Laporan
14. Audit Log
15. Sistem Notifikasi
16. Arsitektur Data dan Keamanan
17. Navigasi dan Struktur Route
18. Aturan Bisnis yang Menjadi Baseline
19. Skenario Pengujian
20. Hal yang Masih Perlu Dipertimbangkan
21. Glosarium

------------------------------------------------------------------------

# 1. Ringkasan Proyek

BILIK adalah platform perpustakaan digital untuk mendukung pengalaman
anggota/pemustaka sekaligus operasional perpustakaan. BILIK bukan hanya
katalog buku atau aplikasi administrasi. Platform ini menggabungkan:

-   Pengalaman warga yang menyerupai alur e-commerce: beranda, katalog,
    pencarian, detail buku, favorit, rating/penilaian, ulasan, pengajuan
    peminjaman, antrean, dan pemantauan pinjaman.
-   Workspace Pustakawan untuk menjalankan kegiatan operasional
    perpustakaan.
-   Workspace Admin untuk mengelola seluruh fungsi operasional dan
    administrasi sistem.
-   Sirkulasi buku fisik yang terhubung dengan pengajuan online melalui
    identitas eksemplar/barcode.
-   Pencatatan aktivitas/audit untuk tindakan operasional dan
    administratif.
-   Notifikasi dalam aplikasi dan email untuk warga; notifikasi internal
    aplikasi saja untuk Pustakawan dan Admin.

## 1.1 Prinsip utama

**One platform, one identity, multiple workspaces.**

Satu pengguna memiliki satu akun/identitas. Pengguna yang diberi role
tambahan dapat berpindah workspace tanpa membuat akun kedua atau login
ulang. Workspace menentukan pengalaman antarmuka; role dan permission di
backend menentukan tindakan yang diizinkan.

Admin dan Pustakawan juga tetap dapat menggunakan website dalam mode
Warga untuk mencari, memfavoritkan, memberi penilaian, mengajukan, dan
meminjam buku sesuai aturan anggota.

## 1.2 Tahap implementasi

Tahap awal berfokus pada satu institusi. Kebutuhan multi-tenant/SaaS
untuk sekolah lain belum diputuskan. Arsitektur sebaiknya tidak menutup
kemungkinan pengembangan tenant di masa depan, tetapi fitur manajemen
tenant, billing SaaS, dan super-admin platform tidak perlu menjadi
lingkup tahap pertama.

------------------------------------------------------------------------

# 2. Prinsip dan Ruang Lingkup

## 2.1 Ruang lingkup awal

-   Buku fisik dan eksemplar fisik.
-   Pengajuan peminjaman online.
-   Antrean ketika tidak tersedia eksemplar yang dapat dialokasikan.
-   Konfirmasi peminjaman fisik di meja Pustakawan/Admin.
-   Pengembalian fisik melalui petugas.
-   Denda dan konfirmasi pembayaran manual.
-   Pengelolaan katalog, data master, anggota, eksemplar, dan sirkulasi.
-   Favorit, rating/penilaian, dan fitur sosial buku yang telah
    direncanakan.
-   Notifikasi.
-   Dashboard operasional dan manajerial.
-   Audit log.

## 2.2 Di luar keputusan tahap awal

Hal berikut belum menjadi keputusan implementasi:

-   Peminjaman atau sirkulasi buku digital.
-   Pembayaran denda melalui payment gateway.
-   Integrasi WhatsApp.
-   Push notification browser/perangkat.
-   Multi-tenant operasional penuh untuk banyak sekolah.
-   Billing SaaS.
-   Prosedur lanjutan penghapusan permanen akun.
-   Prosedur khusus persetujuan atau pembebasan denda.

------------------------------------------------------------------------

# 3. Model Pengguna dan Workspace

BILIK memiliki tiga konteks pengalaman.

## 3.1 Warga

Warga adalah pengalaman utama website. Semua akun pengguna yang
berstatus anggota dapat menggunakan fitur warga sesuai kelayakan akun.

Fitur warga mencakup:

-   Beranda bergaya e-commerce.
-   Katalog dan pencarian.
-   Kategori dan filter.
-   Detail buku dan ketersediaan.
-   Favorit.
-   Rating/penilaian dan ulasan.
-   Pengajuan peminjaman.
-   Antrean dan posisi antrean.
-   Countdown pengambilan ketika mendapat alokasi.
-   Pinjaman aktif dan informasi jatuh tempo.
-   Riwayat peminjaman.
-   Denda dan status pembayaran.
-   Profil dan preferensi notifikasi.

Fitur sosial seperti favorit, rating, dan penilaian tetap termasuk dalam
konsep BILIK; fitur tersebut tidak dihilangkan oleh pembahasan role.

## 3.2 Pustakawan

Pustakawan memiliki workspace operasional dengan sidebar dan dashboard.
Pustakawan memiliki kewenangan luas (broad access), termasuk CRUD
seluruh data master buku serta operasi sirkulasi sesuai permission.

## 3.3 Admin

Admin memiliki workspace dengan pola UI yang mirip dengan Pustakawan,
tetapi dashboard lebih komprehensif, menu manajemen lebih luas, dan
akses penuh terhadap seluruh fungsi sistem, termasuk semua fungsi
operasional Pustakawan.

Admin bukan sekadar pengatur kebijakan. Admin juga dapat melakukan
pekerjaan operasional yang sama dengan Pustakawan.

## 3.4 Perpindahan workspace

Pada profil pengguna yang memiliki role tambahan, tampilkan
tombol/opsi: - Mode Warga (pengalaman utama). - Mode Pustakawan (jika
memiliki role Pustakawan). - Mode Admin (jika memiliki role Admin).

Memilih mode pengelola mengarahkan pengguna ke workspace masing-masing.
Pengguna tanpa role terkait tidak boleh dapat mengakses workspace hanya
dengan mengetik URL.

------------------------------------------------------------------------

# 4. Role, Permission, dan Kewenangan

Keputusan awal yang telah ditetapkan:

  ----------------------------------------------------------------------------
  Area                   Warga             Pustakawan        Admin
  ---------------------- ----------------- ----------------- -----------------
  Katalog dan detail     Ya                Ya melalui mode   Ya melalui mode
  buku                                     Warga             Warga

  Favorit, rating,       Ya                Ya melalui mode   Ya melalui mode
  ulasan                                   Warga             Warga

  Mengajukan peminjaman  Ya, sesuai        Ya sebagai        Ya sebagai
                         kelayakan         anggota           anggota

  Mengikuti antrean      Ya, sesuai        Ya sebagai        Ya sebagai
                         kelayakan         anggota           anggota

  CRUD master buku       Tidak             Ya                Ya

  CRUD kategori          Tidak             Ya                Ya

  CRUD                   Tidak             Ya                Ya
  eksemplar/inventaris                                       

  Operasi sirkulasi      Tidak             Ya sesuai         Full
                                           permission        

  Pengelolaan pengguna   Tidak             Terbatas pada     Ya
                                           tugas operasional 
                                           yang diberikan    

  Pemberian/pencabutan   Tidak             Tidak secara      Ya sesuai
  role                                     default           kewenangan

  Pengaturan sistem      Tidak             Tidak secara      Ya
                                           default           

  Audit seluruh pengguna Tidak             Tidak             Ya

  Aktivitas sendiri      Riwayat pribadi   Ya                Ya
  ----------------------------------------------------------------------------

**Catatan:** rincian permission per tindakan harus difinalkan sebelum
implementasi. "Pustakawan broad" berarti kewenangan operasional luas,
bukan otomatis memiliki kewenangan manajemen role atau keamanan sistem.

## 4.1 Pemberian role

-   Role diberikan/dikelola oleh Admin atau pihak manajemen yang secara
    resmi ditunjuk.
-   Pustakawan biasa tidak dapat memberikan role.
-   Penambahan role tidak membuat akun baru.
-   Pencabutan role tidak menghapus identitas pengguna maupun
    riwayatnya.
-   Setiap perubahan role dicatat dalam audit log.
-   Pengguna dapat memiliki lebih dari satu role.

## 4.2 Admin full access

Admin dapat menjalankan seluruh operasi Pustakawan dan fungsi manajemen
sistem. Tindakan sensitif Admin tetap harus dicatat dalam audit log.
Full access bukan berarti jejak audit dapat dihapus atau dimanipulasi.

## 4.3 Aturan anggota untuk akun staf

Admin dan Pustakawan tetap dapat meminjam sebagai Warga. Baseline yang
direkomendasikan adalah aturan kelayakan peminjaman yang sama berlaku
untuk seluruh akun, tanpa bypass karena role staf. Jika institusi ingin
pengecualian, harus ditetapkan secara eksplisit.

------------------------------------------------------------------------

# 5. Pengalaman Warga

## 5.1 Beranda

Beranda merupakan halaman awal website dan mengadopsi pola eksplorasi
e-commerce, antara lain:

-   Banner/hero.
-   Pencarian buku.
-   Kategori.
-   Rekomendasi.
-   Buku terbaru atau pilihan.
-   Ringkasan ketersediaan.
-   Akses menuju katalog dan fitur anggota.

## 5.2 Profil

Profil menampilkan identitas anggota, informasi akun, preferensi
notifikasi, serta akses workspace tambahan apabila pengguna memiliki
role Pustakawan atau Admin.

## 5.3 Area aktivitas anggota

Warga dapat memantau: - Pengajuan yang sedang berjalan. - Posisi
antrean. - Countdown masa pengambilan. - Pinjaman aktif. - Tanggal jatuh
tempo. - Denda dan status konfirmasi pembayaran. - Riwayat transaksi. -
Favorit dan penilaian.

------------------------------------------------------------------------

# 6. Katalog, Detail Buku, dan Fitur Sosial

Fitur berikut tetap menjadi bagian dari konsep BILIK:

-   Katalog buku.
-   Pencarian dan filter.
-   Kategori.
-   Halaman detail buku.
-   Informasi ketersediaan.
-   Favorit.
-   Rating/penilaian.
-   Ulasan/komentar jika termasuk pada rancangan produk.
-   Rekomendasi atau buku terkait.

Ketersediaan pada tingkat judul perlu dibedakan dari ketersediaan pada
tingkat eksemplar. Satu judul dapat mempunyai beberapa eksemplar dengan
barcode dan kondisi yang berbeda.

------------------------------------------------------------------------

# 7. Workflow Pengajuan Peminjaman Online

## 7.1 Prinsip alokasi eksemplar

Pengajuan online dialokasikan ke **eksemplar spesifik**, bukan hanya
judul buku secara umum. Setiap eksemplar mempunyai kode unik/barcode
yang ditempelkan pada buku fisik, misalnya `BK-00047`.

Ketika warga mengajukan judul tertentu: 1. Sistem memeriksa kelayakan
anggota. 2. Sistem memeriksa eksemplar yang tersedia dan layak. 3.
Sistem mengalokasikan satu eksemplar spesifik. 4. Pengajuan menyimpan
referensi eksemplar tersebut. 5. Eksemplar tidak boleh dialokasikan atau
dipinjam oleh anggota lain selama alokasi masih berlaku.

Contoh: - Judul: Laskar Pelangi. - Eksemplar: BK-00047. - Pemohon:
Akbar. - Sistem menyimpan bahwa BK-00047 dialokasikan untuk pengajuan
Akbar.

## 7.2 Jika eksemplar tersedia

Pengajuan memperoleh alokasi dengan batas waktu pengambilan 24 jam
sesuai aturan yang telah dibahas. Countdown ditampilkan pada halaman
aktivitas/pengajuan anggota.

## 7.3 Jika tidak ada eksemplar tersedia

Warga dapat bergabung dalam antrean FIFO jika kapasitas antrean masih
tersedia. Posisi antrean ditampilkan kepada warga.

## 7.4 Status pengajuan

Status berikut merupakan rancangan status yang perlu diselaraskan dengan
status database existing:

-   `PENDING` --- pengajuan dibuat dan menunggu proses/alokasi sesuai
    aturan.
-   `ALLOCATED` --- eksemplar spesifik telah dialokasikan.
-   `QUEUED` --- anggota berada dalam antrean.
-   `CANCELLED` --- pengajuan dibatalkan.
-   `EXPIRED` --- batas waktu pengambilan habis.
-   `COMPLETED` --- pengajuan telah menjadi peminjaman yang
    dikonfirmasi.

Nama dan transisi final perlu mengikuti skema database yang digunakan.

------------------------------------------------------------------------

# 8. Workflow Antrean FIFO dan Promosi

## 8.1 Prinsip FIFO

Anggota yang lebih dahulu masuk antrean mendapatkan prioritas lebih
dahulu. Sistem harus menjaga urutan antrean secara konsisten.

Kapasitas antrean yang pernah disebut sebagai baseline:

  Jumlah eksemplar koleksi     Kapasitas antrean
  -------------------------- -------------------
  1--5 eksemplar                       3 anggota
  6--10 atau lebih                     5 anggota

Rumus/aturan kapasitas untuk jumlah eksemplar di luar rentang tersebut
perlu diverifikasi terhadap aturan implementasi yang sebenarnya.

## 8.2 Promosi antrean

Ketika eksemplar dilepaskan dan tersedia untuk antrean: 1. Sistem
mencari anggota dengan urutan antrean paling awal. 2. Sistem
mengalokasikan eksemplar kepada anggota tersebut. 3. Status antrean
anggota berubah menjadi memperoleh giliran/alokasi. 4. Countdown
pengambilan dimulai. 5. Anggota menerima notifikasi in-app dan email
sesuai preferensi. 6. Anggota berikutnya tetap menunggu.

Keputusan yang telah dinyatakan: ketika Udin berada di urutan pertama
dan memperoleh promosi, Udin langsung menerima countdown dan notifikasi.
Rekomendasi durasi pengambilan untuk promosi adalah 24 jam, konsisten
dengan pengajuan normal.

## 8.3 Promosi harus atomik

Pelepasan eksemplar dan promosi anggota antrean perlu diproses secara
aman dalam transaksi database agar tidak terjadi kondisi eksemplar
tersedia tetapi antrean belum diproses, atau satu eksemplar dialokasikan
ke dua anggota.

------------------------------------------------------------------------

# 9. Workflow Sirkulasi di Meja Petugas

## 9.1 Dua validasi wajib

Konfirmasi peminjaman fisik membutuhkan dua validasi:

1.  **Validasi anggota** --- scan kartu anggota.
2.  **Validasi eksemplar** --- scan barcode buku fisik.

Kedua validasi harus cocok dengan transaksi/alokasi yang akan diproses.
Setelah validasi berhasil dan aturan kelayakan terpenuhi, petugas dapat
mengonfirmasi peminjaman.

## 9.2 Skenario anggota yang memiliki pengajuan online

Contoh Akbar mengajukan Laskar Pelangi dengan eksemplar `BK-00047`.

1.  Akbar datang ke meja petugas.
2.  Petugas scan kartu anggota Akbar.
3.  Sistem menemukan identitas Akbar dan pengajuan aktifnya.
4.  Sistem otomatis menampilkan detail eksemplar yang dialokasikan,
    yaitu BK-00047.
5.  Petugas mengambil/mencocokkan buku fisik di luar sistem.
6.  Petugas scan barcode BK-00047 sebagai validasi akhir.
7.  Jika barcode cocok dan syarat lain terpenuhi, tombol konfirmasi
    aktif.
8.  Petugas mengonfirmasi serah terima.
9.  Sistem membuat/mengaktifkan transaksi peminjaman dan menetapkan
    tanggal jatuh tempo.

Petugas tidak perlu memilih eksemplar secara manual jika pengajuan
online sudah mengikat eksemplar tertentu.

## 9.3 Skenario anggota lain mencoba meminjam eksemplar yang telah dialokasikan

Contoh: - Udin dipindai sebagai anggota. - Petugas memindai BK-00047. -
BK-00047 sedang dialokasikan untuk pengajuan Akbar.

Sistem: - Menolak penggunaan BK-00047 untuk transaksi Udin. - Tidak
mengisi kolom eksemplar sebagai item transaksi Udin. - Menampilkan
peringatan singkat bahwa buku sedang dalam pengajuan anggota lain,
termasuk nama pemohon dan informasi ringkas yang membantu petugas. -
Tidak membuat transaksi peminjaman baru untuk Udin dari scan tersebut.

Contoh pesan: "Buku ini sedang dalam pengajuan Akbar."

## 9.4 Peminjaman langsung di meja

Pembahasan menyebutkan bahwa anggota dapat datang dan meminjam melalui
prosedur sirkulasi di meja, di luar pengajuan online. Untuk skenario
ini, petugas memindai kartu anggota dan barcode buku. Sistem tetap
memeriksa ketersediaan, alokasi aktif, kelayakan anggota, dan aturan
peminjaman.

Membaca buku di tempat/perpustakaan mungkin tidak dicatat sebagai
peminjaman; detail kebijakan ini masih perlu dipastikan.

------------------------------------------------------------------------

# 10. Pembatalan dan Penanganan Eksemplar Bermasalah

## 10.1 Pembatalan sebelum konfirmasi serah terima

Sebelum peminjaman dikonfirmasi, pengajuan/alokasi dapat dibatalkan oleh
petugas sesuai kewenangan. Contoh: - Anggota berubah pikiran. - Anggota
tidak jadi meminjam. - Eksemplar ditemukan rusak saat pemeriksaan
fisik. - Ada alasan lain yang perlu dicatat.

Sistem tidak bertugas menawarkan buku alternatif. Penawaran alternatif
dilakukan petugas kepada anggota di luar sistem. Sistem hanya mencatat
pembatalan dan melepaskan alokasi sesuai aturan.

## 10.2 Alasan pembatalan

Pilihan alasan awal: - `RUSAK` - `LAINNYA`

Jika memilih `LAINNYA`, petugas wajib mengisi kolom keterangan.
Keterangan juga dapat disimpan untuk memperjelas kondisi kerusakan atau
alasan pembatalan bila diperlukan.

Informasi pembatalan minimal: - Pengajuan/transaksi terkait. - Eksemplar
terkait. - Alasan. - Keterangan. - Petugas yang melakukan pembatalan. -
Waktu pembatalan.

## 10.3 Setelah pembatalan

1.  Status pengajuan menjadi dibatalkan.
2.  Alokasi eksemplar dilepaskan.
3.  Jika ada antrean, sistem memeriksa urutan FIFO.
4.  Anggota pertama memperoleh alokasi dan countdown.
5.  Anggota tersebut menerima notifikasi.
6.  Histori pembatalan tetap disimpan.

Jika alasan pembatalan adalah rusak, eksemplar tidak boleh langsung
dianggap tersedia untuk peminjaman berikutnya. Eksemplar perlu ditandai
tidak tersedia/rusak sampai statusnya diperbarui petugas. Jika antrean
dipromosikan, sistem harus memilih eksemplar lain yang benar-benar
tersedia dan layak. Jika tidak ada eksemplar lain, antrean tetap
menunggu.

**Pembedaan penting:** pembatalan pengajuan sebelum serah terima bukan
penghapusan transaksi peminjaman aktif. Jika buku sudah diserahkan dan
pinjaman aktif, koreksi dilakukan melalui mekanisme koreksi transaksi
yang tercatat, bukan dengan menghapus histori.

------------------------------------------------------------------------

# 11. Pengembalian dan Denda

## 11.1 Pengembalian

Pengembalian buku fisik dikonfirmasi oleh Pustakawan/Admin melalui
proses sirkulasi. Petugas memeriksa buku, memindai/mengidentifikasi
eksemplar, lalu mengonfirmasi pengembalian.

Status dan kondisi eksemplar harus diperbarui sesuai hasil pemeriksaan.
Jika buku rusak atau tidak lengkap, penanganan khusus masih perlu
difinalkan.

## 11.2 Aturan denda

Baseline yang pernah disebut dalam pembahasan:

-   Denda keterlambatan: Rp500 per hari per buku.
-   Batas denda pemblokiran: Rp1.000 atau lebih.
-   Denda yang belum dikonfirmasi lunas menghalangi anggota melakukan
    pengajuan peminjaman baru atau masuk antrean.
-   Pustakawan/Admin mengonfirmasi pembayaran secara manual setelah
    pembayaran dilakukan di luar sistem.
-   Sistem tidak menggunakan payment gateway pada tahap awal.

## 11.3 Status pembayaran

Status minimal tahap awal: - `UNPAID` --- belum dikonfirmasi lunas oleh
petugas. - `PAID` --- sudah dikonfirmasi lunas oleh Pustakawan/Admin.

`WAIVED`/pembebasan denda belum menjadi fitur yang disetujui dan perlu
keputusan tersendiri.

## 11.4 Data konfirmasi pembayaran

Minimal simpan: - ID denda. - Jumlah yang dikonfirmasi. - Petugas yang
mengonfirmasi. - Waktu konfirmasi. - Status pembayaran. - Referensi
pinjaman/pengembalian terkait.

Sistem hanya mengetahui bahwa petugas telah mengonfirmasi pembayaran.
Sistem tidak memverifikasi transfer atau penerimaan uang secara
otomatis.

## 11.5 Kelayakan anggota

Pengecekan denda harus dilakukan di backend ketika anggota mencoba
membuat pengajuan atau bergabung dalam antrean. Menyembunyikan tombol di
frontend saja tidak cukup.

------------------------------------------------------------------------

# 12. Pengelolaan Koleksi dan Inventaris

## 12.1 Kewenangan Pustakawan

Pustakawan harus dapat melakukan CRUD terhadap seluruh data master buku
dan data terkait operasional koleksi, termasuk: - Data buku. -
Kategori. - Eksemplar. - Barcode. - Status dan kondisi eksemplar. - Data
terkait inventaris sesuai permission.

Admin memiliki kewenangan yang sama dan lebih luas.

## 12.2 Histori dan penghapusan

Rekomendasi: - Data master yang belum pernah direferensikan transaksi
dapat dihapus sesuai validasi. - Buku/eksemplar yang memiliki histori
transaksi sebaiknya diarsipkan atau dinonaktifkan, bukan dihapus secara
fisik dari database. - Perubahan data master dan status eksemplar
dicatat sesuai kebijakan audit.

## 12.3 Opname

Pembahasan menyebutkan bahwa opname belum dilakukan secara penuh dan
data ketersediaan dapat berbeda dengan kondisi fisik. BILIK perlu
mendukung pembaruan kondisi/keberadaan eksemplar oleh petugas. Detail
modul opname, jadwal, proses pencocokan, dan penanganan selisih belum
ditetapkan.

------------------------------------------------------------------------

# 13. Dashboard dan Laporan

## 13.1 Dashboard Pustakawan

Dashboard berorientasi pekerjaan operasional harian, misalnya: -
Pengajuan yang perlu diproses. - Peminjaman hari ini. - Pengembalian
hari ini. - Buku terlambat. - Antrean aktif. - Denda yang perlu
dikonfirmasi. - Aktivitas Pustakawan sendiri. - Kondisi eksemplar yang
perlu diperhatikan.

## 13.2 Dashboard Admin

Dashboard Admin menggunakan pola layout yang sama, tetapi lebih
komprehensif: - KPI keseluruhan. - Grafik tren peminjaman dan
pengembalian. - Statistik anggota. - Statistik antrean dan pengajuan. -
Analisis keterlambatan dan denda. - Analisis koleksi dan inventaris. -
Aktivitas seluruh pengguna/petugas. - Laporan manajemen. - Akses audit
log dan pengaturan sistem.

Perbedaan utama bukan hanya jumlah tombol. Dashboard Pustakawan membantu
menyelesaikan pekerjaan; dashboard Admin membantu memantau dan mengelola
keseluruhan institusi serta tetap dapat menjalankan pekerjaan
operasional.

------------------------------------------------------------------------

# 14. Audit Log

## 14.1 Tujuan

Audit log mencatat siapa melakukan tindakan apa, pada objek apa, kapan,
dan perubahan apa yang terjadi. Audit log berbeda dari notifikasi.

-   Audit log adalah catatan pertanggungjawaban.
-   Notifikasi adalah pesan yang perlu diketahui penerima.

## 14.2 Tampilan berdasarkan role

  -----------------------------------------------------------------------
  Kemampuan               Pustakawan              Admin
  ----------------------- ----------------------- -----------------------
  Melihat aktivitas       Ya                      Ya
  sendiri                                         

  Melihat aktivitas       Sesuai kewenangan       Ya
  operasional                                     

  Melihat aktivitas semua Tidak secara default    Ya
  petugas                                         

  Melihat perubahan       Tidak secara default    Ya
  role/pengaturan                                 
  sensitif                                        

  Menghapus/mengubah log  Tidak                   Tidak
  -----------------------------------------------------------------------

## 14.3 Aktivitas yang dicatat

Minimal: - Login/logout dan aktivitas autentikasi yang relevan. -
Perubahan workspace jika diperlukan untuk keamanan. - Pengajuan
dibatalkan. - Alokasi dilepas atau dipromosikan. - Peminjaman
dikonfirmasi. - Pengembalian dikonfirmasi. - Koreksi transaksi. -
Perubahan kondisi eksemplar. - CRUD buku/kategori/eksemplar. -
Pencatatan dan konfirmasi denda. - Perubahan akun. -
Pemberian/pencabutan role. - Perubahan kebijakan dan konfigurasi. -
Tindakan sensitif yang gagal jika relevan.

## 14.4 Data audit yang direkomendasikan

-   `id`
-   `actor_user_id`
-   `role_context`
-   `workspace`
-   `action`
-   `entity_type`
-   `entity_id`
-   `old_value`
-   `new_value`
-   `reason`
-   `created_at`
-   metadata teknis yang relevan dan aman.

Audit log harus dibuat di server. Pengguna biasa maupun Admin tidak
boleh mengubah atau menghapus jejak audit. Jangan simpan password,
token, atau rahasia autentikasi dalam payload audit.

------------------------------------------------------------------------

# 15. Sistem Notifikasi

## 15.1 Kebijakan saluran

Keputusan yang telah dinyatakan: - Warga: notifikasi in-app dan email. -
Pustakawan: notifikasi in-app saja, tidak melalui email. - Admin:
notifikasi in-app saja, tidak melalui email.

Push notification belum menjadi kebutuhan tahap pertama.

## 15.2 Preferensi warga

Pengaturan notifikasi tersedia di profil. Warga dapat mengatur
preferensi email berdasarkan kategori informasi. Notifikasi penting
dalam aplikasi tetap aktif. Email harus dikirim ke alamat yang telah
diverifikasi sebelum digunakan.

## 15.3 Event notifikasi warga

  -------------------------------------------------------------------------
  Event           Waktu                         In-app                Email
  --------------- --------------- -------------------- --------------------
  Pengajuan       Setelah                           Ya                   Ya
  berhasil dibuat tersimpan                            

  Berhasil masuk  Setelah antrean                   Ya                   Ya
  antrean         tersimpan                            

  Eksemplar       Setelah alokasi                   Ya                   Ya
  dialokasikan    berhasil                             

  Mendapat        Setelah promosi                   Ya                   Ya
  giliran antrean FIFO                                 

  Pengingat       Sebelum batas                     Ya                   Ya
  pengambilan     waktu                                

  Pengajuan       Setelah                           Ya                   Ya
  dibatalkan      pembatalan                           
                  tersimpan                            

  Peminjaman      Setelah serah                     Ya                   Ya
  dikonfirmasi    terima                               
                  dikonfirmasi                         

  Pengingat jatuh Sebelum jatuh                     Ya                   Ya
  tempo           tempo                                

  Pinjaman        Saat status                       Ya                   Ya
  terlambat       terlambat                            
                  terdeteksi                           

  Denda tercatat  Setelah denda                     Ya                   Ya
                  dibuat                               

  Denda           Setelah petugas                   Ya                   Ya
  dikonfirmasi    mengonfirmasi                        
  lunas                                                

  Pengembalian    Setelah                           Ya                   Ya
  dikonfirmasi    pengembalian                         
                  tersimpan                            
  -------------------------------------------------------------------------

Waktu spesifik untuk pengingat masih berupa rekomendasi dan belum
final: - Pengingat pengambilan: rekomendasi 6 jam sebelum masa alokasi
berakhir. - Pengingat pengembalian: rekomendasi 1 hari sebelum jatuh
tempo. - Keterlambatan: satu notifikasi saat pertama kali status berubah
menjadi terlambat; pengulangan berkala belum diputuskan.

## 15.4 Event notifikasi Pustakawan

Notifikasi internal dapat mencakup: - Permintaan online baru yang
membutuhkan pemrosesan. - Aktivitas antrean yang membutuhkan tindakan. -
Anggota datang dan pengajuan cocok dengan identitasnya, jika sistem
menggunakan mekanisme check-in. - Pengembalian yang perlu diproses. -
Buku terlambat yang perlu ditindaklanjuti. - Pembayaran yang menunggu
konfirmasi jika ada tahap pelaporan pembayaran oleh warga.

Notifikasi harus ditujukan kepada petugas/kelompok yang relevan, bukan
otomatis membanjiri semua Pustakawan.

## 15.5 Event notifikasi Admin

Notifikasi internal dapat mencakup: - Perubahan role atau hak akses. -
Perubahan pengaturan sistem. - Aktivitas sensitif yang perlu ditinjau. -
Masalah operasional penting. - Peristiwa keamanan yang relevan.

Tidak setiap baris audit harus menghasilkan notifikasi.

## 15.6 Siklus notifikasi

Status yang direkomendasikan: - Notifikasi in-app: `UNREAD`, `READ`. -
Pengiriman email: `QUEUED`, `SENT`, `FAILED`, dan bila tersedia
`RETRYING`.

Kegagalan email tidak boleh membatalkan transaksi bisnis. Event dan
pengiriman perlu idempotent agar satu event tidak membuat
notifikasi/email ganda. Simpan riwayat notifikasi sesuai kebijakan
retensi yang akan ditentukan.

## 15.7 Template notifikasi

Pesan harus singkat, jelas, menyebut judul buku atau kode eksemplar bila
relevan, dan menyertakan tindakan berikutnya.

Contoh: - "Buku Laskar Pelangi siap diambil. Batas pengambilan mengikuti
countdown pada halaman pengajuan." - "Giliran antrean Anda telah tiba.
Buku Laskar Pelangi tersedia untuk diambil." - "Pengajuan peminjaman
Anda dibatalkan. Alasan: kondisi buku rusak." - "Pengembalian buku telah
dikonfirmasi." - "Pembayaran denda Anda telah dikonfirmasi oleh
petugas."

------------------------------------------------------------------------

# 16. Arsitektur Data dan Keamanan

## 16.1 Identitas dan role

Rekomendasi model data: - `users`/`pengguna`: identitas tunggal. -
`roles`: daftar role. - `user_roles`: relasi banyak-ke-banyak pengguna
dan role. - `permissions`: daftar permission. - `role_permissions`:
relasi role dan permission.

Model ini mendukung satu akun yang memiliki role Warga dan role
pengelola tanpa duplikasi akun.

## 16.2 Permission

Gunakan permission granular dengan pola `resource.action`, misalnya: -
`catalog.read` - `book.create` - `book.read` - `book.update` -
`book.delete` - `copy.update` - `reservation.create` -
`reservation.cancel` - `circulation.create` - `circulation.read` -
`circulation.update` - `return.confirm` - `fine.confirm_payment` -
`user.manage` - `role.assign` - `role.revoke` - `policy.update` -
`audit.read` - `audit.export`

Daftar ini adalah rancangan awal, bukan daftar permission final.

## 16.3 Keamanan

-   Backend memvalidasi permission pada setiap endpoint/tindakan.
-   Menyembunyikan tombol frontend bukan kontrol keamanan yang cukup.
-   Validasi barcode, status alokasi, kelayakan anggota, dan denda
    dilakukan di server.
-   Operasi alokasi dan promosi antrean dibuat aman terhadap race
    condition.
-   Koreksi dan pembatalan menyimpan alasan serta actor.
-   Audit log tidak dapat dimanipulasi melalui UI.
-   Penghapusan akun secara default disarankan menggunakan soft delete.
-   Data historis transaksi tetap dipertahankan.

## 16.4 Tenant

Multi-tenant belum diputuskan. Tahap awal berfokus pada satu institusi.
Desain dapat mempertimbangkan penambahan `tenant_id` di masa depan,
tetapi isolasi data tenant, super-admin platform, onboarding sekolah,
billing, dan konfigurasi per tenant belum termasuk keputusan
implementasi.

------------------------------------------------------------------------

# 17. Navigasi dan Struktur Route

Contoh struktur route konseptual (perlu disesuaikan dengan framework dan
repositori):

``` text
/
├── katalog
├── buku/[id]
├── antrean
├── pengajuan
├── pinjaman
├── favorit
├── profil
│
├── pustakawan/
│   ├── dashboard
│   ├── sirkulasi
│   ├── pengajuan
│   ├── antrean
│   ├── koleksi
│   ├── eksemplar
│   ├── anggota
│   ├── denda
│   ├── laporan
│   └── aktivitas
│
└── admin/
    ├── dashboard
    ├── sirkulasi
    ├── pengajuan
    ├── antrean
    ├── koleksi
    ├── eksemplar
    ├── anggota
    ├── pengguna
    ├── laporan
    ├── analisis
    ├── audit-log
    └── pengaturan
```

Route di atas adalah rancangan navigasi, bukan klaim bahwa route
tersebut sudah ada pada kode saat ini.

------------------------------------------------------------------------

# 18. Aturan Bisnis yang Menjadi Baseline

Nilai berikut pernah disebut dalam pembahasan BILIK dan perlu
diverifikasi terhadap implementasi/dokumen lama sebelum dianggap final:

  Aturan                                     Nilai yang pernah dibahas
  ------------------------------------------ ---------------------------------
  Maksimal buku aktif                        1 buku
  Durasi pinjaman                            7 hari kalender
  Masa pengajuan siap diambil                24 jam
  Denda keterlambatan                        Rp500/hari/buku
  Batas denda pemblokiran                    Rp1.000 atau lebih
  Kapasitas antrean untuk 1--5 eksemplar     3 antrean
  Kapasitas antrean untuk 6--10+ eksemplar   5 antrean
  Metode antrean                             FIFO
  No-show                                    3 kali dalam sebulan
  Blokir sementara                           7 hari
  Blokir permanen                            Setelah 3 kali blokir sementara

Catatan: - Denda `UNPAID` memblokir pengajuan peminjaman baru dan masuk
antrean. - Countdown 24 jam dimulai ketika eksemplar dialokasikan,
termasuk ketika anggota dipromosikan dari antrean. - Nilai-nilai di
tabel ini jangan diubah tanpa keputusan kebijakan. - Aturan peminjaman
untuk Admin/Pustakawan dalam mode Warga direkomendasikan sama dengan
anggota lain.

------------------------------------------------------------------------

# 19. Skenario Pengujian

## 19.1 Warga

-   Warga dapat menjelajahi katalog dan detail buku.
-   Warga dapat menggunakan favorit, rating, dan ulasan sesuai fitur.
-   Warga yang memenuhi syarat dapat mengajukan peminjaman.
-   Warga dapat melihat status dan posisi antrean.
-   Warga mendapat countdown ketika memperoleh alokasi.
-   Warga dengan denda belum lunas tidak dapat membuat pengajuan atau
    masuk antrean.
-   Warga menerima notifikasi sesuai preferensi.

## 19.2 Sirkulasi

-   Scan kartu anggota menemukan identitas dan pengajuan aktif.
-   Eksemplar pengajuan otomatis tampil.
-   Scan barcode yang cocok melengkapi validasi.
-   Scan barcode eksemplar milik pengajuan orang lain ditolak.
-   Peminjaman tidak aktif sebelum petugas mengonfirmasi serah terima.
-   Pembatalan menyimpan alasan dan melepaskan alokasi.
-   Eksemplar rusak tidak dipromosikan sebagai tersedia.
-   Promosi FIFO mengalokasikan eksemplar hanya kepada anggota pertama
    yang memenuhi syarat.
-   Countdown dimulai berdasarkan waktu server.

## 19.3 Role dan keamanan

-   Warga tidak dapat mengakses route Admin/Pustakawan tanpa role.
-   Pustakawan tidak dapat melakukan tindakan manajemen role tanpa
    permission.
-   Admin dapat melakukan seluruh operasi Pustakawan.
-   Admin dapat mengakses fungsi manajemen sesuai full access.
-   Admin dan Pustakawan dapat menggunakan mode Warga.
-   Pencabutan role membatasi akses workspace terkait.
-   Audit log mencatat tindakan sensitif.
-   Admin maupun Pustakawan tidak dapat menghapus audit log.

## 19.4 Notifikasi

-   Satu event bisnis tidak menghasilkan notifikasi ganda.
-   Warga menerima in-app dan email sesuai preferensi.
-   Pustakawan dan Admin tidak menerima email sistem kecuali yang urgen seperti ajuan perpanjngan warga(sistem mengiirm email berisi penjelasan kondisi dan link spesifik ke tujuan, jika perpanjangan maka akan langsung dibawa ke halaman perpanjangan yang sudah terisi dengan alasan dan berapa durasi perpanjangan yang bisa diatur oleh pustakawan/admin).
-   Email gagal tidak membatalkan transaksi.
-   Notifikasi hanya dibuat setelah event bisnis berhasil.
-   Pengingat tidak dikirim setelah transaksi tidak lagi relevan.

------------------------------------------------------------------------

# 20. Hal yang Masih Perlu Dipertimbangkan

Bagian ini sengaja dipisahkan dari keputusan yang sudah ditetapkan.
Jangan menganggap rekomendasi di sini sebagai keputusan final tanpa
persetujuan.

## 20.1 Workflow dan transaksi

1.  **Koreksi transaksi selesai:** Apakah Pustakawan boleh mengoreksi
    transaksi yang sudah selesai dikembalikan, dengan alasan wajib dan
    audit log? Admin memiliki kewenangan lebih luas? (contoh kondisi?)
2.  **Buku rusak saat pengembalian:** Apakah buku langsung berstatus
    rusak/tidak tersedia, dan bagaimana pencatatan tanggung jawab atau
    denda kerusakan? (sistem hanya mengetahui bahwa pustakawan/admin mengkonfirmasi bahwa eksemplar A rusak)
3.  **Buku tidak lengkap:** Bagaimana menangani halaman hilang, aksesori
    hilang, atau kondisi lain? (itu diluar sistem, sistem hanya menerima konfirmasi kerusakan/kehilangan dari admin/pustakawan)
4.  **No-show:** Ketika countdown 24 jam habis, apakah alokasi otomatis
    dilepas dan antrean berikutnya langsung dipromosikan?(Ya, lalu yg antre 1 menjadi pengaju akan diberikan notifikasi lewat email misalnya)
5.  **Eksemplar rusak:** Jika satu eksemplar rusak dan antrean ada,
    sistem harus mencari eksemplar lain yang tersedia; jika tidak ada,
    antrean tetap menunggu. Perlu ditetapkan apakah status rusak wajib
    diperbarui saat pembatalan. (MAKSUDNYA GIMANA?)
6.  **Peminjaman langsung:** Detail alur peminjaman tanpa pengajuan
    online dan aturan membaca di tempat perlu difinalkan. (yasudah ketika ditempat dan alurnya normal maka tidak perlu banyak persyaratan, warga yang mengambil/meminjam buku secara offline tanpa ada kendala seperti buku rusak/sudah dilakukan ajuan pinjaman online maka bisa langsung dikonfirmasi oleh pustakawan/admin dan siap untuk dibawa pergi dan dipinjam, itu saja, ada lagi?)
7.  **Koreksi transaksi aktif:** Tindakan apa yang dapat dikoreksi
    Pustakawan dan tindakan apa yang membutuhkan Admin? (terkait kebijakan kayak 24 jam atau 12 jam waktu untuk klaim buku lewat online)
8.  **Pembatalan oleh warga:** Apakah warga boleh membatalkan pengajuan
    sendiri sebelum petugas memprosesnya? Bagaimana dampaknya terhadap
    antrean? (boleh, dan yang mengantre ke 1 akan otomatis menjadi pengaju dan mendapat notif misal lewat email jika ia mengaktifkan notifikasi diakunnya dengan email yang sudah diverifikasi)
9. **Perpanjangan pinjaman:** Tersedia secara *online* sebagai solusi bagi warga/peminjam yang tidak memiliki tanggungan denda sebelumnya dan mengalami kendala logis dalam mengembalikan buku tepat waktu (misalnya jadwal pengembalian jatuh pada hari libur saat perpustakaan tutup sehingga tidak ada petugas, agar peminjam terhindar dari denda yang seharusnya tidak dibebankan). Peminjam bebas mengajukan durasi tambahan hari beserta alasannya, sementara kepastian persetujuan dan durasi finalnya disesuaikan oleh petugas. Alurnya dimulai saat peminjam mengajukan perpanjangan *online*, lalu sistem mengirim email notifikasi urgen ke email petugas yang terverifikasi. Saat notifikasi dibuka di aplikasi email (seperti Gmail), tersedia tautan spesifik yang langsung mengarahkan petugas ke halaman konfirmasi perpanjangan—yang tampilannya menyerupai halaman pengajuan pinjaman namun dilengkapi informasi sisa hari pengembalian serta pengaturan durasi yang otomatis terisi sesuai ajuan peminjam (misalnya [+] 3 Hari [-]). Petugas/pustakawan dapat menyesuaikan kembali jumlah hari tersebut lalu menekan konfirmasi, yang seketika menambahkan waktu ke *countdown* (hitung mundur) masa pinjam peminjam secara *real-time*.
10. **Kondisi anggota:** Bagaimana menangani akun nonaktif, anggota
    lulus/pindah, atau data anggota yang tidak valid?(itu untuk saat ini belum ditentukan, sistem tidak ada kondisi akun aktif atau akun non-aktif, hanya ada 1 kondisi, akun aktif, paling kondisi akun aktif diblokir karena terdeteksi sistem melakukan pelanggaran yang ada, jadi tambahan untuk acuan agar menghapus seluruh teks terkait[akun aktif] jadi paling konsep awalnya akun dihapus itu untuk sistem saat ini, dan saya benci pesan2 deskriptif tidak berguna seperti akun aktif, tidak usah dikasih tau, kalau bisa melakukan aktifitas ya aktif, hapus semua teks tak berguna terkait akun aktif, status akun aktif hanya ada di backend untuk kepentingan sistem jika memang perlu jangan ditampilkan di UI frontend.)

## 20.2 Role dan pengelolaan akun

1.  Siapa saja pihak manajemen yang boleh memberikan role
    Admin/Pustakawan? (akan ada 1 warga menjadi admin, dan memberikan akses ke warga lain secara sistem awal, dan memberikan akses pustakawan ke yang lain)
2.  Apakah Admin dapat menghapus akun Admin lain? (Tidak, apabila hak akses admin tersebut merupakan hasil pemberian dari admin lain. Admin dengan hak akses pemberian tetap dapat mengakses seluruh fitur operasional sistem, kecuali mengelola atau menghapus akun admin lain. Hak akses penuh sepenuhnya hanya dimiliki oleh satu akun Admin Master yang ditetapkan oleh sistem sejak awal, yang dilengkapi dengan satu halaman khusus tersendiri untuk melakukan pengelolaan data/CRUD terhadap seluruh akun admin lainnya.)

3.  Apakah penghapusan akun selalu soft delete, dan kapan permanent
    delete diperbolehkan?(maksud soft delete?, blokir?, akun selalu bisa dihapus permanen oleh admin dan tercatat dilog, kecuali admin master pengen dihapus akunnya sama admin biasa, maka tidak bisa)
4.  Apakah Pustakawan boleh menghapus data master yang belum pernah
    dipakai transaksi?(contoh?)
5.  Apakah ada pemisahan permission antar-Pustakawan, atau semua
    Pustakawan mendapat permission operasional yang sama?(ya, sama semua pustakawan sama rata)
6.  Bagaimana prosedur pemulihan jika Admin utama kehilangan akses? (sepertinya admin utama tidak bisa kehilangan akses)

## 20.3 Denda

1.  Apakah Admin dapat membebaskan denda? Jika ya, alasan dan audit apa
    yang wajib disimpan?(mengikuti aturan sistem, denda akan selalu bisa dibebaskan oleh admin/pustakawan)
2.  Apakah pembayaran sebagian diperbolehkan?(menurutmu bagaimana jika dibolehkan?, sistemnya akan seperti apa?)
3.  Apakah denda dapat dikoreksi jika perhitungan salah? (Ya, ada fitur CRUDnya)
4.  Bagaimana jika petugas salah mengonfirmasi pembayaran lunas?(lakukan CRUD, saya juga berfikir bahwa admin/pustakawan bisa memilih beberapa warga sekaligus untuk melakukan konfigurasi, lalu ketika konfirmasi selalu ada catatan commit yang akan tercatat di log)
5.  Apakah blokir otomatis langsung dibuka setelah seluruh denda
    berstatus lunas?(Ya, itu harus terintegrasi di sistem)
6.  Apakah denda kerusakan/kehilangan berbeda dari denda keterlambatan?(Tidak)

## 20.4 Notifikasi

Keputusan saluran: - Warga: in-app dan email. - Pustakawan: in-app
saja. - Admin: in-app saja.

Hal yang masih perlu dipilih: 1. Waktu final pengingat pengambilan
(rekomendasi 6 jam sebelum kedaluwarsa). 2. Waktu final pengingat jatuh
tempo (rekomendasi 1 hari sebelumnya). 3. Apakah email harus
diverifikasi sebelum digunakan. 4. Berapa kali email gagal akan dicoba
ulang. 5. Berapa lama riwayat notifikasi disimpan. 6. Apakah warga dapat
mematikan email untuk kategori tertentu. 7. Petugas mana yang menerima
notifikasi operasional: semua Pustakawan atau petugas yang ditugaskan.
8. Apakah ada ringkasan notifikasi harian untuk Admin/Pustakawan. 9.
Apakah push notification akan masuk tahap berikutnya.

## 20.5 Opname dan inventaris

1.  Bagaimana workflow opname fisik?
2.  Apakah opname menggunakan scan barcode satu per satu? (Ya)
3.  Bagaimana mencatat buku hilang, rusak, salah lokasi, atau tidak
    ditemukan?(Sistem hanya menerima status konfirmasi admin/pustawakan dan menyimpannya untuk dipakai oleh logika sistem dalma transaksi dll.)
4.  Siapa yang dapat menyelesaikan selisih opname?(Admin dan pustakawan, dan buku yang bisa dilakukan seluruh transaksi berarti adalah buku2 opname, ya gak?, jadi opname paling awal akan dimasukkan ke database, ya standarnya nggak sih, perpus uth kayak gimana)
5.  Apakah perubahan status hasil opname membutuhkan persetujuan? (jelas Perlu, dan dilakukan oleh Pustakawan(sebenernya admin bisa tapi terkait perpuskan yang ngelola pustakawan)CRUDnya, paling commit sih, kita butuh sistem commit dan log yang standar)

## 20.6 Tenant dan SaaS

1.  Apakah BILIK akan digunakan sekolah lain sebagai produk SaaS?(untuk saat ini belum)
2.  Apakah setiap sekolah memiliki database terpisah atau berbagi
    database dengan isolasi tenant?
3.  Siapa super-admin platform?
4.  Bagaimana onboarding, konfigurasi, dan dukungan tenant?
5.  Apakah ada paket langganan/billing?

Untuk sekarang, fokus implementasi adalah satu institusi. Pertanyaan
tenant tidak perlu menghambat penyelesaian workflow inti.

## 20.7 Data dan implementasi teknis

1.  Periksa skema database dan migrasi existing sebelum membuat tabel
    baru.
2.  Cocokkan nama status di dokumen dengan enum/status yang sudah
    digunakan.
3.  Verifikasi apakah `log_audit` sudah tersedia dan kolomnya.
4.  Verifikasi tabel pengajuan, antrean, eksemplar, sirkulasi, denda,
    dan notifikasi.
5.  Tetapkan strategi penguncian/atomic transaction untuk alokasi dan
    promosi antrean.
6.  Tetapkan retensi data transaksi, audit, dan notifikasi.
7.  Tetapkan backup, pemulihan, dan keamanan data anggota.

------------------------------------------------------------------------

# 21. Glosarium

  -----------------------------------------------------------------------
  Istilah                             Arti
  ----------------------------------- -----------------------------------
  Warga                               Pengguna/anggota yang menggunakan
                                      pengalaman utama BILIK

  Pustakawan                          Pengelola operasional perpustakaan

  Admin                               Pengelola penuh sistem dan
                                      operasional

  Workspace                           Mode antarmuka berdasarkan role
                                      aktif

  Eksemplar                           Satu unit fisik dari suatu judul
                                      buku

  Barcode                             Kode unik yang mengidentifikasi
                                      eksemplar fisik

  Alokasi                             Pengikatan eksemplar tertentu untuk
                                      pengajuan anggota

  Pengajuan                           Permintaan peminjaman yang dibuat
                                      anggota

  Antrean FIFO                        Antrean berdasarkan urutan masuk

  Promosi antrean                     Pemberian kesempatan/alokasi kepada
                                      anggota antrean berikutnya

  Sirkulasi                           Proses peminjaman dan pengembalian

  Audit log                           Catatan aktivitas dan perubahan
                                      untuk pertanggungjawaban

  Event notifikasi                    Peristiwa bisnis yang memicu
                                      pembuatan notifikasi

  Tenant                              Satu institusi/sekolah yang
                                      menggunakan platform BILIK
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# Penutup

Dokumen ini menjadi konsolidasi kerja untuk konsep BILIK berdasarkan
keputusan yang telah muncul dalam pembahasan. Bagian yang berstatus
rekomendasi atau belum diputuskan harus tetap ditandai demikian sampai
dikonfirmasi.

Urutan kerja yang disarankan: 1. Audit dokumen dan implementasi
existing. 2. Finalisasi aturan bisnis pada bagian 20. 3. Finalisasi
state machine pengajuan, alokasi, antrean, dan sirkulasi. 4. Finalisasi
matriks permission. 5. Finalisasi event catalog notifikasi. 6. Cocokkan
rancangan database dengan migrasi existing. 7. Implementasi bertahap dan
pengujian role/workflow.

**Prinsip yang harus dijaga:** jangan menghapus histori transaksi untuk
memperbaiki kesalahan; gunakan pembatalan atau koreksi yang memiliki
alasan dan jejak audit. Jangan menganggap tindakan berhasil sebelum
perubahan bisnis tersimpan di backend.
