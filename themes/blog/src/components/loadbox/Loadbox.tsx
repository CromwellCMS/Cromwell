import { CircularProgress, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React from 'react';

const useStylesLoadBox = makeStyles((theme: Theme) =>
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
export const LoadBox = (props: { size?: number }) => {
    const classes = useStylesLoadBox();
    return (
        <div className={classes.loadBox} >
            <CircularProgress size={(props.size ? props.size : 150)} />
        </div>
    )
}