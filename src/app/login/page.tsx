import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-foreground font-display text-lg font-bold text-background">
            C
          </span>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Cari.o</h1>
            <p className="text-sm text-muted-foreground">
              Ön muhasebe ve cari hesap takip sistemine giriş yapın
            </p>
          </div>
        </div>
        <LoginForm callbackUrl={callbackUrl ?? "/dashboard"} />
      </div>
    </div>
  );
}
