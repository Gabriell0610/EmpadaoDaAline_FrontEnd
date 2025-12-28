/* eslint-disable @typescript-eslint/no-unused-vars */
import { twMerge } from 'tailwind-merge';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { LoadingComponentInterface } from '@/utils/types/components/loadingComponent';
import colors from 'tailwindcss/colors';

export const LoadingComponent = ({
  size = 60,
  mode,
}: LoadingComponentInterface) => {
  return (
    <div
      className={twMerge(
        mode === 'fullScreen'
          ? 'fixed inset-0 z-[50] flex h-full w-full items-center justify-center bg-black/50'
          : '',
      )}
    >
      <AiOutlineLoading3Quarters
        size={size}
        className="animate-spin"
        color={mode === 'fullScreen' ? colors.green[500] : colors.white[600]}
      />
    </div>
  );
};
