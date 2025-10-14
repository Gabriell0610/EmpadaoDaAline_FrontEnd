import { addressUserData } from '@/utils/schemas/address.schema';
import { personalUserData } from '@/utils/schemas/personalUser.schema';
import { ApiResponse } from '@/utils/types/generics/apiResponse';
import {
  editPersonalDataUser,
  ListAddressUser,
  ListDataUserLogged,
} from '@/utils/types/user.type';

export function UserHook() {
  async function getAddressByUser(token: string) {
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

  async function editDataUserLogger(
    token: string,
    editPersonaData: personalUserData,
  ) {
    const req = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editPersonaData),
    });

    const res: ApiResponse<editPersonalDataUser> = await req.json();

    return res;
  }

  async function editAddressUserData(
    token: string,
    data: addressUserData,
    idAddress: string,
  ) {
    const req = await fetch(`/api/user?idAddress=${idAddress}`, {
      method: 'PUT',
      headers: {
        authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const res: ApiResponse<unknown> = await req.json();

    return res;
  }

  return {
    getAddressByUser,
    getDataUserLogged,
    editDataUserLogger,
    editAddressUserData,
  };
}
