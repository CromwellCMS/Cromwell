import { createStyles, makeStyles } from '@mui/styles';
import { styled } from '@mui/system';

export const useStyles = makeStyles(() =>
  createStyles({
    subscribeInputContainer: {
      display: 'flex',
    },
    subscribeInput: {
      backgroundColor: '#fff',
      padding: '7px 15px',
      borderRadius: '8px 0 0 8px',
      border: '1px solid #ccc',
      borderRight: '0',

      '&:hover': {
        background: '#eaeef3',
      },
    },
    subscribeBtn: {
      borderRadius: '0 8px 8px 0',
    },
  }),
);

export const StyledInputElement = styled('input')`
  color: #20262d;
  transition: width 300ms ease;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4375em;
  border: none;
  background-color: transparent;

  &:focus {
    outline: none;
  }
`;
