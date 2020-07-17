import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuList: {
            display: 'flex',
            width: '100%',
            backgroundColor: '#eee'
            // padding: '10px'
        },
        listItem: {
            padding: '10px 20px'
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