import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        subscribeInputContainer: {
            marginLeft: '40px',
            display: 'flex',
        },
        subscribeInput: {
            backgroundColor: '#fff',
            padding: '5px 10px',
            borderRadius: '8px 0 0 8px',
        },
        subscribeBtn: {
            borderRadius: '0 8px 8px 0'
        },
    }),
);