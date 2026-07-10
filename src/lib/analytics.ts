import {
  startOfDay,
  subDays,
  startOfWeek,
  subWeeks,
  startOfMonth,
  subMonths,
  startOfQuarter,
  subQuarters,
  startOfYear,
  subYears,
} from "date-fns";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { Periyot, Metrik, ZamanSerisiNoktasi } from "@/lib/analytics-types";

export type { Periyot, Metrik, ZamanSerisiNoktasi } from "@/lib/analytics-types";
export { PERIYOT_LABELS, METRIK_LABELS } from "@/lib/analytics-types";

type PeriyotConfig = {
  sqlUnit: string;
  bucketCount: number;
  bucketStart: (d: Date) => Date;
  prevBucket: (d: Date) => Date;
};

const PERIYOT_CONFIG: Record<Periyot, PeriyotConfig> = {
  GUNLUK: {
    sqlUnit: "day",
    bucketCount: 30,
    bucketStart: startOfDay,
    prevBucket: (d) => subDays(d, 1),
  },
  HAFTALIK: {
    sqlUnit: "week",
    bucketCount: 12,
    bucketStart: (d) => startOfWeek(d, { weekStartsOn: 1 }),
    prevBucket: (d) => subWeeks(d, 1),
  },
  AYLIK: {
    sqlUnit: "month",
    bucketCount: 12,
    bucketStart: startOfMonth,
    prevBucket: (d) => subMonths(d, 1),
  },
  CEYREKLIK: {
    sqlUnit: "quarter",
    bucketCount: 8,
    bucketStart: startOfQuarter,
    prevBucket: (d) => subQuarters(d, 1),
  },
  YILLIK: {
    sqlUnit: "year",
    bucketCount: 5,
    bucketStart: startOfYear,
    prevBucket: (d) => subYears(d, 1),
  },
};

function metrikKosulu(metrik: Metrik): Prisma.Sql {
  switch (metrik) {
    case "KASA":
      return Prisma.sql`"odemeTuru" = 'NAKIT' AND "durum" = 'TAMAMLANDI'`;
    case "BANKA":
      return Prisma.sql`"odemeTuru" = 'HAVALE' AND "durum" = 'TAMAMLANDI'`;
    case "CARI_NET":
      return Prisma.sql`1=1`;
    case "CEK_SENET":
      // Not: mevcut model geçmiş durum değişikliklerini tutmuyor; bu bir
      // "vintage" yaklaşıklamasıdır — o dönemde açılıp hâlâ tahsil/ödeme
      // edilmemiş çek/senetlerin toplamını gösterir.
      return Prisma.sql`"odemeTuru" IN ('CEK', 'SENET') AND "durum" IN ('BEKLEMEDE', 'VADESI_GELDI')`;
  }
}

export async function getZamanSerisi(
  metrik: Metrik,
  periyot: Periyot,
): Promise<ZamanSerisiNoktasi[]> {
  const cfg = PERIYOT_CONFIG[periyot];
  const kosul = metrikKosulu(metrik);

  const buckets: Date[] = [];
  let cursor = cfg.bucketStart(new Date());
  for (let i = 0; i < cfg.bucketCount; i++) {
    buckets.unshift(cursor);
    cursor = cfg.prevBucket(cursor);
  }
  const ilkBucket = buckets[0];

  const [rows, openingRows] = await Promise.all([
    prisma.$queryRaw<{ bucket: Date; net: string | null }[]>(Prisma.sql`
      SELECT date_trunc(${cfg.sqlUnit}, "tarih") AS bucket,
             SUM(CASE WHEN "yon" = 'TAHSILAT' THEN "tutar" ELSE -"tutar" END) AS net
      FROM "Islem"
      WHERE ${kosul} AND "tarih" >= ${ilkBucket}
      GROUP BY 1
      ORDER BY 1
    `),
    prisma.$queryRaw<{ net: string | null }[]>(Prisma.sql`
      SELECT SUM(CASE WHEN "yon" = 'TAHSILAT' THEN "tutar" ELSE -"tutar" END) AS net
      FROM "Islem"
      WHERE ${kosul} AND "tarih" < ${ilkBucket}
    `),
  ]);

  const netByBucket = new Map<number, number>();
  for (const row of rows) {
    const key = cfg.bucketStart(new Date(row.bucket)).getTime();
    netByBucket.set(key, Number(row.net ?? 0));
  }

  let kumulatif = Number(openingRows[0]?.net ?? 0);
  return buckets.map((b) => {
    kumulatif += netByBucket.get(b.getTime()) ?? 0;
    return { bucket: b.toISOString(), deger: kumulatif };
  });
}
