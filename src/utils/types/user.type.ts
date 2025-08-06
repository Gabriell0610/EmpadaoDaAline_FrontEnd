export interface ListAddressUser {
  endereco: {
    rua: string;
    numero: string;
    cidade: string;
    estado: string;
    bairro: string;
    cep: string;
    complemento: string;
    id: string;
  }[];
}

export interface ListDataUserLogged {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  enderecos: {
    endereco: addressUser;
  }[];
}

export interface addressUser {
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  bairro: string;
  cep: string;
  complemento: string;
  id: string;
}
