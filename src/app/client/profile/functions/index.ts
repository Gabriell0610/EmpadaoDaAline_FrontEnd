import { useFetch } from '@/hooks/useFetch/useFetch';
import { ListAddressUser, ListDataUserLogged } from '@/utils/types/user.type';
import { useCallback, useState, useEffect } from 'react';

import { EDIT_USER_ADDRESS, USER, USER_ME } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';

import { getSafeErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';
import { AddressUserData } from '@/utils/schemas/address.schema';
import { PersonalUserData } from '@/utils/schemas/personalUser.schema';

export default function useProfileRequests() {
  const [dataUserLogged, setDataUserLogged] = useState<ListDataUserLogged>();
  const [selectAddress, setSelectAddress] = useState<ListAddressUser>();
  const [idAddress, setIdAddress] = useState('');
  const { call, isLoading } = useFetch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const GetDataUser = useCallback(async () => {
    const res = await call<null, ListDataUserLogged>({
      method: StatusHttp.GET,
      url: USER_ME,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
    }

    setDataUserLogged(res.data);
  }, [call]);

  const editPersonalUserData = async (data: PersonalUserData) => {
    const res = await call<PersonalUserData, null>({
      method: StatusHttp.PUT,
      url: USER,
      body: data,
    });
    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
    }
    await GetDataUser();
    closeModal();
  };

  const editAddressUserData = useCallback(
    async (data: AddressUserData) => {
      const res = await call<AddressUserData, null>({
        method: StatusHttp.PUT,
        url: `${EDIT_USER_ADDRESS}${idAddress}`,
        body: data,
      });

      if (!res.success) {
        toast.error(getSafeErrorMessage(res.message));
      }

      toast.success(res.message);

      await GetDataUser();
      closeModal();
    },
    [call, GetDataUser, idAddress],
  );

  useEffect(() => {
    GetDataUser();
  }, [GetDataUser]);

  return {
    openModal,
    closeModal,
    setIdAddress,
    GetDataUser,
    setSelectAddress,
    editAddressUserData,
    editPersonalUserData,
    dataUserLogged,
    selectAddress,
    isModalOpen,
    isLoading,
  };
}
