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
