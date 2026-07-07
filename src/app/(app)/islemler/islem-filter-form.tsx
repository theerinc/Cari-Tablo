"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ODEME_TURU_LABELS,
  ISLEM_DURUMU_LABELS,
  ISLEM_YONU_LABELS,
} from "@/lib/format";

export function IslemFilterForm({
  yon,
  odemeTuru,
  durum,
}: {
  yon?: string;
  odemeTuru?: string;
  durum?: string;
}) {
  return (
    <form className="flex flex-wrap gap-3" method="get">
      <Select name="yon" defaultValue={yon ?? "all"}>
        <SelectTrigger className="w-40">
          <SelectValue>
            {(value: string) =>
              value === "all" ? "Tüm Yönler" : ISLEM_YONU_LABELS[value]
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Yönler</SelectItem>
          {Object.entries(ISLEM_YONU_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select name="odemeTuru" defaultValue={odemeTuru ?? "all"}>
        <SelectTrigger className="w-44">
          <SelectValue>
            {(value: string) =>
              value === "all" ? "Tüm Ödeme Türleri" : ODEME_TURU_LABELS[value]
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Ödeme Türleri</SelectItem>
          {Object.entries(ODEME_TURU_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select name="durum" defaultValue={durum ?? "all"}>
        <SelectTrigger className="w-44">
          <SelectValue>
            {(value: string) =>
              value === "all" ? "Tüm Durumlar" : ISLEM_DURUMU_LABELS[value]
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm Durumlar</SelectItem>
          {Object.entries(ISLEM_DURUMU_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" variant="secondary">
        Filtrele
      </Button>
    </form>
  );
}
