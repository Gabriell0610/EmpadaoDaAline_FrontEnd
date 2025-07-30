enum EnumStatusItem {
  ATIVO,
  INATIVO,
}

export interface ListActiveItemsInterface {
  id: string;
  descricao: string;
  image: string;
  nome: string;
  status: string;
  item: {
    id: string;
    preco: string;
    disponivel: EnumStatusItem;
    tamanho: string;
    pesoReal: string;
  }[];
}

export interface ListActiveItemsByIdInterface {
  id: string;
  tamanho: string;
  preco: string;
  itemDescription: {
    id: string;
    descricao: string;
    image: string;
    nome: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
    disponivel: EnumStatusItem;
  };
  pesoReal: string;
}
