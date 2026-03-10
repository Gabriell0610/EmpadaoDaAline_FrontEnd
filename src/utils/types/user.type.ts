import { StatusOrder } from '@/constants/enums/StatusOrder';

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
  };
}

export interface ListDataUserLogged {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  enderecos: {
    endereco: AddressUser;
  }[];
}

export type OrderCreateReturnDto = {
  id: string;
  numeroPedido: number;
  status: StatusOrder;
  dataCriacao: Date | null;
};

export interface AddressUser {
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  bairro: string;
  cep: string;
  complemento: string;
  id: string;
}

export interface EditPersonalDataUser {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataAtualizacao: string;
}
