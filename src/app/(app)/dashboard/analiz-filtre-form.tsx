"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { METRIK_LABELS, PERIYOT_LABELS, type Metrik, type Periyot } from "@/lib/analytics-types";

const METRIKLER = Object.keys(METRIK_LABELS) as Metrik[];

export function AnalizFiltreForm({
  periyot,
  metrikler,
}: {
  periyot: Periyot;
  metrikler: Metrik[];
}) {
  return (
    <form className="flex flex-wrap items-end gap-4" method="get">
      <div className="space-y-1.5">
        <Label htmlFor="periyot" className="text-xs text-muted-foreground">
          Periyot
        </Label>
        <Select name="periyot" defaultValue={periyot}>
          <SelectTrigger id="periyot" className="w-36">
            <SelectValue>
              {(value: string) => PERIYOT_LABELS[value as Periyot]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PERIYOT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-4">
        {METRIKLER.map((metrik) => (
          <label key={metrik} className="group flex items-center gap-2 text-sm">
            <Checkbox
              name="metrik"
              value={metrik}
              defaultChecked={metrikler.includes(metrik)}
            />
            {METRIK_LABELS[metrik]}
          </label>
        ))}
      </div>

      <Button type="submit" variant="secondary">
        Filtrele
      </Button>
    </form>
  );
}
