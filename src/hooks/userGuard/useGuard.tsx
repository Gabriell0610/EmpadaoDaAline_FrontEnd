'use client';
import { AccessProfile } from '@/constants/enums/AccessProfile';
import { useAuth } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRoleGuard(role: AccessProfile.ADMIN | AccessProfile.CLIENT) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== role)) {
      router.replace('/login');
    }
  }, [user, isLoading, role, router]);
}
