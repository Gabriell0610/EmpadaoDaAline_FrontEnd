import { ApiResponse } from '@/utils/types/generics/apiResponse';
import { ListAddressUser, ListDataUserLogged } from '@/utils/types/user.type';

export function UserHook() {
  async function getAddressByUser(token: string) {
    console.log('Token no hook', token);
    const req = await fetch('/api/user', {
      method: 'GET',
      headers: {
        authorization: `${token}`,
        'Content-Type': 'application/json',
      },
    });

    const res: ApiResponse<ListAddressUser[]> = await req.json();

    return res;
  }

  async function getDataUserLogged(token: string) {
    const req = await fetch('/api/user', {
      method: 'GET',
      headers: {
        authorization: `${token}`,
        'Content-Type': 'application/json',
      },
    });

    const res: ApiResponse<ListDataUserLogged> = await req.json();

    return res;
  }

  return {
    getAddressByUser,
    getDataUserLogged,
  };
}
