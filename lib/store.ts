"use client";

import { useCallback, useSyncExternalStore } from "react";

/*
 * Small localStorage-backed stores. The server (and first client render)
 * always sees the fallback, so prerendered HTML and hydration agree; the
 * saved value arrives right after. Storage can be unavailable (private
 * windows, blocked site data), so every access is guarded.
 */

type Store<T> = {
  get: () => T;
  set: (value: T) => void;
  subscribe: (listener: () => void) => () => void;
  fallback: T;
};

function createStore<T>(key: string, fallback: T): Store<T> {
  const listeners = new Set<() => void>();
  let cachedRaw: string | null | undefined;
  let cachedValue = fallback;

  const read = (): T => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      return cachedValue;
    }
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cachedValue = raw === null ? fallback : (JSON.parse(raw) as T);
      } catch {
        cachedValue = fallback;
      }
    }
    return cachedValue;
  };

  return {
    fallback,
    get: read,
    set(value) {
      cachedValue = value;
      try {
        cachedRaw = JSON.stringify(value);
        window.localStorage.setItem(key, cachedRaw);
      } catch {
        // Not persisted, but the session still updates.
      }
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key === key) listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
  };
}

function useStore<T>(store: Store<T>): [T, (value: T) => void] {
  const value = useSyncExternalStore(store.subscribe, store.get, () => store.fallback);
  return [value, store.set];
}

/* ---------------------------------------------------------------- theme */

export type Theme = "light" | "dark";
const themeStore = createStore<Theme | null>("gl-theme", null);

export function useTheme(): [Theme, (theme: Theme) => void] {
  const [saved, setSaved] = useStore(themeStore);
  const system = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    () => false,
  );
  const theme: Theme = saved ?? (system ? "dark" : "light");
  const setTheme = useCallback(
    (next: Theme) => {
      document.documentElement.classList.toggle("dark", next === "dark");
      setSaved(next);
    },
    [setSaved],
  );
  return [theme, setTheme];
}

/* ---------------------------------------------------------------- study progress */

const studiedStore = createStore<string[]>("gl-studied", []);

export function useStudied() {
  const [list, setList] = useStore(studiedStore);
  const toggle = useCallback(
    (href: string) => {
      const current = studiedStore.get();
      setList(current.includes(href) ? current.filter((h) => h !== href) : [...current, href]);
    },
    [setList],
  );
  return { studied: list, isStudied: (href: string) => list.includes(href), toggle };
}

/* ---------------------------------------------------------------- preferences */

const sidebarStore = createStore<boolean>("gl-sidebar-collapsed", false);
export const useSidebarCollapsed = () => useStore(sidebarStore);

export type FretLabel = "degree" | "note" | "interval";
const fretLabelStore = createStore<FretLabel>("gl-fret-label", "degree");
export const useFretLabel = () => useStore(fretLabelStore);

export type PracticeSession = { id: string; date: string; root: string; focus: string; minutes: number; bpm: number; tasks: string[] };
const practiceSessionStore = createStore<PracticeSession[]>("gl-practice-sessions", []);
export const usePracticeSessions = () => useStore(practiceSessionStore);
const practiceTaskStore = createStore<string[]>("gl-practice-tasks", []);
export const usePracticeTasks = () => useStore(practiceTaskStore);
