import React from 'react';
import SummaryClientPage from './clientPage';
import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';

export default async function SummaryPage() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <SummaryClientPage session={session} />
    </>
  );
}
