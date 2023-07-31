import { IconButton } from '@components/buttons/IconButton';
import { getPageInfos } from '@helpers/navigation';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import React from 'react';
import { useLocation } from 'react-router';
import { create } from 'zustand';

import SideNav from './SideNav';
import { SwipeableTemporaryDrawer } from './SwipeableTemporaryDrawer';

export const useMobileSidebarStore = create<{ open: boolean; setOpen: (open: boolean) => void; toggle: () => void }>(
  (set) => ({
    open: false,
    setOpen: (open: boolean) => set({ open }),
    toggle: () => set((state) => ({ open: !state.open })),
  }),
);

export function LayoutSideNav() {
  const width = useWindowWidth();
  const pageInfos = getPageInfos();
  useLocation();

  const currentInfo = pageInfos.find((i) => i.route === window.location.pathname.replace('/admin', ''));

  // check for disabled sidebar
  if (currentInfo?.disableSidebar) return <></>;

  if (width < 768) {
    return <SwipeableSideNav />;
  }

  return <SideNav screen="desktop" />;
}

export function SwipeableSideNav() {
  const { open, setOpen } = useMobileSidebarStore();
  return (
    <SwipeableTemporaryDrawer open={open} setOpen={setOpen}>
      <SideNav screen={'mobile'} />
    </SwipeableTemporaryDrawer>
  );
}

export function SideNavMobileButton() {
  const width = useWindowWidth();

  if (width >= 768) {
    return null;
  }

  return <SideNavToggleButton />;
}

export function SideNavToggleButton() {
  const toggle = useMobileSidebarStore((state) => state.toggle);
  return (
    <IconButton onClick={toggle} sx={{ mr: '10px' }}>
      <Bars3Icon className="w-5 h-5" />
    </IconButton>
  );
}
