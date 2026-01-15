'use client';
import { CloseButton, Drawer, Portal } from '@chakra-ui/react';
import { ButtonDefault } from '../Button/Button';
import { TitleH2, TitleH4 } from '../Titles/Titles';
import { normalizeCurrency } from '@/utils/helpers';
import Image from 'next/image';
import ImageFood from '../../../public/image_food2.png';
import { FaPlus } from 'react-icons/fa6';
import { FaMinus } from 'react-icons/fa6';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCart } from '@/providers/cartProvider/cartProvider';
import { twMerge } from 'tailwind-merge';

interface CartProps {
  openCart: boolean;
  setOpenCart: (open: boolean) => void;
}

const Cart = ({ openCart, setOpenCart }: CartProps) => {
  const {
    itemsWithGuestUser,
    itemsWithLoggedUser,
    isLoading,
    quantity,
    incrementOrDecrementItemCart,
    removeItemCart,
    session,
  } = useCart();

  const navigation = useRouter();

  function handleSubmitForm() {
    setOpenCart(false); // <-- fecha o drawer

    if (!session?.user.accessToken) {
      navigation.push('/login');
    } else {
      navigation.push('/client/checkout');
    }
  }

  // useEffect(() => {
  //   if (itemsWithLoggedUser?.status === StatusCart.FINALIZADO) {
  //     navigation.refresh();
  //   }
  // }, [itemsWithLoggedUser?.status]);

  const getTotalPrice = () => {
    if (!session?.user.accessToken) {
      const totalPrice = itemsWithGuestUser
        .map((item) => {
          const newQuantity = item.item.unidades!
            ? Number(item.item.unidades) + item.quantity! - 1
            : item.quantity;
          return item.item.unidades!
            ? Number(item.item.precoUnitario) * newQuantity
            : newQuantity * Number(item.item.preco);
        })
        .reduce((acc, curr) => acc + curr, 0)
        .toFixed(2);
      return totalPrice;
    }
    return itemsWithLoggedUser?.valorTotal || '0.00';
  };

  const isCartEmpty =
    (!session?.user.accessToken && itemsWithGuestUser.length === 0) ||
    (session?.user.accessToken &&
      (!itemsWithLoggedUser?.carrinhoItens ||
        itemsWithLoggedUser.carrinhoItens.length === 0));

  // useEffect(() => {
  //   console.log('dados carrinho logado', itemsWithLoggedUser);
  // }, [itemsWithLoggedUser]);
  // useEffect(() => {
  //   console.log('dados carrinho local', itemsWithGuestUser);
  // }, [itemsWithLoggedUser]);
  return (
    <Drawer.Root
      size={'sm'}
      open={openCart}
      onOpenChange={(details) => setOpenCart(details.open)}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header className="px-3 py-5">
              <TitleH4 className="font-normal">
                Sacola
                <span className="text-xs text-text-secondary">
                  ({isCartEmpty ? 0 : quantity})
                </span>
              </TitleH4>
            </Drawer.Header>

            <Drawer.Body className="h-2 overflow-y-auto bg-neutral-offWhite px-3 py-5">
              {isCartEmpty ? (
                <div className="px-4 text-center">
                  <TitleH2>Seu carrinho está vazio!</TitleH2>
                  <p className="text-base">
                    Navegue pelo site e adicine itens para realizar sua compra!
                  </p>
                </div>
              ) : !session?.user.accessToken ? (
                itemsWithGuestUser.map((content) => (
                  <div
                    className="mb-5 flex gap-2 bg-white px-2 py-2"
                    key={content.item.id}
                  >
                    <Image
                      src={content.item.itemDescription.image || ImageFood}
                      alt="imagem do produto"
                      quality={100}
                      className="h-25 w-28 flex-shrink-0 rounded-sm object-cover"
                    />
                    <div className="flex flex-col gap-3">
                      <TitleH4>{content.item.itemDescription.nome}</TitleH4>
                      <p>{content.item.itemDescription.descricao}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">
                          {normalizeCurrency(content.item.preco)}
                        </p>
                        <div className="flex items-center gap-4">
                          <ButtonDefault
                            onClick={() =>
                              incrementOrDecrementItemCart(
                                'decrement',
                                content.item?.id,
                              )
                            }
                          >
                            <FaMinus />
                          </ButtonDefault>
                          <span className="font-semibold">
                            {content.item.unidades != null
                              ? content.quantity +
                                Number(content.item.unidades) -
                                1
                              : content.quantity}
                          </span>
                          <ButtonDefault
                            onClick={() =>
                              incrementOrDecrementItemCart(
                                'increment',
                                content.item?.id,
                              )
                            }
                          >
                            <FaPlus />
                          </ButtonDefault>
                          <ButtonDefault
                            onClick={() => removeItemCart(content.item?.id)}
                          >
                            <FaRegTrashAlt />
                          </ButtonDefault>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                itemsWithLoggedUser?.carrinhoItens.map((content) => (
                  <div
                    className="mb-5 flex gap-2 bg-white px-2 py-2"
                    key={content.itemId}
                  >
                    <Image
                      src={content.item.itemDescription.image || ImageFood}
                      alt="imagem do produto"
                      quality={100}
                      className="h-24 w-28 flex-shrink-0 rounded-sm object-cover"
                    />
                    <div className="flex flex-col gap-1">
                      <TitleH4 className="mb-0">
                        {content.item.itemDescription.nome}
                      </TitleH4>
                      <p>{content.item.itemDescription.descricao}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">
                          {normalizeCurrency(content.item.preco)}
                        </p>
                        <div className="flex items-center gap-4">
                          <ButtonDefault
                            onClick={() =>
                              incrementOrDecrementItemCart(
                                'decrement',
                                content.itemId,
                              )
                            }
                          >
                            <FaMinus size={15} />
                          </ButtonDefault>
                          <span className="font-semibold">
                            {content.item.unidades != null
                              ? content.quantidade +
                                Number(content.item.unidades) -
                                1
                              : content.quantidade}
                          </span>
                          <ButtonDefault
                            onClick={() =>
                              incrementOrDecrementItemCart(
                                'increment',
                                content.itemId,
                              )
                            }
                          >
                            <FaPlus size={15} />
                          </ButtonDefault>

                          <ButtonDefault
                            onClick={() => removeItemCart(content.itemId)}
                          >
                            <FaRegTrashAlt size={15} />
                          </ButtonDefault>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </Drawer.Body>

            <Drawer.Footer className="flex flex-col border-t border-gray-200 px-4 py-5">
              <div className="flex w-full flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <TitleH4 className="font-semibold">Subtotal</TitleH4>
                  <p className="font-semibold">
                    {normalizeCurrency(getTotalPrice())}
                  </p>
                </div>
              </div>
              <ButtonDefault
                variant="primary"
                className={twMerge('w-full py-3')}
                isLoading={isLoading}
                onClick={() => handleSubmitForm()}
                disabled={isCartEmpty ? isCartEmpty : false}
              >
                {!session?.user.accessToken
                  ? 'Login / Cadastro'
                  : 'Finalizar Pedido'}
              </ButtonDefault>
            </Drawer.Footer>

            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export { Cart };
