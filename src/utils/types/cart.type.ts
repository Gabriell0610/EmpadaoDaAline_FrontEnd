export interface CreateCartInteface {
  itemId: string;
  userId: string;
}

export interface DecrementOrIncrementOrRemoveInterface {
  itemId: string;
}

export interface ItemCarrinhoInterface {
  id: string;
  itemId: string;
  carrinhoId: string;
  quantidade: number;
  precoAtual: string;
  item: {
    preco: string;
    precoUnitario: string;
    disponivel: string;
    tamanho: string;
    unidades: string;
    itemDescription: {
      image: string;
      descricao: string;
      nome: string;
      tipo: string;
    };
  };
}

export interface Carrinho {
  id: string;
  status: string;
  dataCriacao: string;
  usuarioId: string;
  valorTotal: string;
  carrinhoItens: ItemCarrinhoInterface[];
}
