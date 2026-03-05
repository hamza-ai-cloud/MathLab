'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarCtx {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarCtx>({
  open: false,
  toggle: () => {},
  close: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /* Close on route change */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Lock body scroll when sidebar is open on mobile */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isSmall = window.innerWidth < 1024;
    document.body.style.overflow = open && isSmall ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <SidebarContext.Provider value={{ open, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}
