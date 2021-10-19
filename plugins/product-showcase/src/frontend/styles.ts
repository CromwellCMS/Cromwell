import { createStyles, makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() =>
    createStyles({
        wrapper: {
            width: '100%',
            height: '100%',
            padding: '10px 0'
        },
        listItem: {
            margin: '0 10px',
            '& div': {
                margin: '0 auto',
            }
        },
        popover: {
            pointerEvents: 'none',
            maxWidth: '1200px'
        },
        paper: {
            // display: 'flex',
            pointerEvents: 'initial',
            padding: '15px'
        },
    }),
);