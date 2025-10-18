import { Button, Menu, Portal } from '@chakra-ui/react';
import Link from 'next/link';
import { FaRegCircleUser } from 'react-icons/fa6';
import { FaBagShopping } from 'react-icons/fa6';

export const ProfileHeader = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button size="md" variant="outline">
          <FaRegCircleUser className="outline-none" size={22} />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content className="flex flex-col">
            <div className="flex cursor-pointer items-center gap-2 px-2 py-2">
              <FaRegCircleUser size={15} />
              <Link
                href={'/client/profile'}
                rel="noreferrer"
                className="outline-none hover:text-text-green hover:underline"
              >
                Perfil
              </Link>
            </div>
            <div className="flex cursor-pointer items-center gap-2 px-2 py-2">
              <FaBagShopping size={15} />
              <Link
                href={'/client/orders'}
                rel="noreferrer"
                className="outline-none hover:text-text-green hover:underline"
              >
                Meus Pedidos
              </Link>
            </div>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
