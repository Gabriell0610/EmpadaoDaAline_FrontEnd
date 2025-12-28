'use client';

import * as React from 'react';
import {
  //Container,
  GalleryVerticalEnd,
  ShoppingBasketIcon,
  TicketPercent,
  MessageSquareWarning,
  HomeIcon,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Session } from 'next-auth';

interface AppSidebarInterface extends React.ComponentProps<typeof Sidebar> {
  session: Session | null;
}

export function AppSidebar({ session, ...props }: AppSidebarInterface) {
  const data = {
    user: {
      name: session?.user.role.toUpperCase(),
      email: session?.user.email || 'Error',
      avatar: 'A',
    },
    teams: [
      {
        name: 'Empadão da Aline',
        logo: GalleryVerticalEnd,
      },
    ],
    navMain: [
      {
        title: 'Home',
        url: '/admin',
        icon: HomeIcon,
      },
      {
        title: 'Adicionar novos itens',
        url: '/newItems',
        icon: ShoppingBasketIcon,
      },
      {
        title: 'Reclamações',
        url: '/complaints',
        icon: MessageSquareWarning,
      },
      {
        title: 'Cupons',
        url: '/coupons',
        icon: TicketPercent,
      },
      // {
      //   title: 'Frete',
      //   url: '/freight',
      //   icon: Container,
      // },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
