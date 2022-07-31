import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';

import { useTabs } from '../hooks/useTabs';

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
      <Tab label="Main" disableRipple />
      <Tab label="Attributes" disableRipple />
      <Tab label="Variants" disableRipple />
    </Tabs>
  </Box>
}