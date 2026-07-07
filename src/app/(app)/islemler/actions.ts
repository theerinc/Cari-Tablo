"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";

const islemSchema = z.object({
  cariId: z.string().min(1, "Cari seçimi zorunlu"),
  tarih: z.string().min(1, "Tarih zorunlu"),
  yon: z.enum(["TAHSILAT", "ODEME"]),
  tutar: z.coerce.number().positive("Tutar 0'dan büyük olmalı"),
  odemeTuru: z.enum(["NAKIT", "HAVALE", "CEK", "SENET"]),
  aciklama: z.string().optional(),
  vadeli: z.enum(["on"]).optional(),
  vadeTarihi: z.string().optional(),
});

export type IslemFormState = { error?: string };

export async function createIslemAction(
  _prevState: IslemFormState | undefined,
  formData: FormData,
): Promise<IslemFormState> {
  const user = await requireUser();

  const parsed = islemSchema.safeParse({
    cariId: formData.get("cariId"),
    tarih: formData.get("tarih"),
    yon: formData.get("yon"),
    tutar: formData.get("tutar"),
    odemeTuru: formData.get("odemeTuru"),
    aciklama: formData.get("aciklama") || undefined,
    vadeli: formData.get("vadeli") || undefined,
    vadeTarihi: formData.get("vadeTarihi") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi" };
  }

  const { cariId, tarih, yon, tutar, odemeTuru, aciklama, vadeli, vadeTarihi } =
    parsed.data;

  const isVadeliCekSenet = (odemeTuru === "CEK" || odemeTuru === "SENET") && vadeli === "on";

  if (isVadeliCekSenet && !vadeTarihi) {
    return { error: "Vadeli çek/senet için vade tarihi girilmelidir." };
  }

  await prisma.islem.create({
    data: {
      cariId,
      tarih: new Date(tarih),
      yon,
      tutar,
      odemeTuru,
      aciklama,
      vadeTarihi: isVadeliCekSenet ? new Date(vadeTarihi!) : null,
      durum: isVadeliCekSenet ? "BEKLEMEDE" : "TAMAMLANDI",
      olusturanId: user.id,
    },
  });

  revalidatePath("/islemler");
  revalidatePath(`/cariler/${cariId}`);
  revalidatePath("/dashboard");
  revalidatePath("/kasa");
  revalidatePath("/banka");
  revalidatePath("/vadeli");
  redirect(`/cariler/${cariId}`);
}
