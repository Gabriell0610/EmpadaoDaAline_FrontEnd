export interface BodyItemInterface {
  itemId: string;
}

export interface ListActiveItemsInterface {
  id: string;
  descricao: string;
  image: string;
  nome: string;
  disponivel: string;
  tipo: string;
  item: {
    id: string;
    preco: string;
    tamanho: string;
    unidades: number;
    pesoReal: string;
  }[];
}

export interface ListItemsInterface {
  id: string;
  descricao: string;
  image: string;
  nome: string;
  disponivel: string;
  tipo: string;
  item: {
    id: string;
    preco: string;
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
    disponivel: string;
  };
  pesoReal: string;
}
