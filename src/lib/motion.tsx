"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type MotionState = {
  enabled: boolean;
  toggle: () => void;
};

const MotionContext = createContext<MotionState | null>(null);
const STORAGE_KEY = "sb-motion";

const readStoredPreference = (): boolean | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? null : stored === "on";
  } catch {
    return null;
  }
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const MotionProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = readStoredPreference();
    // Sync with browser-only preferences after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(stored ?? !prefersReducedMotion());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? "on" : "off";
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled((previous) => {
      const next = !previous;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        // Storage can be unavailable (private mode); the toggle still works for this visit.
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
};

export const useMotion = () => {
  const context = useContext(MotionContext);
  if (!context) throw new Error("useMotion must be used inside MotionProvider");
  return context;
};
