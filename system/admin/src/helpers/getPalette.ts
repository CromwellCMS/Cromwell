import { getStoreItem } from '@cromwell/core';
import { ThemeOptions } from '@mui/material';

export const getPalette: () => ThemeOptions['palette'] = () => {
  const darkMode = getStoreItem('theme')?.mode === 'dark';

  if (darkMode) {
    return {
      primary: {
        main: '#9747d3',
        light: '#9747d3',
        dark: '#8228c5',
      },
      secondary: {
        main: '#910081',
        light: '#910081',
        dark: '#910081',
      },
    };
  }

  return {
    primary: {
      main: 'rgba(79, 70, 229, 1)',
      light: 'rgba(99, 102, 241, 1)',
      dark: 'rgba(99, 102, 241, 1)',
    },
    secondary: {
      main: '#910081',
      light: '#910081',
      dark: '#910081',
    },
  };
};
