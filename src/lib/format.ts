const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatTutar(value: number | string) {
  return currencyFormatter.format(Number(value));
}

export function formatTarih(value: Date | string) {
  return dateFormatter.format(new Date(value));
}

const kisaSayiFormatter = new Intl.NumberFormat("tr-TR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatTutarKisa(value: number) {
  return `₺${kisaSayiFormatter.format(value)}`;
}

const gunAyFormatter = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short" });
const ayYilFormatter = new Intl.DateTimeFormat("tr-TR", { month: "short", year: "2-digit" });
const yilFormatter = new Intl.DateTimeFormat("tr-TR", { year: "numeric" });

export function formatBucketEtiketi(
  isoTarih: string,
  periyot: "GUNLUK" | "HAFTALIK" | "AYLIK" | "CEYREKLIK" | "YILLIK",
) {
  const tarih = new Date(isoTarih);
  switch (periyot) {
    case "GUNLUK":
    case "HAFTALIK":
      return gunAyFormatter.format(tarih);
    case "AYLIK":
      return ayYilFormatter.format(tarih);
    case "CEYREKLIK": {
      const ceyrek = Math.floor(tarih.getMonth() / 3) + 1;
      return `Ç${ceyrek} ${tarih.getFullYear()}`;
    }
    case "YILLIK":
      return yilFormatter.format(tarih);
  }
}

export const ODEME_TURU_LABELS: Record<string, string> = {
  NAKIT: "Nakit",
  HAVALE: "Havale/EFT",
  CEK: "Çek",
  SENET: "Senet",
};

export const ISLEM_YONU_LABELS: Record<string, string> = {
  TAHSILAT: "Tahsilat",
  ODEME: "Ödeme",
};

export const ISLEM_DURUMU_LABELS: Record<string, string> = {
  TAMAMLANDI: "Tamamlandı",
  BEKLEMEDE: "Beklemede (vadeli)",
  VADESI_GELDI: "Vadesi Geldi",
  KARSILIKSIZ: "Karşılıksız",
  IPTAL: "İptal",
};

export const CARI_TIPI_LABELS: Record<string, string> = {
  MUSTERI: "Müşteri",
  TEDARIKCI: "Tedarikçi",
  TASERON: "Taşeron",
  PERSONEL: "Personel",
  DIGER: "Diğer",
};
