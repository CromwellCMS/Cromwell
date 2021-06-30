import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            margin: '15px 0',
            // boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.04), 0 0 4px 0px rgba(0, 0, 0, 0.05)',
            boxShadow: 'none',
            backgroundColor: '#fff',
            borderRadius: '5px'
        },
        root: {
            margin: 'auto',
        },
        cardHeader: {
            padding: theme.spacing(1, 2),
        },
        list: {
            maxHeight: 230,
            backgroundColor: theme.palette.background.paper,
            overflow: 'auto',
        },
        button: {
            margin: theme.spacing(0.5, 0),
        },
        attrValueIcon: {
            width: '30px',
            height: '30px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            marginRight: '10px'
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        headerWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        paper: {
            boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.04), 0 0 10px 3px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#fff',
            borderRadius: '5px'
        },
        mobileOpenBtn: {
            position: 'fixed',
            top: '100px',
            left: '10px',
            boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.04), 0 0 10px 3px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#fff',
            zIndex: 11,
            color: '#111',
        },
        drawer: {
            minWidth: '300px',
            backgroundColor: '#fff',
            height: '100vh',
            padding: '10px',
        },
        mobileCloseBtn: {
            color: '#111',
        },
        mobileHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 500,
            paddingLeft: '10px',
            fontSize: '18px',
        },
        styledScrollBar: {
            '&::-webkit-scrollbar': {
                width: '0.5em',
                height: '0.5em',
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba($color: #000000, $alpha: 0.1)',
                borderRadius: '30px',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#7f7f7f',
                outline: 'none',
                borderRadius: '30px',
            },
        },
    }),
);

const iOSBoxShadow =
    '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

export const IOSSliderStyles = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.primary.main,
        height: 2,
        padding: '15px 0',
    },
    thumb: {
        height: 28,
        width: 28,
        backgroundColor: '#fff',
        boxShadow: iOSBoxShadow,
        marginTop: -14,
        marginLeft: -14,
        '&:focus, &:hover, &$active': {
            boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                boxShadow: iOSBoxShadow,
            },
        },
    },
    active: {},
    valueLabel: {
        // left: 'calc(-50% + 12px)',
        // top: -22
        marginLeft: '50%'
    },
    track: {
        height: 2,
    },
    rail: {
        height: 2,
        opacity: 0.5,
        backgroundColor: '#bfbfbf',
    },
    mark: {
        backgroundColor: '#bfbfbf',
        height: 8,
        width: 1,
        marginTop: -3,
    },
    markActive: {
        opacity: 1,
        backgroundColor: 'currentColor',
    },
}))