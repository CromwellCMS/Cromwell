import { Button } from '@mui/material';
import React from 'react';

export const ActionButton = (props) => {
    return <Button style={{ borderRadius: '30px' }} {...props}>{props.children}</Button>
}