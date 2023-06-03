import { IconButton } from '@components/buttons/IconButton';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import React from 'react';
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

export function ResponsiveSideNav() {
  const width = useWindowWidth();
  const { open, setOpen } = useMobileSidebarStore();

  if (width < 768) {
    return (
      <SwipeableTemporaryDrawer open={open} setOpen={setOpen}>
        <SideNav screen={'mobile'} />
      </SwipeableTemporaryDrawer>
    );
  }

  return <SideNav screen="desktop" />;
}

export function SideNavMobileButton() {
  const width = useWindowWidth();
  const toggle = useMobileSidebarStore((state) => state.toggle);

  if (width >= 768) {
    return null;
  }

  return (
    <IconButton sx={{ mr: '10px' }}>
      <Bars3Icon className="w-5 h-5" onClick={toggle} />
    </IconButton>
  );
}
