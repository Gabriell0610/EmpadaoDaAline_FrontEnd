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
  const [status, setStatus] = useState<StatusOrder>(
    (content as StatusOrder) ?? StatusOrder.PENDENTE,
  );

  const STATUS_COLOR_MAP: Record<StatusOrder, string> = {
    [StatusOrder.PENDENTE]: 'bg-details-pending',
    [StatusOrder.PREPARANDO]: 'bg-details-inProgress',
    [StatusOrder.CANCELADO]: 'bg-details-canceled',
    [StatusOrder.ENTREGUE]: 'bg-details-delivered',
    [StatusOrder.ACEITO]: 'bg-green_details-greenLight',
    [StatusOrder.CONFIRMADO_CLIENTE]: 'bg-details-confirmByClient',
  };

  const STATUS_LABEL_MAP: Record<StatusOrder, string> = {
    [StatusOrder.PENDENTE]: 'PENDENTE',
    [StatusOrder.PREPARANDO]: 'PREPARABNDO',
    [StatusOrder.CANCELADO]: 'CANCELADO',
    [StatusOrder.ENTREGUE]: 'ENTREGUE',
    [StatusOrder.ACEITO]: 'ACEITO',
    [StatusOrder.CONFIRMADO_CLIENTE]: 'CONFIRMADO',
  };

  function getStatusColor(status?: StatusOrder) {
    return STATUS_COLOR_MAP[status as StatusOrder] ?? 'bg-gray-500';
  }

  function StatusDot({ status }: { status?: StatusOrder }) {
    return (
      <div
        className={twMerge(
          'h-2 w-2 shrink-0 rounded-full sm:h-3 sm:w-3',
          getStatusColor(status),
        )}
      />
    );
  }

  useEffect(() => {
    if (content) setStatus(content as StatusOrder);
  }, [content]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as StatusOrder;
    setStatus(newStatus);
    onChange?.(newStatus);
  }

  if (mode === 'admin') {
    return (
      <div className="flex items-center gap-2">
        <StatusDot status={status} />

        <select
          value={status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            handleChange(e);
          }}
          className="w-38 rounded-none border-0 border-b border-black bg-transparent px-0 py-1 outline-none focus:ring-0 lg:w-full"
        >
          {Object.values(StatusOrder).map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL_MAP[status]}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (description) {
    return (
      <p className="mt-1 text-sm opacity-90">
        Status atual:{' '}
        <span
          className={twMerge(
            'rounded-md px-1 py-1 text-white',
            getStatusColor(status),
          )}
        >
          {STATUS_LABEL_MAP[status]}
        </span>
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <StatusDot status={status} />
      <p className="sm:text-base">{STATUS_LABEL_MAP[status]}</p>
    </div>
  );
}
