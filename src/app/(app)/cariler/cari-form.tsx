"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CARI_TIPI_LABELS } from "@/lib/format";
import type { CariFormState } from "./actions";
import type { Cari } from "@/generated/prisma/client";

export function CariForm({
  action,
  cari,
}: {
  action: (
    prevState: CariFormState | undefined,
    formData: FormData,
  ) => Promise<CariFormState>;
  cari?: Cari;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="unvan">Unvan</Label>
        <Input id="unvan" name="unvan" required defaultValue={cari?.unvan} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tip">Cari Tipi</Label>
        <Select name="tip" defaultValue={cari?.tip ?? "DIGER"}>
          <SelectTrigger id="tip" className="w-full">
            <SelectValue>
              {(value: string) => CARI_TIPI_LABELS[value] ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CARI_TIPI_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefon">Telefon</Label>
          <Input id="telefon" name="telefon" defaultValue={cari?.telefon ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vergiNo">Vergi No</Label>
          <Input id="vergiNo" name="vergiNo" defaultValue={cari?.vergiNo ?? ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="adres">Adres</Label>
        <Textarea id="adres" name="adres" defaultValue={cari?.adres ?? ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notlar">Notlar</Label>
        <Textarea id="notlar" name="notlar" defaultValue={cari?.notlar ?? ""} />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </Button>
    </form>
  );
}
