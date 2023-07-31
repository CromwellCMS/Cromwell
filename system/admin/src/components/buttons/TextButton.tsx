import { Box, SxProps } from '@mui/material';
import React from 'react';

export const TextButton = React.forwardRef(
  (
    props: React.PropsWithChildren<
      React.ButtonHTMLAttributes<HTMLButtonElement> & {
        inputClassName?: string;
        variant?: 'filled' | 'outlined';
      }
    > & { sx?: SxProps },
    ref,
  ) => {
    const { children, variant = 'filled', sx, ...buttonProps } = props;
    return (
      <Box
        component="button"
        ref={ref}
        {...buttonProps}
        sx={{
          backgroundColor: variant === 'filled' ? 'primary.main' : 'transparent',
          borderRadius: '10px',
          boxShadow: variant === 'filled' ? `0 2px 3px 0 rgba(0, 0, 0, 0.05), 0 0 20px 4px rgba(0, 0, 0, 0.1)` : 'none',
          lineHeight: '0.93rem',
          fontSize: '1rem',
          padding: '7px 12px',
          color: variant === 'filled' ? 'white' : 'primary.main',
          fontWeight: '500',
          transition: '0.3s',
          border: '3px solid',
          borderColor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          opacity: props?.disabled ? 0.3 : undefined,
          '& > *': {
            textDecoration: 'none',
          },
          '&:hover': {
            textDecoration: 'none',
            backgroundColor: variant === 'filled' ? 'primary.light' : 'transparent',
            boxShadow:
              variant === 'outlined'
                ? '0 2px 3px 0 rgb(79 70 229 / 30%), 0 0 20px 4px rgb(79 70 229 / 15%)'
                : '0 2px 3px 0 rgb(79 70 229 / 60%), 0 0 20px 4px rgb(79 70 229 / 30%)',
          },
          '&:active': {
            textDecoration: 'none',
            border: variant === 'outlined' ? '3px solid' : '3px solid #444',
            backgroundColor: 'primary.light',
            color: 'white',
            borderColor: 'primary.main',
          },
          ...sx,
        }}
      >
        {children}
      </Box>
    );
  },
);
