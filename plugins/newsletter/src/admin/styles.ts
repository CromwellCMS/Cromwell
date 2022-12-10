import { createStyles, makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.04), 0 0 10px 3px rgba(0, 0, 0, 0.05)',
      backgroundColor: '#fff',
      borderRadius: '5px',
    },
    content: {
      padding: '15px',
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
    },
    saveBtn: {
      margin: '20px 0 0 auto',
    },
    dashboard: {
      padding: '25px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
    },
    dashboardText: {
      fontSize: '22px',
      fontWeight: 500,
    },
    dashboardIcon: {
      width: '50px',
      height: '50px',
      objectFit: 'contain',
      marginRight: '25px',
    },
    '@global': {
      '.modeDark .PluginNewsletter-dashboardImage': {
        filter: 'invert(1)',
      },
    },
  }),
);
