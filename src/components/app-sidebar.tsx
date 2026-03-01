'use client';

import * as React from 'react';
import {
  //Container,
  GalleryVerticalEnd,
  ShoppingBasketIcon,
  HomeIcon,
  ChartNoAxesCombined,
  CircleUserRound,
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
import { useAuth } from '@/providers/authProvider';

type AppSidebarInterface = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarInterface) {
  const { user } = useAuth();

  const data = {
    user: {
      name: user?.nome.toUpperCase(),
      email: user?.email || 'Error',
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
        title: 'Dashboard',
        url: '/admin/dashboard',
        icon: ChartNoAxesCombined,
      },
      {
        title: 'Itens',
        url: '/admin/newItems',
        icon: ShoppingBasketIcon,
      },
      {
        title: 'Client',
        url: '/client',
        icon: CircleUserRound,
      },
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
