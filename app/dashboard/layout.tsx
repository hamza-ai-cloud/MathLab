'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { SidebarProvider } from '@/context/SidebarContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex min-h-screen bg-deep">
          <Sidebar />
          <div className="flex-1 relative min-w-0">
            {/* Subtle grid bg */}
            <div className="absolute inset-0 grid-paper opacity-10 pointer-events-none" />
            <div className="relative">{children}</div>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
