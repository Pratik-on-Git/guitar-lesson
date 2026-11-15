"use client";

import Link from "next/link";
import { useState } from "react";
import { UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";

export function AccountMenu() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <span className="size-8" aria-label="Loading account" />;
  return session ? <Link href="/account" aria-label="Your account" className={buttonVariants({ variant: "ghost", size: "icon-sm" })}><UserRound aria-hidden /></Link> : <Link href="/sign-in" className={buttonVariants({ variant: "secondary", size: "sm" })}>Sign in</Link>;
}

export function SignOutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function signOut() {
    setPending(true); setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) { setError("Unable to sign out. Please try again."); return; }
      window.location.replace("/sign-in");
    } catch { setError("Unable to sign out. Please try again."); }
    finally { setPending(false); }
  }
  return <div><Button variant="secondary" onClick={signOut} disabled={pending}>{pending ? "Signing out…" : "Sign out"}</Button>{error && <p role="alert" className="text-destructive mt-2 text-sm">{error}</p>}</div>;
}
