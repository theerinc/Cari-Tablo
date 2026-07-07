import { prisma } from "@/lib/prisma";

export async function getDefterKayitlari(odemeTuru: "NAKIT" | "HAVALE") {
  const islemler = await prisma.islem.findMany({
    where: { odemeTuru, durum: "TAMAMLANDI" },
    include: { cari: true },
    orderBy: { tarih: "asc" },
  });

  let bakiye = 0;
  const withRunningBalance = islemler.map((islem) => {
    const tutar = Number(islem.tutar);
    bakiye += islem.yon === "TAHSILAT" ? tutar : -tutar;
    return { ...islem, calisanBakiye: bakiye };
  });

  return { kayitlar: withRunningBalance.reverse(), toplamBakiye: bakiye };
}
