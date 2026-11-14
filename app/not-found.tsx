import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[520px] flex-col items-center py-24 text-center">
      <p className="text-caption font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-heading text-foreground">That page isn&apos;t in your notes</h1>
      <p className="mt-3 text-body text-muted-foreground">Use the sidebar or search (Ctrl K) to find a topic.</p>
      <Link href="/" className={buttonVariants({ className: "mt-8" })}>
        Back to overview
      </Link>
    </div>
  );
}
