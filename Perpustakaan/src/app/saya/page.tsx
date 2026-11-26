"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

function CountdownPengambilan({ tenggat }: { tenggat: string }) {
  const [sisa, setSisa] = useState("00:00:00");

  useEffect(() => {
    function hitung() {
      const diff = Math.max(0, new Date(tenggat).getTime() - Date.now());
      const jam = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const mnt = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const dtk = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setSisa(`${jam}:${mnt}:${dtk}`);
    }
    hitung();
    const timer = setInterval(hitung, 1000);
    return () => clearInterval(timer);
  }, [tenggat]);

  return <span className="font-mono font-bold text-primary">Batas Pengambilan: {sisa}</span>;
}

export default function SayaPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"reservasi" | "pinjaman" | "denda" | "favorit" | "notifikasi">("reservasi");
  const [data, setData] = useState<{
    reservasi: Array<{
      id: string;
      kode_reservasi: string;
      jenis: string;
      status: string;
      waktu_tenggat: string | null;
      buku: { id: string; judul: string };
      eksemplar: { kode_barcode: string } | null;
    }>;
    pinjaman: Array<{
      id: string;
      status: string;
      tanggal_jatuh_tempo: string;
      eksemplar: { kode_barcode: string; buku: { id: string; judul: string } };
      perpanjangan: Array<{ id: string; status: string; durasi_hari_diminta: number; catatan_admin: string | null }>;
    }>;
    denda: Array<{
      id: string;
      nominal: number;
      jumlah_hari_terlambat: number;
      status: string;
      pinjaman: { eksemplar: { buku: { judul: string } } };
    }>;
    favorit: Array<{
      id: string;
      buku: { id: string; judul: string; penulis: string; cover_url: string };
    }>;
    notifikasi: Array<{
      id: string;
      judul: string;
      pesan: string;
      sudah_dibaca: boolean;
      created_at: string;
    }>;
  } | null>(null);
  const [modalPinjamId, setModalPinjamId] = useState<string | null>(null);
  const [hariPerpanjang, setHariPerpanjang] = useState(3);
  const [alasanPerpanjang, setAlasanPerpanjang] = useState("");
  const [feedback, setFeedback] = useState("");

  const loadData = useCallback(() => {
    fetch("/api/v1/pinjaman/saya")
      .then((r) => {
        if (r.status === 401) {
          router.push("/masuk");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) setData(d);
      });
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleBatalkan(id: string) {
    const res = await fetch(`/api/v1/reservasi/${id}/batal`, { method: "POST" });
    if (res.ok) {
      setFeedback("Pengajuan / antrean berhasil dibatalkan.");
      loadData();
    }
  }

  async function handleKirimPerpanjangan(e: React.FormEvent) {
    e.preventDefault();
    if (!modalPinjamId) return;
    const res = await fetch(`/api/v1/pinjaman/${modalPinjamId}/perpanjangan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ durasi_hari_diminta: hariPerpanjang, alasan: alasanPerpanjang }),
    });
    const body = await res.json();
    if (!res.ok) {
      setFeedback(body.detail || "Gagal mengajukan perpanjangan.");
      return;
    }
    setModalPinjamId(null);
    setAlasanPerpanjang("");
    setFeedback("Ajuan perpanjangan terkirim ke Admin.");
    loadData();
  }

  async function handleBacaSemuaNotif() {
    await fetch("/api/v1/notifikasi", { method: "PATCH" });
    loadData();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-extrabold text-foreground">Aktivitas Perpustakaan Saya</h1>

        {feedback && (
          <div className="mt-4 rounded-xl border border-primary/30 bg-primary-soft px-4 py-3 text-sm font-semibold text-primary">
            {feedback}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-3">
          {[
            { id: "reservasi", label: "Pengajuan & Antrean" },
            { id: "pinjaman", label: "Pinjaman Saya" },
            { id: "denda", label: "Denda" },
            { id: "favorit", label: "Favorit" },
            { id: "notifikasi", label: "Notifikasi" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as typeof tab)}
              className={`min-h-[40px] rounded-lg px-4 py-2 text-xs font-bold ${
                tab === t.id ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!data ? (
          <div className="mt-6 text-sm text-muted-foreground">Memuat data...</div>
        ) : (
          <div className="mt-6 space-y-4">
            {tab === "reservasi" &&
              (data.reservasi.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada pengajuan atau antrean.</p>
              ) : (
                data.reservasi.map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">{r.kode_reservasi}</span>
                        <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-bold text-primary">
                          {r.status === "siap_diambil" ? "Siap Dipinjam" : r.status}
                        </span>
                      </div>
                      <Link href={`/buku/${r.buku.id}`} className="mt-1 block text-base font-bold text-foreground hover:text-primary">
                        {r.buku.judul}
                      </Link>
                      {r.eksemplar && (
                        <p className="text-xs text-muted-foreground">Barcode: {r.eksemplar.kode_barcode}</p>
                      )}
                      {r.status === "siap_diambil" && r.waktu_tenggat && (
                        <p className="mt-1 text-xs">
                          <CountdownPengambilan tenggat={r.waktu_tenggat} />
                        </p>
                      )}
                    </div>
                    {["siap_diambil", "menunggu"].includes(r.status) && (
                      <button
                        type="button"
                        onClick={() => handleBatalkan(r.id)}
                        className="min-h-[40px] rounded-xl border border-destructive/40 px-4 py-2 text-xs font-bold text-destructive hover:bg-red-50"
                      >
                        Batalkan Pengajuan
                      </button>
                    )}
                  </div>
                ))
              ))}

            {tab === "pinjaman" &&
              (data.pinjaman.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada riwayat pinjaman.</p>
              ) : (
                data.pinjaman.map((p) => (
                  <div key={p.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
                    <div>
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          p.status === "terlambat"
                            ? "bg-red-100 text-destructive"
                            : p.status === "aktif"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.status}
                      </span>
                      <h3 className="mt-1 text-base font-bold text-foreground">{p.eksemplar.buku.judul}</h3>
                      <p className="text-xs text-muted-foreground">
                        Barcode: {p.eksemplar.kode_barcode} &bull; Jatuh Tempo:{" "}
                        {new Date(p.tanggal_jatuh_tempo).toLocaleDateString("id-ID")}
                      </p>
                      {p.perpanjangan.length > 0 && (
                        <p className="mt-1 text-xs font-semibold text-primary">
                          Perpanjangan terakhir: {p.perpanjangan[0].status}{" "}
                          {p.perpanjangan[0].catatan_admin ? `(${p.perpanjangan[0].catatan_admin})` : ""}
                        </p>
                      )}
                    </div>
                    {p.status === "aktif" && (
                      <button
                        type="button"
                        onClick={() => setModalPinjamId(p.id)}
                        className="min-h-[40px] rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover"
                      >
                        Ajukan Perpanjangan
                      </button>
                    )}
                  </div>
                ))
              ))}

            {tab === "denda" &&
              (data.denda.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tidak ada catatan denda.</p>
              ) : (
                data.denda.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                    <div>
                      <p className="text-sm font-bold text-foreground">{d.pinjaman.eksemplar.buku.judul}</p>
                      <p className="text-xs text-muted-foreground">
                        Terlambat {d.jumlah_hari_terlambat} hari &bull; Rp{d.nominal.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        d.status === "belum_lunas" ? "bg-red-100 text-destructive" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                ))
              ))}

            {tab === "favorit" && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {data.favorit.map((f) => (
                  <Link key={f.id} href={`/buku/${f.buku.id}`} className="rounded-xl border border-border bg-card p-3">
                    <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted">
                      <img src={f.buku.cover_url} alt={f.buku.judul} className="h-full w-full object-cover" />
                    </div>
                    <p className="mt-2 line-clamp-1 text-sm font-bold text-foreground">{f.buku.judul}</p>
                    <p className="text-xs text-muted-foreground">{f.buku.penulis}</p>
                  </Link>
                ))}
              </div>
            )}

            {tab === "notifikasi" && (
              <div>
                <div className="mb-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleBacaSemuaNotif}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Tandai Semua Dibaca
                  </button>
                </div>
                <div className="space-y-2">
                  {data.notifikasi.map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-xl border p-4 ${
                        n.sudah_dibaca ? "border-border bg-card" : "border-primary/30 bg-primary-soft/50"
                      }`}
                    >
                      <p className="text-sm font-bold text-foreground">{n.judul}</p>
                      <p className="mt-0.5 text-xs text-foreground">{n.pesan}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {modalPinjamId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <form onSubmit={handleKirimPerpanjangan} className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
              <h2 className="text-lg font-extrabold text-foreground">Ajukan Perpanjangan Pinjaman</h2>
              <div className="mt-4">
                <label htmlFor="hari-input" className="block text-xs font-bold text-foreground">
                  Tambahan Hari Diminta
                </label>
                <input
                  id="hari-input"
                  type="number"
                  min={1}
                  max={14}
                  value={hariPerpanjang}
                  onChange={(e) => setHariPerpanjang(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
                />
              </div>
              <div className="mt-3">
                <label htmlFor="alasan-input" className="block text-xs font-bold text-foreground">
                  Alasan Wajib
                </label>
                <textarea
                  id="alasan-input"
                  required
                  rows={3}
                  value={alasanPerpanjang}
                  onChange={(e) => setAlasanPerpanjang(e.target.value)}
                  placeholder="Contoh: Jadwal kembali bertepatan dengan ujian sekolah"
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
                />
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalPinjamId(null)}
                  className="min-h-[40px] rounded-xl border border-border px-4 py-2 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white"
                >
                  Kirim Ajuan
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
