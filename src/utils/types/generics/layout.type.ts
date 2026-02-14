import { Session } from 'next-auth';
import { ReactNode } from 'react';

export interface SomeChildrenInterface {
  children: ReactNode;
}

export interface ProfilePageProps {
  session: Session | null;
}
export interface PageProps {
  params: {
    id: string;
  };
}

export interface DetailsPageProps extends ProfilePageProps {
  id?: string;
}
