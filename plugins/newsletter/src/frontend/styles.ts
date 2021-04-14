import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        subscribeInputContainer: {
            display: 'flex',
        },
        subscribeInput: {
            backgroundColor: '#fff',
            padding: '5px 10px',
            borderRadius: '8px 0 0 8px',
            border: '1px solid #ccc',
            borderRight: '0',
        },
        subscribeBtn: {
            borderRadius: '0 8px 8px 0'
        },
    }),
);