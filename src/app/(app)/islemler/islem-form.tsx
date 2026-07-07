"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ODEME_TURU_LABELS,
  ISLEM_YONU_LABELS,
} from "@/lib/format";
import { createIslemAction } from "./actions";

type CariOption = { id: string; unvan: string };

const todayStr = () => new Date().toISOString().slice(0, 10);

export function IslemForm({
  cariler,
  defaultCariId,
}: {
  cariler: CariOption[];
  defaultCariId?: string;
}) {
  const [state, formAction, pending] = useActionState(createIslemAction, undefined);
  const [odemeTuru, setOdemeTuru] = useState<string>("NAKIT");
  const [vadeli, setVadeli] = useState(false);

  const cekSenetSecili = odemeTuru === "CEK" || odemeTuru === "SENET";

  return (
    <form action={formAction} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="cariId">Cari</Label>
        <Select name="cariId" defaultValue={defaultCariId}>
          <SelectTrigger id="cariId" className="w-full">
            <SelectValue placeholder="Cari seçin">
              {(value: string) =>
                cariler.find((c) => c.id === value)?.unvan ?? "Cari seçin"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {cariler.map((cari) => (
              <SelectItem key={cari.id} value={cari.id}>
                {cari.unvan}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tarih">Tarih</Label>
          <Input id="tarih" name="tarih" type="date" defaultValue={todayStr()} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tutar">Tutar (₺)</Label>
          <Input id="tutar" name="tutar" type="number" step="0.01" min="0.01" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="yon">Yön</Label>
          <Select name="yon" defaultValue="TAHSILAT">
            <SelectTrigger id="yon" className="w-full">
              <SelectValue>
                {(value: string) => ISLEM_YONU_LABELS[value] ?? value}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ISLEM_YONU_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="odemeTuru">Ödeme Türü</Label>
          <Select
            name="odemeTuru"
            value={odemeTuru}
            onValueChange={(v) => {
              if (!v) return;
              setOdemeTuru(v);
              if (v !== "CEK" && v !== "SENET") setVadeli(false);
            }}
          >
            <SelectTrigger id="odemeTuru" className="w-full">
              <SelectValue>
                {(value: string) => ODEME_TURU_LABELS[value] ?? value}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ODEME_TURU_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {cekSenetSecili && (
        <div className="space-y-3 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="vadeli"
              name="vadeli"
              checked={vadeli}
              onCheckedChange={(v) => setVadeli(v === true)}
            />
            <Label htmlFor="vadeli" className="font-normal">
              Vadeli {odemeTuru === "CEK" ? "çek" : "senet"} (vade gününe kadar kasaya
              işlenmez, cari hesaba yansır)
            </Label>
          </div>
          {vadeli && (
            <div className="space-y-2">
              <Label htmlFor="vadeTarihi">Vade Tarihi</Label>
              <Input
                id="vadeTarihi"
                name="vadeTarihi"
                type="date"
                required={vadeli}
              />
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="aciklama">Açıklama</Label>
        <Textarea id="aciklama" name="aciklama" />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </Button>
    </form>
  );
}
