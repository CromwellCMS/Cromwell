import { getStoreItem } from '@cromwell/core';
import { getPalette } from '@helpers/getPalette';
import { createTheme } from '@mui/material/styles';

export function useTheme() {
  const darkMode = getStoreItem('theme')?.mode === 'dark';

  document.body.classList.remove('modeDark', 'modeLight', 'dark', 'light');
  document.body.classList.add(darkMode ? 'modeDark' : 'modeLight');
  document.body.classList.add(darkMode ? 'dark' : 'light');

  const theme = createTheme({
    typography: {
      fontFamily: `Roboto, ui-sans-serif, system-ui, -apple-system, Segoe UI, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
    },
    palette: getPalette(),
  });

  return theme;
}
