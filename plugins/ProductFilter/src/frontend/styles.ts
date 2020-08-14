import { createStyles, makeStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            margin: '15px 0'
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
        }
    }),
);