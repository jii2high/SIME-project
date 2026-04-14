'use client';

import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/lib/types';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  roles: UserRole[];
  fallback?: ReactNode;
}

export default function RoleGuard({ children, roles, fallback = null }: RoleGuardProps) {
  const { hasRole, loading } = useAuth();

  if (loading) return null;

  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
