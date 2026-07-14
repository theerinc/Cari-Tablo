import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Nav } from "./nav";
import { SignOutButton } from "./sign-out-button";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-foreground font-display text-sm font-bold text-background">
                C
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                Cari.o
              </span>
            </div>
          </div>
          <Nav isAdmin={isAdmin} />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5 rounded-full border bg-card py-1 pr-1 pl-3 shadow-sm">
              <div className="leading-tight">
                <p className="text-sm font-semibold">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? "Yönetici" : "Personel"}
                </p>
              </div>
              <span className="flex size-8 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-primary-foreground">
                {initials(session.user.name ?? "?")}
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
