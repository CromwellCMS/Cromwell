import { createStyles, makeStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuList: {
            display: 'flex',
            width: '100%',
            // padding: '10px'
        },
        mobileMenuList: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            // padding: '10px'
        },
        listItemWrapper: {
            padding: '10px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
        },
        listItem: {
            display: 'flex',
            alignItems: 'center'
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
        expandMoreIcon: {
            transition: '0.3s',
            marginLeft: '10px'
        },
        menuSubitems: {
            display: 'grid',
        },
        menuSubitemsMobile: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
        },
        linkTitle: {
            color: '#111'
        },
        sublinkTitle: {
            color: '#111'
        }
    }),
);