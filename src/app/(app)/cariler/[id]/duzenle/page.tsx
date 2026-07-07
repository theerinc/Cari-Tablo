import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CariForm } from "../../cari-form";
import { updateCariAction } from "../../actions";
import type { CariFormState } from "../../actions";

export default async function CariDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cari = await prisma.cari.findUnique({ where: { id } });
  if (!cari) notFound();

  const boundAction = async (
    prevState: CariFormState | undefined,
    formData: FormData,
  ) => updateCariAction(id, prevState, formData);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{cari.unvan} - Düzenle</h1>
      <CariForm action={boundAction} cari={cari} />
    </div>
  );
}
