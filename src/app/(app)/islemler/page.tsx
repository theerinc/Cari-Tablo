import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { LinkButton } from "@/components/link-button";
import { IslemTable } from "@/components/islem-table";
import { IslemFilterForm } from "./islem-filter-form";

export default async function IslemlerPage({
  searchParams,
}: {
  searchParams: Promise<{
    odemeTuru?: string;
    durum?: string;
    yon?: string;
  }>;
}) {
  const { odemeTuru, durum, yon } = await searchParams;

  const where: Prisma.IslemWhereInput = {};
  if (odemeTuru && odemeTuru !== "all")
    where.odemeTuru = odemeTuru as Prisma.EnumOdemeTuruFilter["equals"];
  if (durum && durum !== "all")
    where.durum = durum as Prisma.EnumIslemDurumuFilter["equals"];
  if (yon && yon !== "all") where.yon = yon as Prisma.EnumIslemYonuFilter["equals"];

  const islemler = await prisma.islem.findMany({
    where,
    include: { cari: true },
    orderBy: { tarih: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">İşlemler</h1>
        <LinkButton href="/islemler/yeni">Yeni İşlem</LinkButton>
      </div>

      <IslemFilterForm yon={yon} odemeTuru={odemeTuru} durum={durum} />

      <IslemTable islemler={islemler} showCari />
    </div>
  );
}
