import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAuth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/account-menu";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";

export const metadata: Metadata = { title: "Your account" };

async function AccountDetails() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return <div className="mx-auto max-w-2xl space-y-6">
    <PageHeader title="Your account" description={`Welcome, ${session.user.name}. Make a little room for music today.`} />
    <Card className="gap-6 p-6"><div className="flex items-center gap-4"><span className="bg-primary/10 text-primary grid size-12 shrink-0 place-items-center rounded-full text-lg font-semibold" aria-hidden>{session.user.name.charAt(0).toUpperCase()}</span><div className="min-w-0"><h2 className="text-lg font-semibold break-words">{session.user.name}</h2><p className="text-muted-foreground text-sm break-all">{session.user.email}</p></div></div>
      <dl className="space-y-4 border-t pt-5 text-sm"><div><dt className="text-muted-foreground">Account type</dt><dd className="mt-1 font-medium">Individual</dd></div><div><dt className="text-muted-foreground">Email status</dt><dd className="mt-1">{session.user.emailVerified ? "Verified" : "Not verified"}</dd></div></dl>
      <div className="flex flex-wrap items-center gap-3 border-t pt-5"><Link href="/" className={buttonVariants()}>Explore your study space</Link><SignOutButton /></div>
    </Card>
    <p className="text-muted-foreground text-sm leading-relaxed">Your study progress and practice sessions are saved in this browser. Signing in does not move or sync that data between devices.</p>
  </div>;
}

export default function AccountPage() {
  return <Suspense fallback={<p role="status">Loading your account…</p>}><AccountDetails /></Suspense>;
}
