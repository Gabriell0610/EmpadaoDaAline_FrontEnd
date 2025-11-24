import { orderDetailsDto } from '@/utils/schemas/order.schema';
import { create } from 'zustand';

interface OrderStore {
  order: orderDetailsDto | null;
  setOrder: (data: orderDetailsDto) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: null,

  setOrder: (data) => set({ order: data }),

  clearOrder: () => set({ order: null }),
}));
