import { TAttributeValue } from '@cromwell/core';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@mui/material';
import React from 'react';

import { IconButton } from '../../../components/buttons/IconButton';
import { getFileManager } from '../../../components/fileManager/helpers';
import { TextInput } from '../../../components/inputs/TextInput/TextInput';

export const ValueItem = (props: {
  value: string;
  values: TAttributeValue[];
  changeValues: (values: TAttributeValue[]) => void;
}) => {
  const { values, changeValues } = props;
  const value = values.find((item) => item.value === props.value);

  const handleChangeIcon = async () => {
    const newIconSrc = await getFileManager()?.getPhoto();
    if (newIconSrc) {
      const newValues = [...(values ?? [])].map((val) => ({ ...val }));
      newValues.forEach((val, index) => {
        if (val === value) newValues[index].icon = newIconSrc;
      });
      changeValues(newValues);
    }
  };

  const handleDeleteValue = () => {
    const newValues = [...(values ?? [])].filter((val) => val.value !== value.value);
    changeValues(newValues);
  };

  const handleValueNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValues = [...(values ?? [])].map((val) => {
      if (val === value)
        return {
          ...val,
          value: event.target.value,
        };
      return val;
    });
    changeValues(newValues);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextInput
        style={{ marginRight: '15px' }}
        defaultValue={props.value}
        onChange={handleValueNameChange}
        baseSize={'small'}
      />
      <Tooltip title="Change icon">
        <IconButton onClick={handleChangeIcon}>
          {value.icon ? (
            <div
              style={{
                width: '20px',
                height: '20px',
                background: `url("${value.icon}") center center no-repeat`,
                backgroundSize: 'contain',
              }}
            ></div>
          ) : (
            <PhotoIcon className="w-4 h-4" />
          )}
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete value">
        <IconButton onClick={handleDeleteValue}>
          <TrashIcon className="w-4 h-4" />
        </IconButton>
      </Tooltip>
    </div>
  );
};
