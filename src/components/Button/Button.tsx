/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';
import { LoadingComponent } from '../Loading/LoadingComponent';

type ButtonProps = ComponentProps<'button'>;
type VariantButton =
  | 'primary'
  | 'third'
  | 'link'
  | 'secondary'
  | 'fourth'
  | 'normal';

interface ButtonInterface extends ButtonProps {
  variant?: VariantButton;
  href?: string;
  isLoading?: boolean;
}

export const ButtonDefault = ({
  type,
  children,
  href,
  variant,
  onClick = () => null,
  isLoading,
  disabled,
  className,
  ...rest
}: ButtonInterface) => {
  const isLink = variant === 'link';
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isThird = variant === 'third';
  const isFourth = variant === 'fourth';
  const isNormal = variant === 'normal';

  if (isLink) {
    return (
      <Link
        href={href || ''}
        className={twMerge(
          isLoading
            ? 'pointer-events-none cursor-not-allowed text-green_details-greenLight opacity-50'
            : 'text-green_details-greenLight hover:underline',
          className,
        )}
        target="_blank"
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      onClick={(event) => {
        if (disabled) return;
        onClick?.(event);
      }}
      className={twMerge(
        isNormal ? '' : 'rounded-md px-1 py-2 sm:px-4 sm:py-2 sm:text-base',
        isPrimary
          ? 'bg-green_details-greenLight text-center text-xs font-semibold text-neutral-white hover:bg-details-greenHover'
          : isSecondary
            ? 'border-green_details-greenLight bg-neutral-white text-xs font-semibold text-text-primary hover:opacity-80'
            : isThird
              ? 'w-full rounded border border-green-700 py-2 font-medium text-green-700 transition-colors duration-200 hover:bg-green-700 hover:text-white'
              : isFourth
                ? 'bg-red-500 text-center text-xs font-semibold text-neutral-white'
                : '',
        className,
        disabled ? 'opacity-50 hover:bg-none' : 'opacity-100',
      )}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <LoadingComponent size={20} />
          {'carregando...'}
        </div>
      ) : (
        children
      )}
    </button>
  );
};
