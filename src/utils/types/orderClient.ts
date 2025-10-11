import { PaymentMethod } from '@/constants/enums/PaymentMethod';
import { StatusOrder } from '@/constants/enums/StatusOrder';
import { Carrinho } from './cart.type';
import { addressUser } from './user.type';

export interface OrderInterface {
  id: string;
  horarioDeEntrega: string;
  dataAgendamento: Date;
  meioPagamento: PaymentMethod;
  observacao?: string | null;
  precoTotal: number;
  numeroPedido: number;
  status: StatusOrder;
}

export interface ListOrderByClient extends OrderInterface {
  carrinho: Carrinho;
  endereco: addressUser;
}
