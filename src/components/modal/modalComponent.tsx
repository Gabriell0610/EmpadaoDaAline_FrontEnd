import { SomeChildrenInterface } from '@/utils/types/generics/layout.type';
import { twMerge } from 'tailwind-merge';
import { TitleH2 } from '../Titles/Titles';
import { IoClose } from 'react-icons/io5';

interface ModalProps extends SomeChildrenInterface {
  onClose: () => void;
  isOpen: boolean;
  className?: string;
  clickAway?: boolean;
  title?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  title,
}: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 px-3">
      <div
        className={twMerge(
          'w-[500px] rounded-lg bg-white p-6 shadow-lg',
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <TitleH2 className="mb-0">{title}</TitleH2>
          <button onClick={onClose}>
            <IoClose size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
