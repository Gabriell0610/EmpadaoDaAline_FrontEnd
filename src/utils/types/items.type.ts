enum EnumStatusItem {
  ATIVO,
  INATIVO,
}

export interface BodyItemInterface {
  itemId: string;
}

export interface ListActiveItemsInterface {
  id: string;
  descricao: string;
  image: string;
  nome: string;
  status: string;
  tipo: string;
  item: {
    id: string;
    preco: string;
    disponivel: EnumStatusItem;
    tamanho: string;
    unidades: number;
    pesoReal: string;
  }[];
}

export interface ListActiveItemsByIdInterface {
  id: string;
  precoUnitario: number;
  tamanho: string;
  preco: string;
  unidades: string;
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
