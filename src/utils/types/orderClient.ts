import { StatusOrder } from '@/constants/enums/StatusOrder';
import { ListActiveItemsInterface } from './items.type';
import { PaginationInterface } from './paginate';

export interface ItemInCartItens {
  precoAtual: number;
  quantidade: number;
  item: {
    id: string;
    preco: string;
    tamanho: string | null;
    unidades: number | null;
    precoUnitario: number | null;
    itemDescription: {
      id: string;
      image: string;
      nome: string;
      tipo: string | null;
      disponivel: string | null;
      descricao: string | null;
    } | null;
  };
}

export interface OrderInterface {
  id: string;
  horarioDeEntrega: string;
  dataAgendamento: Date;
  metodoPagamento: {
    id: string;
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

export type ListOrderByClient = {
  id: string;
  numeroPedido: number;
  status: StatusOrder;
  observacao: string | null;
  precoTotal: string;
  frete: string;
  dataAgendamento: Date | null;
  horarioInicio: string | null;
  horarioFim: string | null;

  metodoPagamento: {
    id: string;
    nome: string;
  };

  usuario: {
    nome: string;
    telefone: string;
    email: string;
  };

  carrinho: {
    status: string;
    valorTotal: string | null;
    carrinhoItens: {
      precoAtual: number;
      quantidade: number;
      item: {
        id: string;
        preco: string;
        tamanho: string | null;
        unidades: number | null;
        precoUnitario: number | null;
        itemDescription: {
          id: string;
          image: string;
          nome: string;
          tipo: string | null;
          disponivel: string | null;
          descricao: string | null;
        } | null;
      };
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

export interface ListAllOrdersInterface extends PaginationInterface {
  data: {
    id: string;
    numeroPedido: number;
    precoTotal: number;
    status: StatusOrder;
    observacao: string | null;
    dataAgendamento: Date;
    horarioInicio: string;
    horarioFim: string;
    metodoPagamento: {
      id: string;
      nome: string;
    };
    usuario: {
      nome: string;
      telefone: string;
      email: string;
    };
    carrinho: {
      status: string;
      valorTotal: number;
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
  }[];
}

export interface UpdateStatusOrderInterface {
  status: StatusOrder;
}
