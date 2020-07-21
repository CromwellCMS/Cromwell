import { createStyles, makeStyles, Theme } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 345,
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
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
        mainMenu: {
            width: '100%'
        },
        itemList: {
            width: '100%'
        },
        card: {
            margin: '15px 0'
        },
        cardHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        cardTitle: {
            margin: '0 15px',
            fontSize: '20px',
            fontWeight: 400
        },
        cardContent: {
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        },
        field: {
            width: '100%',
            margin: '10px 0'
        },
        sublinksList: {
            margin: '10px 0',
            padding: '10px',
            border: '1px solid #eee',
            borderRadius: '5px'
        },
        sublinkItem: {
            margin: '15px 0',
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-between'
        },
        subField: {
            width: '40%',
            margin: '0 10px'
        },
        addBtn: {
            padding: '15px',
            display: 'flex',
            justifyContent: 'center'
        },
        saveBtn: {
            margin: '20px 0 0 auto'
        }
    }),
);