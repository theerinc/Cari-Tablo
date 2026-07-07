import { prisma } from "@/lib/prisma";
import { IslemForm } from "../islem-form";

export default async function YeniIslemPage({
  searchParams,
}: {
  searchParams: Promise<{ cariId?: string }>;
}) {
  const { cariId } = await searchParams;
  const cariler = await prisma.cari.findMany({
    orderBy: { unvan: "asc" },
    select: { id: true, unvan: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Yeni İşlem</h1>
      <IslemForm cariler={cariler} defaultCariId={cariId} />
    </div>
  );
}
