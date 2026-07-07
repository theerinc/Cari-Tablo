"use client";

import { useActionState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUserAction } from "./actions";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Yönetici",
  STAFF: "Personel",
};

export function UserForm() {
  const [state, formAction, pending] = useActionState(createUserAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && !state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name">Ad Soyad</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <Input id="password" name="password" type="password" required minLength={8} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Rol</Label>
        <Select name="role" defaultValue="STAFF">
          <SelectTrigger id="role" className="w-full">
            <SelectValue>
              {(value: string) => ROLE_LABELS[value] ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Yönetici</SelectItem>
            <SelectItem value="STAFF">Personel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Ekleniyor..." : "Kullanıcı Ekle"}
      </Button>
    </form>
  );
}
