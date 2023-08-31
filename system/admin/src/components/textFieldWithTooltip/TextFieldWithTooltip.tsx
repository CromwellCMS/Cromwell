import { IconButton } from '@components/buttons/IconButton';
import { TextInput, TextInputProps } from '@components/inputs/TextInput';
import { ArrowTopRightOnSquareIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Box, Tooltip } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TextFieldWithTooltip({
  tooltipLink,
  tooltipText,
  ...props
}: TextInputProps & {
  tooltipText?: string;
  tooltipLink?: string;
}) {
  const navigate = useNavigate();

  const openLink = () => {
    if (tooltipLink) {
      if (tooltipLink.startsWith('http')) {
        window.open(tooltipLink, '_blank');
      } else {
        navigate(tooltipLink);
      }
    }
  };

  return (
    <TextInput
      endAdornment={
        (tooltipText || tooltipLink) && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={tooltipText}>
              <IconButton
                disableRipple={!tooltipLink}
                sx={{ cursor: tooltipLink ? 'pointer' : 'initial' }}
                onClick={openLink}
              >
                {tooltipLink ? (
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
