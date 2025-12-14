import { StatusOrder } from '@/constants/enums/StatusOrder';
import { Carrinho } from './cart.type';
import { addressUser } from './user.type';
import { ListActiveItemsInterface } from './items.type';

export interface OrderInterface {
  id: string;
  horarioDeEntrega: string;
  dataAgendamento: Date;
  metodoPagamento: {
    nome: string;
  };
  horarioInicio: string | null;
  horarioFim: string | null;
  observacao?: string | null;
  precoTotal: number;
  numeroPedido: number;
  status: StatusOrder;
  frete: string;
}

export interface ListOrderByClient extends OrderInterface {
  carrinho: Carrinho;
  endereco: addressUser;
}

export type OrderCreateReturnDto = {
  id: string;
  numeroPedido: number;
  precoTotal: number;
  status: StatusOrder;
  observacao: string | null;
  dataAgendamento: Date | null;
  horarioInicio: string | null;
  horarioFim: string | null;
  metodoPagamento: {
    nome: string;
  };
  usuario: {
    nome: string;
    telefone: string;
    email: string;
  };
  carrinho: {
    status: string;
    valorTotal: number | null;
    carrinhoItens: {
      item: ListActiveItemsInterface;
      precoAtual: number;
      quantidade: number;
    }[];
  };
  endereco: {
    bairro: string;
    cidade: string;
    cep: string;
    complemento: string | null;
    estado: string;
    numero: string;
    rua: string;
  };
};
