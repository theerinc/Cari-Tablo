import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDefterBakiye, getPortfoyToplami } from "@/lib/balances";
import { formatTutar } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const [
    kasaBakiye,
    bankaBakiye,
    cekPortfoyu,
    senetPortfoyu,
    vadesiGelenSayisi,
    yaklasanSayisi,
    cariToplam,
  ] = await Promise.all([
    getDefterBakiye("NAKIT"),
    getDefterBakiye("HAVALE"),
    getPortfoyToplami("CEK"),
    getPortfoyToplami("SENET"),
    prisma.islem.count({ where: { durum: "VADESI_GELDI" } }),
    prisma.islem.count({ where: { durum: "BEKLEMEDE" } }),
    prisma.islem.groupBy({ by: ["yon"], _sum: { tutar: true } }),
  ]);

  let netCariBakiye = 0;
  for (const row of cariToplam) {
    const tutar = Number(row._sum.tutar ?? 0);
    netCariBakiye += row.yon === "TAHSILAT" ? tutar : -tutar;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Panel</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <Link href="/kasa" className="hover:underline">
                Kasa Bakiyesi
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatTutar(kasaBakiye)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <Link href="/banka" className="hover:underline">
                Banka Bakiyesi
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatTutar(bankaBakiye)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Çek Portföyü (Tahsil Edilmemiş)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatTutar(cekPortfoyu)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Senet Portföyü (Tahsil Edilmemiş)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatTutar(senetPortfoyu)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cari Net Bakiye (Tüm Cariler)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatTutar(netCariBakiye)}</p>
          </CardContent>
        </Card>

        <Card className={vadesiGelenSayisi > 0 ? "border-destructive" : undefined}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <Link href="/vadeli" className="hover:underline">
                Onay Bekleyen Vadeli Çek/Senet
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{vadesiGelenSayisi}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <Link href="/vadeli" className="hover:underline">
                Yaklaşan Vadeler
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{yaklasanSayisi}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
