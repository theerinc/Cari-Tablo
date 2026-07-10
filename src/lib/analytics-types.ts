export type Periyot = "GUNLUK" | "HAFTALIK" | "AYLIK" | "CEYREKLIK" | "YILLIK";
export type Metrik = "KASA" | "BANKA" | "CARI_NET" | "CEK_SENET";

export const PERIYOT_LABELS: Record<Periyot, string> = {
  GUNLUK: "Günlük",
  HAFTALIK: "Haftalık",
  AYLIK: "Aylık",
  CEYREKLIK: "Çeyreklik",
  YILLIK: "Yıllık",
};

export const METRIK_LABELS: Record<Metrik, string> = {
  KASA: "Kasa Bakiyesi",
  BANKA: "Banka Bakiyesi",
  CARI_NET: "Cari Net Bakiye",
  CEK_SENET: "Çek/Senet Portföyü",
};

export type ZamanSerisiNoktasi = { bucket: string; deger: number };
