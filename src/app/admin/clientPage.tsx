'use client';
import { LoadingComponent } from '@/components/Loading/LoadingComponent';
import { LoadingContext } from '@/providers/loadingProvider/loadingProvider';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';

export default function AdminClientPage() {
  const { data: session } = useSession();
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  if (!session) {
    setIsLoading(true);
  } else {
    setIsLoading(false);
  }
  return (
    <>
      <h1>Página home de admin</h1>
      <h1>Ola: {session?.user.email}</h1>
      <p>{session?.user.accessToken}</p>
      {isLoading && <LoadingComponent />}
    </>
  );
}
