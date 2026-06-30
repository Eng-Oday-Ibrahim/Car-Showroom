'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredAuth, isAdmin } from '../../lib/auth/auth';

interface AuthGateProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGate({ children, requireAdmin = false }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = getStoredAuth();
    if (!auth.user) {
      router.replace('/login');
      return;
    }

    if (requireAdmin && !isAdmin(auth.user)) {
      router.replace('/dashboard/user');
      return;
    }

    setReady(true);
  }, [pathname, requireAdmin, router]);

  if (!ready) {
    return null;
  }

  return <>{children}</>; 
}
