import { Box, Tab, Tabs } from '@mui/material';
import React, { useCallback, useEffect } from 'react';

import { useForceUpdate } from '../../helpers/forceUpdate';
import { store } from './Product';

export function useTabs(): [number, (v: number) => void] {
  const forceUpdate = useForceUpdate();

  const changeTab = useCallback((value) => {
    store.tab = value;
    forceUpdate();
    store.onTabChange.forEach(cb => cb())
  }, []);

  useEffect(() => {
    const listener = () => {
      forceUpdate();
    }
    store.onTabChange.push(listener);
    return () => {
      store.onTabChange = store.onTabChange.filter(l => l !== listener);
    }
  }, []);

  return [store.tab, changeTab];
}

export function Header() {
  const [activeTabNum, setActiveTabNum] = useTabs();

  const handleTabChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setActiveTabNum(newValue);
  }

  return <Box>
    <Tabs
      value={activeTabNum}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleTabChange}
    >
      <Tab label="Main" />
      <Tab label="Variants" />
    </Tabs>
  </Box>
}