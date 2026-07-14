"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Clock,
  Wallet,
  Landmark,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard, adminOnly: true },
  { href: "/cariler", label: "Cari Hesaplar", icon: Users, adminOnly: false },
  { href: "/islemler", label: "İşlemler", icon: ArrowLeftRight, adminOnly: false },
  { href: "/vadeli", label: "Vadeli Çek/Senet", icon: Clock, adminOnly: true },
  { href: "/kasa", label: "Kasa", icon: Wallet, adminOnly: true },
  { href: "/banka", label: "Banka", icon: Landmark, adminOnly: true },
  { href: "/kullanicilar", label: "Kullanıcılar", icon: UserCog, adminOnly: true },
] as const;

export function Nav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const links = LINKS.filter((l) => isAdmin || !l.adminOnly);

  return (
    <nav
      className="flex flex-wrap gap-1 rounded-full border bg-card p-1 shadow-sm"
      aria-label="Ana gezinme"
    >
      {links.map((link) => {
        const active = pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-[15px]" strokeWidth={2} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
