import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function getCariBakiyeMap(cariIds: string[]) {
  if (cariIds.length === 0) return new Map<string, number>();

  const rows = await prisma.islem.groupBy({
    by: ["cariId", "yon"],
    where: { cariId: { in: cariIds } },
    _sum: { tutar: true },
  });

  const map = new Map<string, number>();
  for (const id of cariIds) map.set(id, 0);

  for (const row of rows) {
    const current = map.get(row.cariId) ?? 0;
    const tutar = Number(row._sum.tutar ?? 0);
    const delta = row.yon === "TAHSILAT" ? tutar : -tutar;
    map.set(row.cariId, current + delta);
  }

  return map;
}

export async function getCariBakiye(cariId: string) {
  const map = await getCariBakiyeMap([cariId]);
  return map.get(cariId) ?? 0;
}

/** Tamamlanmış (gerçekleşmiş) işlemlere göre kasa/banka toplamı. */
export async function getDefterBakiye(odemeTuru: "NAKIT" | "HAVALE") {
  const rows = await prisma.islem.groupBy({
    by: ["yon"],
    where: { odemeTuru, durum: "TAMAMLANDI" },
    _sum: { tutar: true },
  });

  let bakiye = 0;
  for (const row of rows) {
    const tutar = Number(row._sum.tutar ?? 0);
    bakiye += row.yon === "TAHSILAT" ? tutar : -tutar;
  }
  return bakiye;
}

export async function getPortfoyToplami(odemeTuru: "CEK" | "SENET") {
  const rows = await prisma.islem.groupBy({
    by: ["yon"],
    where: { odemeTuru, durum: { in: ["BEKLEMEDE", "VADESI_GELDI"] } },
    _sum: { tutar: true },
  });

  let toplam = 0;
  for (const row of rows) {
    const tutar = Number(row._sum.tutar ?? 0);
    toplam += row.yon === "TAHSILAT" ? tutar : -tutar;
  }
  return toplam;
}

export type { Prisma };
