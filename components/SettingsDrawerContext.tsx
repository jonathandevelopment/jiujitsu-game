"use client";

import { createContext, useContext, useState } from "react";

type SettingsDrawerContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SettingsDrawerContext = createContext<SettingsDrawerContextValue | null>(null);

export function SettingsDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value: SettingsDrawerContextValue = {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };

  return <SettingsDrawerContext.Provider value={value}>{children}</SettingsDrawerContext.Provider>;
}

export function useSettingsDrawer() {
  const ctx = useContext(SettingsDrawerContext);
  if (!ctx) {
    throw new Error("useSettingsDrawer must be used within SettingsDrawerProvider");
  }
  return ctx;
}
