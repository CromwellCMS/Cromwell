import { TAttributeValue } from '@cromwell/core';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@mui/material';
import { useState } from 'react';
import React from 'react';

import { IconButton } from '../../../components/buttons/IconButton';
import { CheckList } from '../../../components/transferList/CheckList';
import { ValueItem } from './ValueItem';

export const AttributeValues = (props: {
  values: TAttributeValue[];
  changeValues: (values: TAttributeValue[]) => void;
}) => {
  const { values = [], changeValues } = props;
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  const handleAddValue = () => {
    const newValues = [...(values ?? [])];
    newValues.push({ value: '' });
    changeValues(newValues);
  };

  const handleCheckedValuesChange = (newChecked: string[]) => {
    setCheckedValues(newChecked);
  };

  const handleDeleteAttribute = async () => {
    // remove checked values
    const newValues = values.filter((val) => !checkedValues.includes(val.value));
    changeValues(newValues);
    setCheckedValues([]);
  };

  return (
    <CheckList
      title="Values"
      items={values.map((val) => val.value)}
      checked={checkedValues}
      setChecked={handleCheckedValuesChange}
      fullWidthToggle={false}
      actions={
        <div style={{ marginLeft: '30px', display: 'flex' }}>
          <Tooltip title="Add new value">
            <IconButton onClick={handleAddValue}>
              <PlusIcon className="w-5 h-5" />
            </IconButton>
          </Tooltip>
          <Tooltip title={'Remove checked values'}>
            <IconButton onClick={handleDeleteAttribute} disabled={!checkedValues?.length}>
              <TrashIcon className="w-5 h-5" />
            </IconButton>
          </Tooltip>
        </div>
      }
      itemComp={ValueItem}
      itemProps={{
        changeValues,
        values,
      }}
    />
  );
};
