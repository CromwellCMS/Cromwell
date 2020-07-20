import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrapper: {
            display: 'flex',
            width: '100%',
            backgroundColor: '#eee',
            padding: '10px'
        },
        list: {
            display: 'flex'
        },
        listItem: {
            margin: '0 10px',
            padding: '10px'
        },
        popover: {
            pointerEvents: 'none',
            maxWidth: '1200px'
        },
        paper: {
            // display: 'flex',
            pointerEvents: 'initial',
            padding: '15px'
        }
    }),
);