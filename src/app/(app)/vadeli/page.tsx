import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatTarih, formatTutar, ODEME_TURU_LABELS } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { VadeliRowActions } from "./vadeli-row-actions";
import { VadeKontrolButton } from "./vade-kontrol-button";

export default async function VadeliPage() {
  const islemler = await prisma.islem.findMany({
    where: { durum: { in: ["BEKLEMEDE", "VADESI_GELDI"] } },
    include: { cari: true },
    orderBy: { vadeTarihi: "asc" },
  });

  const vadesiGelenler = islemler.filter((i) => i.durum === "VADESI_GELDI");
  const yaklasanlar = islemler.filter((i) => i.durum === "BEKLEMEDE");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Vadeli Çek/Senet</h1>
          <p className="text-sm text-muted-foreground">
            Vadesi gelen çek/senetleri onaylayın; onaylanınca kasa/banka defterine
            işlenir.
          </p>
        </div>
        <VadeKontrolButton />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Vadesi Geldi - Onay Bekliyor ({vadesiGelenler.length})
        </h2>
        <div className="rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vade Tarihi</TableHead>
                <TableHead>Cari</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead className="text-right">Tutar</TableHead>
                <TableHead>İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vadesiGelenler.map((islem) => (
                <TableRow key={islem.id}>
                  <TableCell>
                    <Badge variant="destructive">
                      {formatTarih(islem.vadeTarihi!)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/cariler/${islem.cariId}`}
                      className="hover:underline"
                    >
                      {islem.cari.unvan}
                    </Link>
                  </TableCell>
                  <TableCell>{ODEME_TURU_LABELS[islem.odemeTuru]}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {islem.aciklama ?? "-"}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium tabular-nums">
                    {formatTutar(islem.tutar.toString())}
                  </TableCell>
                  <TableCell>
                    <VadeliRowActions islemId={islem.id} />
                  </TableCell>
                </TableRow>
              ))}
              {vadesiGelenler.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Onay bekleyen çek/senet yok.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Yaklaşan Vadeler ({yaklasanlar.length})
        </h2>
        <div className="rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vade Tarihi</TableHead>
                <TableHead>Cari</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead className="text-right">Tutar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yaklasanlar.map((islem) => (
                <TableRow key={islem.id}>
                  <TableCell>
                    <Badge variant="warning">
                      {formatTarih(islem.vadeTarihi!)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/cariler/${islem.cariId}`}
                      className="hover:underline"
                    >
                      {islem.cari.unvan}
                    </Link>
                  </TableCell>
                  <TableCell>{ODEME_TURU_LABELS[islem.odemeTuru]}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {islem.aciklama ?? "-"}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium tabular-nums">
                    {formatTutar(islem.tutar.toString())}
                  </TableCell>
                </TableRow>
              ))}
              {yaklasanlar.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Yaklaşan vadeli çek/senet yok.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
