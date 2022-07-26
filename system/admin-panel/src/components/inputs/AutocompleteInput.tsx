import { Autocomplete as MuiAutocomplete, autocompleteClasses, AutocompleteProps, Tooltip } from '@mui/material';
import Popper from '@mui/material/Popper';
import { styled } from '@mui/material/styles';
import React from 'react';

import commonStyles from '../../styles/common.module.scss';
import { TextInputField } from './TextInput';

export function Autocomplete<T>(props: Omit<AutocompleteProps<T, boolean, boolean, boolean>, 'renderInput'> & {
  tooltip?: string;
  label?: string;
  inlineOptions?: boolean;
  paperStyle?: React.CSSProperties;
}): JSX.Element {
  const { tooltip, label, inlineOptions, paperStyle, ...rest } = props;
  return (
    <MuiAutocomplete
      PopperComponent={inlineOptions ? InlinePopperComponent({ paperStyle }) : StyledPopper}
      ListboxProps={{ className: commonStyles.styledScrollBarList }}
      {...rest}
      renderInput={({ size, InputProps, inputProps, ...rest }) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        const content = (
          <div ref={InputProps.ref}>
            <TextInputField
              startAdornment={InputProps.startAdornment}
              endAdornment={InputProps.endAdornment}
              inputFieldClassName={InputProps.className}
              inputElementClassName={inputProps.className}
              {...inputProps}
              {...rest}
              label={label}
            />
          </div>
        );
        if (tooltip) {
          return (<Tooltip title={tooltip}>{content}</Tooltip>)
        }
        return content;
      }}
    />
  )
}

interface PopperComponentProps {
  anchorEl?: any;
  disablePortal?: boolean;
  open: boolean;
}

const InlinePopperComponent = ({ paperStyle }) => (props: PopperComponentProps) => {
  const { disablePortal, anchorEl, open, ...other } = props;
  return <InlinePopper {...other} style={{ ...((other as any)?.style ?? {}), ...(paperStyle ?? {}) }} />;
}

const InlinePopper = styled('div')({
  [`& .${autocompleteClasses.paper}`]: {
    top: '2px',
    position: 'relative',
    boxShadow: 'none',
  },
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.paper}`]: {
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, 0.05), 0 0 20px 4px rgba(0, 0, 0, 0.1)',
    top: '2px',
    position: 'relative',
  },
});