import { TCustomEntityColumn } from '@cromwell/core';
import React, { useState } from 'react';

import commonStyles from '../../../../styles/common.module.scss';
import { SwitchInput } from '../../../inputs/SwitchInput';
import { TSavedConfiguredColumn } from '../EntityTable';
import styles from '../EntityTable.module.scss';

export type TColumnConfigureItemData = {
  id: string;
  column: TCustomEntityColumn;
  sortedColumns: Record<string, TSavedConfiguredColumn>;
}

export const ColumnConfigureItem = (props: {
  data: TColumnConfigureItemData;
}) => {
  const data = props.data;
  const [visible, setVisible] = useState(data.sortedColumns[data.column.name]?.visible ?? data.column.visible);
  const toggleVisibility = () => {
    setVisible(!visible);
    if (!data.sortedColumns[data.column.name]) data.sortedColumns[data.column.name] = {
      name: data.column.name,
    };
    data.sortedColumns[data.column.name].visible = !visible;
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      width: '100%', minWidth: '20px'
    }}>
      <p className={styles.ellipsis} style={{ minWidth: '20px' }}>{props.data.column.label}</p>
      <div className={commonStyles.center}>
        <SwitchInput
          value={visible}
          onChange={toggleVisibility}
        />
      </div>
    </div>
  )
}