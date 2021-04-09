import { createStyles, makeStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.04), 0 0 10px 3px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#fff',
            borderRadius: '5px',
        },
        content: {
            padding: '15px',
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
        },
        saveBtn: {
            margin: '20px 0 0 auto'
        }
    }),
);