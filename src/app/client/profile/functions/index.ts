import { useFetch } from '@/hooks/useFetch/useFetch';
import { ProfilePageProps } from '@/utils/types/generics/layout.type';
import { ListAddressUser, ListDataUserLogged } from '@/utils/types/user.type';
import { useCallback, useState, useEffect } from 'react';

import { EDIT_USER_ADDRESS, USER, USER_ME } from '@/constants';
import { StatusHttp } from '@/constants/enums/StautsHttp';

import { getSafeErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';
import { addressUserData } from '@/utils/schemas/address.schema';
import { personalUserData } from '@/utils/schemas/personalUser.schema';

export default function useProfileRequests({ session }: ProfilePageProps) {
  const [dataUserLogged, setDataUserLogged] = useState<ListDataUserLogged>();
  const [selectAddress, setSelectAddress] = useState<ListAddressUser>();
  const [idAddress, setIdAddress] = useState('');
  const { call, isLoading } = useFetch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDataUser = useCallback(async () => {
    const res = await call<null, ListDataUserLogged>({
      token: session?.user.accessToken || '',
      method: StatusHttp.GET,
      url: USER_ME,
    });

    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
    }

    setDataUserLogged(res.data);
  }, [call, session?.user.accessToken]);

  const handleEditPersonalUserData = async (data: personalUserData) => {
    const res = await call<personalUserData, null>({
      method: StatusHttp.PUT,
      url: USER,
      body: data,
      token: session?.user.accessToken || '',
    });
    if (!res.success) {
      toast.error(getSafeErrorMessage(res.message));
    }
    await handleDataUser();
    closeModal();
  };

  const handleEditAddressUserData = useCallback(
    async (data: addressUserData) => {
      const res = await call<addressUserData, null>({
        method: StatusHttp.PUT,
        url: `${EDIT_USER_ADDRESS}${idAddress}`,
        body: data,
        token: session?.user.accessToken,
      });

      if (!res.success) {
        toast.error(getSafeErrorMessage(res.message));
      }

      toast.success(res.message);

      await handleDataUser();
      closeModal();
    },
    [call, session?.user.accessToken, handleDataUser, idAddress],
  );

  useEffect(() => {
    handleDataUser();
  }, [handleDataUser]);

  return {
    openModal,
    closeModal,
    setIdAddress,
    handleDataUser,
    setSelectAddress,
    handleEditAddressUserData,
    handleEditPersonalUserData,
    dataUserLogged,
    selectAddress,
    isModalOpen,
    isLoading,
  };
}
