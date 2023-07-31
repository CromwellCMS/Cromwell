import { IconButton } from '@components/buttons/IconButton';
import { TextInput, TextInputProps } from '@components/inputs/TextInput';
import { ArrowTopRightOnSquareIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Box, Tooltip } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TextFieldWithTooltip(
  props: TextInputProps & {
    tooltipText?: string;
    tooltipLink?: string;
  },
) {
  const navigate = useNavigate();

  const openLink = () => {
    if (props.tooltipLink) {
      if (props.tooltipLink.startsWith('http')) {
        window.open(props.tooltipLink, '_blank');
      } else {
        navigate(props.tooltipLink);
      }
    }
  };

  return (
    <TextInput
      endAdornment={
        (props.tooltipText || props.tooltipLink) && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={props.tooltipText}>
              <IconButton
                disableRipple={!props.tooltipLink}
                sx={{ cursor: props.tooltipLink ? 'pointer' : 'initial' }}
                onClick={openLink}
              >
                {props.tooltipLink ? (
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                ) : (
                  <InformationCircleIcon className="w-4 h-4" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
      {...props}
    />
  );
}
