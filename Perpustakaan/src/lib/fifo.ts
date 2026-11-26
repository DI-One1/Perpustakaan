import { Prisma } from "@prisma/client";

/**
 * Sub-rutin atomik promosi antrean FIFO saat 1 eksemplar layak ('baik') menjadi bebas.
 */
export async function promosikanAntreanFIFO(
  tx: Prisma.TransactionClient,
  buku_id: string,
  eksemplar_id: string
) {
  const antreanTeratas = await tx.reservasi.findFirst({
    where: {
      buku_id,
      jenis: "antre",
      status: "menunggu",
    },
    orderBy: [{ created_at: "asc" }, { id: "asc" }],
    include: { buku: true },
  });

  if (!antreanTeratas) {
    await tx.eksemplar.update({
      where: { id: eksemplar_id },
      data: { status: "tersedia" },
    });
    return null;
  }

  const waktu_tenggat = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await tx.eksemplar.update({
    where: { id: eksemplar_id },
    data: { status: "direservasi" },
  });

  const dipromosikan = await tx.reservasi.update({
    where: { id: antreanTeratas.id },
    data: {
      eksemplar_id,
      status: "siap_diambil",
      waktu_tenggat,
    },
  });

  await tx.notifikasi.create({
    data: {
      pengguna_id: antreanTeratas.pengguna_id,
      target_peran: "warga",
      judul: "Antrean Anda Siap Diambil",
      pesan: `Buku "${antreanTeratas.buku.judul}" kini tersedia untuk Anda (${dipromosikan.kode_reservasi}). Ambil di perpustakaan dalam 24 jam.`,
      tautan: "/antrean",
    },
  });

  return dipromosikan;
}
