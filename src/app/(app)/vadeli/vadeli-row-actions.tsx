"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { onaylaIslemAction, karsiliksizIsaretleAction } from "./actions";

export function VadeliRowActions({ islemId }: { islemId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={pending}
        onClick={() => startTransition(() => onaylaIslemAction(islemId))}
      >
        Onayla (Kasaya İşle)
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => startTransition(() => karsiliksizIsaretleAction(islemId))}
      >
        Karşılıksız
      </Button>
    </div>
  );
}
