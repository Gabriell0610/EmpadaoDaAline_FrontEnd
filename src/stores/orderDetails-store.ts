import { OrderDetailsDto } from '@/utils/schemas/order.schema';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrderStore {
  order: OrderDetailsDto | null;
  setOrder: (data: OrderDetailsDto) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      order: null,
      setOrder: (data) => set({ order: data }),
      clearOrder: () => set({ order: null }),
    }),
    {
      name: 'order-details',
    },
  ),
);
