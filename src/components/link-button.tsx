import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

export function LinkButton({
  href,
  children,
  variant,
  size,
}: {
  href: string;
  children: React.ReactNode;
} & VariantProps<typeof buttonVariants>) {
  return (
    <Button variant={variant} size={size} nativeButton={false} render={<Link href={href} />}>
      {children}
    </Button>
  );
}
