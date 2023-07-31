import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import React from 'react';

export function SwipeableTemporaryDrawer({
  children,
  open,
  setOpen,
}: {
  children: any;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpen(open);
  };

  return (
    <div>
      <SwipeableDrawer anchor={'left'} open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
        {children}
      </SwipeableDrawer>
    </div>
  );
}
