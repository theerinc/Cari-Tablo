"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";

const cariSchema = z.object({
  unvan: z.string().min(2, "Unvan en az 2 karakter olmalı"),
  tip: z.enum(["MUSTERI", "TEDARIKCI", "TASERON", "PERSONEL", "DIGER"]),
  telefon: z.string().optional(),
  adres: z.string().optional(),
  vergiNo: z.string().optional(),
  notlar: z.string().optional(),
});

export type CariFormState = { error?: string };

export async function createCariAction(
  _prevState: CariFormState | undefined,
  formData: FormData,
): Promise<CariFormState> {
  await requireUser();

  const parsed = cariSchema.safeParse({
    unvan: formData.get("unvan"),
    tip: formData.get("tip"),
    telefon: formData.get("telefon") || undefined,
    adres: formData.get("adres") || undefined,
    vergiNo: formData.get("vergiNo") || undefined,
    notlar: formData.get("notlar") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi" };
  }

  const cari = await prisma.cari.create({ data: parsed.data });

  revalidatePath("/cariler");
  redirect(`/cariler/${cari.id}`);
}

export async function updateCariAction(
  cariId: string,
  _prevState: CariFormState | undefined,
  formData: FormData,
): Promise<CariFormState> {
  await requireUser();

  const parsed = cariSchema.safeParse({
    unvan: formData.get("unvan"),
    tip: formData.get("tip"),
    telefon: formData.get("telefon") || undefined,
    adres: formData.get("adres") || undefined,
    vergiNo: formData.get("vergiNo") || undefined,
    notlar: formData.get("notlar") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi" };
  }

  await prisma.cari.update({ where: { id: cariId }, data: parsed.data });

  revalidatePath("/cariler");
  revalidatePath(`/cariler/${cariId}`);
  return {};
}
