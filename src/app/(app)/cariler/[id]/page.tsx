import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCariBakiye } from "@/lib/balances";
import { formatTutar, CARI_TIPI_LABELS } from "@/lib/format";
import { LinkButton } from "@/components/link-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IslemTable } from "@/components/islem-table";

export default async function CariDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cari = await prisma.cari.findUnique({ where: { id } });
  if (!cari) notFound();

  const [islemler, bakiye] = await Promise.all([
    prisma.islem.findMany({
      where: { cariId: id },
      orderBy: { tarih: "desc" },
    }),
    getCariBakiye(id),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{cari.unvan}</h1>
          <p className="text-sm text-muted-foreground">
            {CARI_TIPI_LABELS[cari.tip]}
          </p>
        </div>
        <div className="flex gap-2">
          <LinkButton variant="outline" href={`/cariler/${cari.id}/duzenle`}>
            Düzenle
          </LinkButton>
          <LinkButton href={`/islemler/yeni?cariId=${cari.id}`}>Yeni İşlem</LinkButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bakiye
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-semibold ${
                bakiye > 0
                  ? "text-emerald-600"
                  : bakiye < 0
                    ? "text-red-600"
                    : ""
              }`}
            >
              {formatTutar(bakiye)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Telefon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{cari.telefon ?? "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vergi No
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{cari.vergiNo ?? "-"}</p>
          </CardContent>
        </Card>
      </div>

      {cari.adres && (
        <p className="text-sm text-muted-foreground">Adres: {cari.adres}</p>
      )}
      {cari.notlar && (
        <p className="text-sm text-muted-foreground">Not: {cari.notlar}</p>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Hesap Ekstresi</h2>
        <IslemTable islemler={islemler} />
      </div>
    </div>
  );
}
