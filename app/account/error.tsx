"use client";

import { Button } from "@/components/ui/button";

export default function AccountError({ reset }: { reset: () => void }) {
  return <div className="mx-auto max-w-md space-y-4 py-12"><h1 className="text-xl font-semibold">Your account is temporarily unavailable</h1><p className="text-muted-foreground text-sm">We couldn’t connect to the account service. Please try again shortly.</p><Button onClick={reset}>Try again</Button></div>;
}
