import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatTarih,
  formatTutar,
  ISLEM_DURUMU_LABELS,
  ISLEM_YONU_LABELS,
  ODEME_TURU_LABELS,
} from "@/lib/format";
import type { Islem, Cari } from "@/generated/prisma/client";

type IslemRow = Islem & { cari?: Cari };

const DURUM_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  TAMAMLANDI: "secondary",
  BEKLEMEDE: "outline",
  VADESI_GELDI: "default",
  KARSILIKSIZ: "destructive",
  IPTAL: "destructive",
};

export function IslemTable({
  islemler,
  showCari = false,
}: {
  islemler: IslemRow[];
  showCari?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarih</TableHead>
            {showCari && <TableHead>Cari</TableHead>}
            <TableHead>Yön</TableHead>
            <TableHead>Ödeme Türü</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Açıklama</TableHead>
            <TableHead className="text-right">Tutar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {islemler.map((islem) => (
            <TableRow key={islem.id}>
              <TableCell className="whitespace-nowrap">
                {formatTarih(islem.tarih)}
                {islem.vadeTarihi && (
                  <div className="text-xs text-muted-foreground">
                    Vade: {formatTarih(islem.vadeTarihi)}
                  </div>
                )}
              </TableCell>
              {showCari && (
                <TableCell>
                  {islem.cari ? (
                    <Link
                      href={`/cariler/${islem.cari.id}`}
                      className="hover:underline"
                    >
                      {islem.cari.unvan}
                    </Link>
                  ) : (
                    "-"
                  )}
                </TableCell>
              )}
              <TableCell>{ISLEM_YONU_LABELS[islem.yon]}</TableCell>
              <TableCell>{ODEME_TURU_LABELS[islem.odemeTuru]}</TableCell>
              <TableCell>
                <Badge variant={DURUM_VARIANT[islem.durum] ?? "outline"}>
                  {ISLEM_DURUMU_LABELS[islem.durum]}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[240px] truncate text-muted-foreground">
                {islem.aciklama ?? "-"}
              </TableCell>
              <TableCell
                className={`text-right font-medium ${
                  islem.yon === "TAHSILAT" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {islem.yon === "TAHSILAT" ? "+" : "-"}
                {formatTutar(islem.tutar.toString())}
              </TableCell>
            </TableRow>
          ))}
          {islemler.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={showCari ? 7 : 6}
                className="text-center text-muted-foreground"
              >
                Kayıtlı işlem bulunamadı.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
