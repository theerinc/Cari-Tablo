"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

function revalidateAll() {
  revalidatePath("/vadeli");
  revalidatePath("/kasa");
  revalidatePath("/banka");
  revalidatePath("/dashboard");
  revalidatePath("/cariler");
}

export async function vadeKontrolCalistirAction() {
  await requireAdmin();

  const result = await prisma.islem.updateMany({
    where: { durum: "BEKLEMEDE", vadeTarihi: { lte: new Date() } },
    data: { durum: "VADESI_GELDI" },
  });

  revalidateAll();
  return result.count;
}

export async function onaylaIslemAction(islemId: string) {
  const user = await requireAdmin();

  await prisma.islem.update({
    where: { id: islemId },
    data: {
      durum: "TAMAMLANDI",
      tamamlanmaTarihi: new Date(),
      onaylayanId: user.id,
    },
  });

  revalidateAll();
}

export async function karsiliksizIsaretleAction(islemId: string) {
  const user = await requireAdmin();

  await prisma.islem.update({
    where: { id: islemId },
    data: {
      durum: "KARSILIKSIZ",
      tamamlanmaTarihi: new Date(),
      onaylayanId: user.id,
    },
  });

  revalidateAll();
}
