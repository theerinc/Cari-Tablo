import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDefterBakiye, getPortfoyToplami } from "@/lib/balances";
import { getZamanSerisi, type Metrik, type Periyot } from "@/lib/analytics";
import { formatTutar } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalizFiltreForm } from "./analiz-filtre-form";
import { AnalizChart } from "@/components/analiz-chart";

const GECERLI_PERIYOTLAR: Periyot[] = ["GUNLUK", "HAFTALIK", "AYLIK", "CEYREKLIK", "YILLIK"];
const GECERLI_METRIKLER: Metrik[] = ["KASA", "BANKA", "CARI_NET", "CEK_SENET"];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ periyot?: string; metrik?: string | string[] }>;
}) {
  const params = await searchParams;

  const periyot: Periyot = GECERLI_PERIYOTLAR.includes(params.periyot as Periyot)
    ? (params.periyot as Periyot)
    : "AYLIK";

  const secilenMetrikler = (
    Array.isArray(params.metrik) ? params.metrik : params.metrik ? [params.metrik] : []
  ).filter((m): m is Metrik => GECERLI_METRIKLER.includes(m as Metrik));
  const metrikler: Metrik[] = secilenMetrikler.length > 0 ? secilenMetrikler : ["KASA", "BANKA"];

  const [
    kasaBakiye,
    bankaBakiye,
    cekPortfoyu,
    senetPortfoyu,
    vadesiGelenSayisi,
    yaklasanSayisi,
    cariToplam,
    ...serilerListesi
  ] = await Promise.all([
    getDefterBakiye("NAKIT"),
    getDefterBakiye("HAVALE"),
    getPortfoyToplami("CEK"),
    getPortfoyToplami("SENET"),
    prisma.islem.count({ where: { durum: "VADESI_GELDI" } }),
    prisma.islem.count({ where: { durum: "BEKLEMEDE" } }),
    prisma.islem.groupBy({ by: ["yon"], _sum: { tutar: true } }),
    ...metrikler.map((m) => getZamanSerisi(m, periyot)),
  ]);

  const seriler = Object.fromEntries(
    metrikler.map((m, i) => [m, serilerListesi[i]]),
  ) as Partial<Record<Metrik, (typeof serilerListesi)[number]>>;

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
            <p className="font-mono text-2xl font-semibold tabular-nums">{formatTutar(kasaBakiye)}</p>
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
            <p className="font-mono text-2xl font-semibold tabular-nums">{formatTutar(bankaBakiye)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Çek Portföyü (Tahsil Edilmemiş)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold tabular-nums">{formatTutar(cekPortfoyu)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Senet Portföyü (Tahsil Edilmemiş)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold tabular-nums">{formatTutar(senetPortfoyu)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cari Net Bakiye (Tüm Cariler)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold tabular-nums">{formatTutar(netCariBakiye)}</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Analiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnalizFiltreForm periyot={periyot} metrikler={metrikler} />
          <AnalizChart periyot={periyot} metrikler={metrikler} seriler={seriler} />
        </CardContent>
      </Card>
    </div>
  );
}
