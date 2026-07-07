import { CariForm } from "../cari-form";
import { createCariAction } from "../actions";

export default function YeniCariPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Yeni Cari Ekle</h1>
      <CariForm action={createCariAction} />
    </div>
  );
}
