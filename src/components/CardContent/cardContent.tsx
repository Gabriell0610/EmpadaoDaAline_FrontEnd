import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type CardContentProps = {
  children: ReactNode;
  className?: string;
};

export function CardContent({ children, className }: CardContentProps) {
  return <div className={twMerge('p-6', className)}>{children}</div>;
}
