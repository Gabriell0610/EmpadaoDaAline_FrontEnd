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

export interface AddressViaCepInterface {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}
