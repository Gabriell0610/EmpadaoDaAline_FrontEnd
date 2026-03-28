import { Session } from 'next-auth';
import { ReactNode } from 'react';

export interface SomeChildrenInterface {
  children: ReactNode;
}

export interface ProfilePageProps {
  session: Session | null;
}
export interface PageProps {
  params: Promise<{
    id: string;
    action?: string[];
  }>;
}

export interface DetailsPageProps {
  id?: string;
  confirm?: boolean;
}
