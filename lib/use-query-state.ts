"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/*
 * A value kept in the URL query (?key=g), so a refresh, a bookmark or the
 * back button lands on the same key, mode or chord. Components using this
 * must sit inside a <Suspense> boundary.
 */
export function useQueryState(name: string, fallback: string): [string, (value: string | null) => void] {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const value = params.get(name) ?? fallback;

  const setValue = useCallback(
    (next: string | null) => {
      const query = new URLSearchParams(params.toString());
      if (next === null || next === fallback) query.delete(name);
      else query.set(name, next);
      const search = query.toString();
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    },
    [params, router, pathname, name, fallback],
  );

  return [value, setValue];
}
