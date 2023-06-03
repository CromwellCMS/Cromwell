import { alpha, Box, SxProps, useTheme } from '@mui/material';
import React from 'react';

export const IconButton = React.forwardRef(
  (
    props: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> & {
      sx?: SxProps;
    },
    ref,
  ) => {
    const { children, sx, ...buttonProps } = props;
    const theme = useTheme();
    return (
      <Box
        component="button"
        {...buttonProps}
        ref={ref}
        sx={{
          border: '2px solid transparent',
          borderRadius: '100%',
          padding: '5px',
          transition: '0.3s',
          opacity: props.disabled ? 0.3 : 1,
          '&:hover': {
            backgroundColor: 'rgba(0,0,0, 0.15)',
          },
          ':active': {
            border: '2px solid #222',
            borderColor: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
          },
          ...sx,
        }}
      >
        {children}
      </Box>
    );
  },
);
