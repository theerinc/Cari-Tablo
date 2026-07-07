import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCariBakiyeMap } from "@/lib/balances";
import { formatTutar } from "@/lib/format";
import { CARI_TIPI_LABELS } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/link-button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function CarilerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const cariler = await prisma.cari.findMany({
    where: q
      ? { unvan: { contains: q, mode: "insensitive" } }
      : undefined,
    orderBy: { unvan: "asc" },
  });

  const bakiyeMap = await getCariBakiyeMap(cariler.map((c) => c.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Cari Hesaplar</h1>
        <LinkButton href="/cariler/yeni">Yeni Cari Ekle</LinkButton>
      </div>

      <form className="flex gap-2" method="get">
        <Input
          name="q"
          placeholder="Unvana göre ara..."
          defaultValue={q ?? ""}
          className="max-w-xs"
        />
        <Button type="submit" variant="secondary">
          Ara
        </Button>
      </form>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unvan</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead className="text-right">Bakiye</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cariler.map((cari) => {
              const bakiye = bakiyeMap.get(cari.id) ?? 0;
              return (
                <TableRow key={cari.id}>
                  <TableCell>
                    <Link
                      href={`/cariler/${cari.id}`}
                      className="font-medium hover:underline"
                    >
                      {cari.unvan}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{CARI_TIPI_LABELS[cari.tip]}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {cari.telefon ?? "-"}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      bakiye > 0
                        ? "text-emerald-600"
                        : bakiye < 0
                          ? "text-red-600"
                          : ""
                    }`}
                  >
                    {formatTutar(bakiye)}
                  </TableCell>
                </TableRow>
              );
            })}
            {cariler.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Kayıtlı cari hesap bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
