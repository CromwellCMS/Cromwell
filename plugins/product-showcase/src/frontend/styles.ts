import { createStyles, makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(() =>
    createStyles({
        wrapper: {
            width: '100%',
            height: '100%',
            padding: '10px 0'
        },
        listItem: {
            margin: '0 10px',
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
        swiperContainer: {
            width: '100%',
            padding: '15px 0'
        },
        swiperPagination: {
            bottom: 0
        }
    }),
);