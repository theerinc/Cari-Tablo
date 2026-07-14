import Link from "next/link";
import { getDefterKayitlari } from "@/lib/defter";
import { formatTarih, formatTutar } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export async function DefterView({
  odemeTuru,
  baslik,
  bakiyeBaslik,
}: {
  odemeTuru: "NAKIT" | "HAVALE";
  baslik: string;
  bakiyeBaslik: string;
}) {
  const { kayitlar, toplamBakiye } = await getDefterKayitlari(odemeTuru);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{baslik}</h1>

      <Card className="max-w-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {bakiyeBaslik}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-2xl font-semibold tabular-nums">{formatTutar(toplamBakiye)}</p>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarih</TableHead>
              <TableHead>Cari</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead className="text-right">Tutar</TableHead>
              <TableHead className="text-right">Bakiye</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kayitlar.map((k) => (
              <TableRow key={k.id}>
                <TableCell>{formatTarih(k.tarih)}</TableCell>
                <TableCell>
                  <Link href={`/cariler/${k.cariId}`} className="hover:underline">
                    {k.cari.unvan}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {k.aciklama ?? "-"}
                </TableCell>
                <TableCell
                  className={`text-right font-mono font-medium tabular-nums ${
                    k.yon === "TAHSILAT" ? "text-success" : "text-destructive"
                  }`}
                >
                  {k.yon === "TAHSILAT" ? "+" : "-"}
                  {formatTutar(k.tutar.toString())}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {formatTutar(k.calisanBakiye)}
                </TableCell>
              </TableRow>
            ))}
            {kayitlar.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Kayıt bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
