import { createStyles, makeStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '10px 0'
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