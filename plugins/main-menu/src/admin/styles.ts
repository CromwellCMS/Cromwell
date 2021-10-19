import { Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

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
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
        },
        itemList: {
            width: '100%',
            padding: '0 10px',
        },
        card: {
            margin: '15px 0'
        },
        cardActions: {
            padding: '0 8px'
        },
        cardHeader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        cardTitle: {
            margin: '0 15px',
            fontSize: '16px',
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
            padding: '15px 10px',
            display: 'flex',
            justifyContent: 'space-between'
        },
        sublinksTitle: {
            fontSize: '15px',
            fontWeight: 400
        },
        subField: {
            width: '40%',
            margin: '0 10px'
        },
        addBtn: {
            padding: '10px',
            display: 'flex',
            justifyContent: 'center'
        },
        saveBtn: {
            margin: '20px 0 0 auto'
        },
        "@global": {
            '.PluginMainMenu-paper': {
                boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.04), 0 0 10px 3px rgba(0, 0, 0, 0.05)',
                backgroundColor: '#fff',
                borderRadius: '5px',
            },
            '.modeDark .PluginMainMenu-paper': {
                boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.04), 0 0 10px 3px rgba(0, 0, 0, 0.05)',
                backgroundColor: '#222',
                borderRadius: '5px',
            },
        }
    }),
);