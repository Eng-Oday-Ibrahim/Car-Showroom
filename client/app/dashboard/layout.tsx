import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <main className="flex-1">
        <div className="px-6 py-20">
          {children}
        </div>
      </main>
    </div>
  );
}
