import { TPalette } from '@cromwell/core';
import { createTheme } from '@mui/material/styles';

export const getTheme = (palette?: TPalette | null) => {
  const primary = palette?.primaryColor ?? '#9900CC';
  const secondary = palette?.secondaryColor ?? '#333333';
  return createTheme({
    palette: {
      primary: {
        main: primary,
        light: primary,
        dark: primary,
      },
      secondary: {
        main: secondary,
        light: secondary,
        dark: secondary,
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });
};
