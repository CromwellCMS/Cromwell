import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import React, { useState } from 'react';

import { VisibilityIcon, VisibilityOffIcon } from '../../icons';
import styles from './SignIn.module.scss';

export const PasswordField = (props: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <TextField {...props}
      type={showPassword ? 'text' : 'password'}
      variant="standard"
      size="small"
      className={styles.textField}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}