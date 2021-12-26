import { Chip } from '@mui/material';
import { withStyles } from '@mui/styles';

export const StyledBreadcrumb = withStyles(() => ({
  root: {
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    height: '24px',
    color: '#424242',
    fontWeight: 400,
    '&:hover, &:focus': {
      backgroundColor: '#757575',
      color: '#fff',
    },
    '&:active': {
      boxShadow: ' 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);',
      backgroundColor: '#757575',
      color: '#fff',
    },
  },
}))(Chip) as typeof Chip;