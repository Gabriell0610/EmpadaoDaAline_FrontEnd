import { LinkComponentInterface } from '@/utils/types/components/linkComponent';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

const CustomLink = ({
  children,
  type,
  className,
  href,
}: LinkComponentInterface) => {
  if (type === 'footer') {
    return (
      <Link
        href={href || ''}
        className={twMerge('underline hover:opacity-80', className)}
      >
        {children}
      </Link>
    );
  }

  if (type === 'social') {
    return (
      <Link
        href={href || ''}
        className={twMerge(
          'flex items-center justify-center rounded-full bg-white p-2 hover:opacity-85',
          className,
        )}
        target="blank"
      >
        {children}
      </Link>
    );
  }

  return (
    <Link href={href || ''} className={twMerge('text-text-primary', className)}>
      {children}
    </Link>
  );
};

export { CustomLink };
