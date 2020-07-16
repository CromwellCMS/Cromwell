import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        LoadBox: {
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }),
);

interface LoadBoxProps {
    size?: number
}

const LoadBox = (props: LoadBoxProps) => {
    const classes = useStyles();
    return (
        <div className={classes.LoadBox} >
            <CircularProgress size={(props.size ? props.size : 150)} />
        </div>
    )
}

export default LoadBox;