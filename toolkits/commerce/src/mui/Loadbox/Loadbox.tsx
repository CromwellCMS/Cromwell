import { CircularProgress } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React from 'react';

/** @internal */
const useStylesLoadBox = makeStyles(() =>
  createStyles({
    loadBox: {
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px'
    }
  }),
);

/** @internal */
export const Loadbox = (props: { size?: number }) => {
  const classes = useStylesLoadBox();
  return (
    <div className={classes.loadBox} >
      <CircularProgress size={(props.size ? props.size : 150)} />
    </div>
  )
}