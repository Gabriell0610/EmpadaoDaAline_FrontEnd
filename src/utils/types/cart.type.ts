export interface CreateCartInteface {
  itemId: string;
  userId: string;
}

export interface DecrementOrIncrementInterface {
  itemId: string;
}

export interface ItemCarrinho {
  id: string;
  itemId: string;
  carrinhoId: string;
  quantidade: number;
  precoAtual: string;
  Item: {
    nome: string;
    preco: string;
    image: string;
    descricao: string;
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
