"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Panel", adminOnly: true },
  { href: "/cariler", label: "Cari Hesaplar", adminOnly: false },
  { href: "/islemler", label: "İşlemler", adminOnly: false },
  { href: "/vadeli", label: "Vadeli Çek/Senet", adminOnly: true },
  { href: "/kasa", label: "Kasa", adminOnly: true },
  { href: "/banka", label: "Banka", adminOnly: true },
  { href: "/kullanicilar", label: "Kullanıcılar", adminOnly: true },
] as const;

export function Nav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const links = LINKS.filter((l) => isAdmin || !l.adminOnly);

  return (
    <nav className="flex flex-wrap gap-1">
      {links.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
