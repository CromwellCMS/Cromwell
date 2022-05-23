import { TAttributeValue } from '@cromwell/core';
import { Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import { IconButton, TextField, Tooltip } from '@mui/material';
import React from 'react';

import { getFileManager } from '../../../components/fileManager/helpers';

export const ValueItem = (props: {
  value: string;
  values: TAttributeValue[];
  changeValues: (values: TAttributeValue[]) => void;
}) => {
  const { values, changeValues } = props;
  const value = values.find(item => item.value === props.value);

  const handleChangeIcon = async () => {
    const newIconSrc = await getFileManager()?.getPhoto();
    if (newIconSrc) {
      const newValues = [...(values ?? [])].map(val => ({ ...val }));
      newValues.forEach((val, index) => {
        if (val === value) newValues[index].icon = newIconSrc;
      })
      changeValues(newValues);
    }
  };

  const handleDeleteValue = () => {
    const newValues = [...(values ?? [])].filter(val => val.value !== value.value);
    changeValues(newValues);
  }

  const handleValueNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValues = [...(values ?? [])].map(val => {
      if (val === value) return {
        ...val,
        value: event.target.value,
      }
      return val;
    });
    changeValues(newValues);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        variant="standard"
        style={{ marginRight: '15px' }}
        defaultValue={props.value}
        onChange={handleValueNameChange}
      />
      <Tooltip title="Change value icon">
        <IconButton onClick={handleChangeIcon}>
          {value.icon ? (
            <div style={{
              width: '30px',
              height: '30px',
              background: `url("${value.icon}") center center no-repeat`,
              backgroundSize: 'contain'
            }}></div>
          ) : (
            <ImageIcon />
          )}
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete value">
        <IconButton onClick={handleDeleteValue}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}