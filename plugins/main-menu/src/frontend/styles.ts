import { createStyles, makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() =>
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
            boxShadow: '0 2px 3px 0 rgba(0, 0, 0, 0.05), 0 0 20px 4px rgba(0, 0, 0, 0.1)',
            pointerEvents: 'initial',
            padding: '15px'
        },
        expandMoreIcon: {
            transition: '0.3s',
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
            margin: 0,
            color: '#111'
        },
        sublinkTitle: {
            margin: 0,
            color: '#111'
        }
    }),
);