export interface CreateCartInteface {
  itemId: string;
  userId: string;
}

export interface DecrementOrIncrementOrRemoveInterface {
  itemId: string;
}

export interface ItemCarrinho {
  id: string;
  itemId: string;
  carrinhoId: string;
  quantidade: number;
  precoAtual: string;
  item: {
    preco: string;
    itemDescription: {
      image: string;
      descricao: string;
      nome: string;
    };
    disponivel: string;
    tamanho: string;
  };
}

export interface Carrinho {
  id: string;
  status: string;
  dataCriacao: string;
  usuarioId: string;
  valorTotal: string;
  carrinhoItens: ItemCarrinho[];
}
