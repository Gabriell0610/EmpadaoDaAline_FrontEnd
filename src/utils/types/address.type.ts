export interface ListAddressUserById {
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
  usuarioId: string;
  enderecoId: string;
}

export interface AddAddressInterface {
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  bairro: string;
  cep: string;
  complemento: string;
}
