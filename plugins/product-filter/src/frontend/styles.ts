import { Theme } from '@mui/material';
import { withStyles } from '@mui/styles';

export const styles = {
  '@global': {
    '.productFilter_card': {
      margin: '15px 0',
      // boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.04), 0 0 4px 0px rgba(0, 0, 0, 0.05)',
      boxShadow: 'none',
      backgroundColor: 'transparent',
      borderRadius: '5px',
    },
    '.productFilter_root': {
      margin: 'auto',
    },
    '.productFilter_cardHeader': {
      padding: '15px',
    },
    '.productFilter_list': {
      maxHeight: 230,
      backgroundColor: 'transparent',
      overflow: 'auto',
    },
    '.productFilter_button': {
      margin: '10px',
    },
    '.productFilter_attrValueIcon': {
      width: '30px',
      height: '30px',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      marginRight: '10px',
    },
    '.productFilter_expand': {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: '0.3sz',
    },
    '.productFilter_expandOpen': {
      transform: 'rotate(180deg)',
    },
    '.productFilter_headerWrapper': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    '.productFilter_paper': {
      boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.04), 0 0 10px 3px rgba(0, 0, 0, 0.05)',
      backgroundColor: 'transparent',
      borderRadius: '5px',
    },
    '.productFilter_mobileOpenBtn': {
      position: 'fixed',
      top: '100px',
      left: '10px',
      boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.04), 0 0 10px 3px rgba(0, 0, 0, 0.05)',
      backgroundColor: '#fff',
      zIndex: 11,
      color: '#111',
    },
    '.productFilter_drawer': {
      minWidth: '300px',
      backgroundColor: '#fff',
      height: '100vh',
      padding: '10px',
    },
    '.productFilter_mobileCloseBtn': {
      color: '#111',
    },
    '.productFilter_mobileHeader': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: 500,
      paddingLeft: '10px',
      fontSize: '18px',
    },
    '.productFilter_styledScrollBar': {
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
    '.productFilter_categoryBox': {
      display: 'flex',
      flexDirection: 'column',
      padding: '5px 15px',
      alignItems: 'flex-start',
    },
    '.productFilter_category': {
      marginBottom: '10px',
      minHeight: '30px',
    },
  },
};

const iOSBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

export const IOSSliderStyles: any = withStyles((theme: Theme) => ({
  root: {
    color: theme?.palette?.primary?.main ?? '#222',
    height: 2,
    padding: '15px 0',
  },
  thumb: {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    color: '#222',
    boxShadow: iOSBoxShadow,
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
    // marginLeft: '50%'
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
}));
