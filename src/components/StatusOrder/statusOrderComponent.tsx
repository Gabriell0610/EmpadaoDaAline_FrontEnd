import { StatusOrder } from '@/constants/enums/StatusOrder';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface StatusOrderInterface {
  content: string | undefined;
  description?: string;
  className?: string;
  mode?: string;
  onChange?: (status: StatusOrder) => void;
}

export default function StatusOrderComponent({
  content,
  description,
  mode,
  onChange,
}: StatusOrderInterface) {
  if (!content) {
    console.log(content);
    content = 'ERROR';
  }

  const [status, setStatus] = useState<StatusOrder>(content as StatusOrder);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(status);
    const newStatus = e.target.value as StatusOrder;
    setStatus(newStatus);
    onChange?.(newStatus);
  }

  useEffect(() => {
    if (content) {
      setStatus(content as StatusOrder);
    }
  }, [content]);

  if (mode === 'admin') {
    return (
      <div className="flex items-center gap-2">
        <div
          className={twMerge(
            'h-2 w-2 shrink-0 rounded-full sm:h-3 sm:w-3',
            status === StatusOrder.PENDENTE
              ? 'bg-details-pending'
              : status === StatusOrder.PREPARANDO
                ? 'bg-details-inProgress'
                : status === StatusOrder.CANCELADO
                  ? 'bg-details-canceled'
                  : status === StatusOrder.ENTREGUE
                    ? 'bg-details-delivered'
                    : status === StatusOrder.ACEITO
                      ? 'bg-green_details-greenLight'
                      : 'bg-gray-500',
          )}
        ></div>
        <select
          value={status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            handleChange(e);
          }}
          className="w-28 rounded-none border-0 border-b border-black bg-transparent px-0 py-1 outline-none focus:outline-none focus:ring-0 lg:w-full"
        >
          {Object.values(StatusOrder).map((status) => (
            <option key={status} value={status} className="text-black">
              {status}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <>
      {description ? (
        <p className="text-w mt-1 text-sm opacity-90">
          Status atual:{' '}
          <span
            className={twMerge(
              'rounded-md px-1 py-1 text-white sm:min-h-3 sm:min-w-3',
              content === StatusOrder.PENDENTE
                ? 'bg-details-pending'
                : content === StatusOrder.PREPARANDO
                  ? 'bg-details-inProgress'
                  : content === StatusOrder.CANCELADO
                    ? 'bg-details-canceled'
                    : content === StatusOrder.ENTREGUE
                      ? 'bg-details-delivered'
                      : content === StatusOrder.ACEITO
                        ? 'bg-green_details-greenLight'
                        : 'bg-gray-500',
            )}
          >
            {content}
          </span>
        </p>
      ) : (
        <div className="flex items-center gap-2">
          <div
            className={twMerge(
              'h-2 w-2 shrink-0 rounded-full sm:h-3 sm:w-3',
              content === StatusOrder.PENDENTE
                ? 'bg-details-pending'
                : content === StatusOrder.PREPARANDO
                  ? 'bg-details-inProgress'
                  : content === StatusOrder.CANCELADO
                    ? 'bg-details-canceled'
                    : content === StatusOrder.ENTREGUE
                      ? 'bg-details-delivered'
                      : content === StatusOrder.ACEITO
                        ? 'bg-details-accept'
                        : 'bg-gray-500',
            )}
          ></div>
          <p className="sm:text-base">{content}</p>
        </div>
      )}
    </>
  );
}
