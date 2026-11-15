"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

// Server enforcement lives in proxy.ts. Also hide client-cached screens when a
// session expires or is signed out in another tab.
export function SessionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();
  useEffect(() => {
    if (!isPending && !session && !error) router.replace(`/sign-in?next=${encodeURIComponent(pathname + window.location.search)}`);
  }, [isPending, session, error, pathname, router]);
  if (error) return <div className="p-8"><p role="alert">Unable to verify your session. Please try again.</p><button type="button" className="mt-4 underline" onClick={() => window.location.reload()}>Retry</button></div>;
  if (isPending || !session) return <p role="status" className="p-8 text-muted-foreground">Checking your session…</p>;
  return children;
}
