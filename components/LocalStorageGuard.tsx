'use client';

import { useLocalStorageRedirect } from '@/lib/localStorageCheck';

interface LocalStorageGuardProps {
  children: React.ReactNode;
}

export default function LocalStorageGuard({ children }: LocalStorageGuardProps) {
  useLocalStorageRedirect();
  
  return <>{children}</>;
}
