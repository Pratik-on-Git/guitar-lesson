
import { titleCaseLabel } from "@/lib/title-case";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col py-12 sm:py-20">
      <EmptyState
        icon={SearchX}
        title="That page isn't in your notes"
        description="It may have moved. Use the sidebar, or search with Ctrl K, to find a topic."
        action={
          <Link href="/" className={buttonVariants({ className: "mt-2" })}>{titleCaseLabel(<>
            <ArrowLeft aria-hidden />
            Back to Overview
          </>)}</Link>
        }
      />
    </div>
  );
}
