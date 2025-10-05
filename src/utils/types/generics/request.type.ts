export interface RequestInterface<T> {
  token: string;
  idUser?: string;
  body?: T;
}
