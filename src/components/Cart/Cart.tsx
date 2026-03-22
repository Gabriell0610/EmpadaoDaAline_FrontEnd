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
import toast from 'react-hot-toast';

interface CartProps {
  openCart: boolean;
  setOpenCart: (open: boolean) => void;
}
interface NormalizedCartItem {
  id: string;
  image: string | null;
  nome: string;
  tamanho: string;
  descricao: string;
  preco: string;
  unidades: number | null;
  quantidade: number;
}

const Cart = ({ openCart, setOpenCart }: CartProps) => {
  const {
    itemsWithGuestUser,
    itemsWithLoggedUser,
    isLoading,
    quantity,
    incrementOrDecrementItemCart,
    removeItemCart,
    isAuthenticated,
  } = useCart();

  const navigation = useRouter();

  function handleSubmitForm() {
    setOpenCart(false);
    navigation.push(isAuthenticated ? '/client/checkout' : '/login');
    toast.success('Aguarde você sera redirecionado...');
  }

  const getTotalPrice = () => {
    if (!isAuthenticated) {
      return itemsWithGuestUser
        .map((item) => {
          const newQuantity = item.item.unidades
            ? Number(item.item.unidades) + item.quantity! - 1
            : item.quantity;
          return item.item.unidades
            ? Number(item.item.precoUnitario) * newQuantity
            : newQuantity * Number(item.item.preco);
        })
        .reduce((acc, curr) => acc + curr, 0)
        .toFixed(2);
    }
    return itemsWithLoggedUser?.valorTotal || '0.00';
  };

  const normalizedItems: NormalizedCartItem[] = isAuthenticated
    ? (itemsWithLoggedUser?.carrinhoItens ?? []).map((c) => ({
        id: c.itemId,
        image: c.item.itemDescription.image,
        nome: c.item.itemDescription.nome,
        tamanho: c.item.tamanho,
        descricao: c.item.itemDescription.descricao,
        preco: c.item.preco,
        unidades: c.item.unidades ? Number(c.item.unidades) : null,
        quantidade: c.quantidade,
      }))
    : itemsWithGuestUser.map((c) => ({
        id: c.item.id,
        image: c.item.itemDescription.image,
        nome: c.item.itemDescription.nome,
        tamanho: c.item.tamanho,
        descricao: c.item.itemDescription.descricao,
        preco: c.item.preco,
        unidades: c.item.unidades ? Number(c.item.unidades) : null,
        quantidade: c.quantity!,
      }));

  const isCartEmpty = normalizedItems.length === 0;

  const getDisplayQuantity = (item: NormalizedCartItem) =>
    item.unidades != null
      ? item.quantidade + item.unidades - 1
      : item.quantidade;

  return (
    <Drawer.Root
      size="sm"
      open={openCart}
      onOpenChange={(details) => setOpenCart(details.open)}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header className="px-3 py-5">
              <TitleH4 className="font-normal">
                Sacola{' '}
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
                    Navegue pelo site e adicione itens para realizar sua compra!
                  </p>
                </div>
              ) : (
                normalizedItems.map((item) => (
                  <div
                    key={item.id}
                    className="mb-5 flex gap-2 bg-white px-2 py-2"
                  >
                    {/* Wrapper corrigido para o fill funcionar */}
                    <div className="relative h-28 w-28 flex-shrink-0">
                      <Image
                        src={item.image || ImageFood}
                        alt="imagem do produto"
                        fill
                        quality={100}
                        className="rounded-sm object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <TitleH4 className="mb-0">
                        {item.nome} {item.tamanho}
                      </TitleH4>
                      <p>{item.descricao}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">
                          {normalizeCurrency(item.preco)}
                        </p>
                        <div className="flex items-center gap-4">
                          <ButtonDefault
                            onClick={() =>
                              incrementOrDecrementItemCart('decrement', item.id)
                            }
                          >
                            <FaMinus size={15} />
                          </ButtonDefault>
                          <span className="font-semibold">
                            {getDisplayQuantity(item)}
                          </span>
                          <ButtonDefault
                            onClick={() =>
                              incrementOrDecrementItemCart('increment', item.id)
                            }
                          >
                            <FaPlus size={15} />
                          </ButtonDefault>
                          <ButtonDefault
                            onClick={() => removeItemCart(item.id)}
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
              <div className="mb-4 flex w-full items-center justify-between">
                <TitleH4 className="font-semibold">Subtotal</TitleH4>
                <p className="font-semibold">
                  {normalizeCurrency(getTotalPrice())}
                </p>
              </div>
              <ButtonDefault
                variant="primary"
                className="w-full py-3"
                isLoading={isLoading}
                onClick={handleSubmitForm}
                disabled={isCartEmpty}
              >
                {isAuthenticated ? 'Finalizar Pedido' : 'Login / Cadastro'}
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
