"use client";

import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  METRIK_LABELS,
  type Metrik,
  type Periyot,
  type ZamanSerisiNoktasi,
} from "@/lib/analytics-types";
import { formatBucketEtiketi, formatTutarKisa } from "@/lib/format";

const METRIK_RENK_SIRASI: Record<Metrik, string> = {
  KASA: "var(--chart-1)",
  BANKA: "var(--chart-2)",
  CARI_NET: "var(--chart-3)",
  CEK_SENET: "var(--chart-4)",
};

export function AnalizChart({
  periyot,
  metrikler,
  seriler,
}: {
  periyot: Periyot;
  metrikler: Metrik[];
  seriler: Partial<Record<Metrik, ZamanSerisiNoktasi[]>>;
}) {
  const bucketKaynagi = metrikler
    .map((m) => seriler[m])
    .find((s): s is ZamanSerisiNoktasi[] => !!s && s.length > 0);

  if (!bucketKaynagi) {
    return (
      <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
        Bu aralıkta veri yok.
      </div>
    );
  }

  const veri = bucketKaynagi.map((nokta, i) => {
    const row: Record<string, number | string> = { bucket: nokta.bucket };
    for (const metrik of metrikler) {
      row[metrik] = seriler[metrik]?.[i]?.deger ?? 0;
    }
    return row;
  });

  const config: ChartConfig = Object.fromEntries(
    metrikler.map((m) => [
      m,
      { label: METRIK_LABELS[m], color: METRIK_RENK_SIRASI[m] },
    ]),
  );

  return (
    <ChartContainer config={config} className="aspect-auto h-72 w-full">
      <LineChart data={veri} margin={{ left: 8, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="bucket"
          tickFormatter={(value: string) => formatBucketEtiketi(value, periyot)}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
        />
        <YAxis
          tickFormatter={(value: number) => formatTutarKisa(value)}
          tickLine={false}
          axisLine={false}
          width={64}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatBucketEtiketi(String(value), periyot)}
              formatter={(value, name) => (
                <span className="flex w-full items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    {METRIK_LABELS[name as Metrik] ?? String(name)}
                  </span>
                  <span className="font-mono font-medium tabular-nums">
                    {formatTutarKisa(Number(value))}
                  </span>
                </span>
              )}
            />
          }
        />
        {metrikler.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
        {metrikler.map((metrik) => (
          <Line
            key={metrik}
            type="monotone"
            dataKey={metrik}
            stroke={METRIK_RENK_SIRASI[metrik]}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
