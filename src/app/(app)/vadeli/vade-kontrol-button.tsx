"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { vadeKontrolCalistirAction } from "./actions";

export function VadeKontrolButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const count = await vadeKontrolCalistirAction();
          toast.success(`Vade kontrolü çalıştırıldı: ${count} kayıt güncellendi.`);
        })
      }
    >
      {pending ? "Kontrol ediliyor..." : "Vade Kontrolünü Çalıştır (test)"}
    </Button>
  );
}
