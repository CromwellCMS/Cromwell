import { TBasePageEntity } from '@cromwell/core';
import { Tooltip } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { IconButton } from '../../../buttons/IconButton';
import { TextButton } from '../../../buttons/TextButton';
import { ClearFilterIcon } from '../../../icons/clearFilter';
import { TBaseEntityFilter, TListItemProps } from '../../types';
import styles from '../EntityTable.module.scss';
import DeleteSelectedButton from './DeleteSelectedButton';

export function PageHeader<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>(
  props: TListItemProps<TEntityType, TFilterType>) {
  const { searchStore, tableProps, handleDeleteSelected, totalElements, clearAllFilters } = props;
  const { filters, sortBy } = searchStore;
  const history = useHistory();

  const handleCreate = () => {
    history.push(`${tableProps.entityBaseRoute}/new`)
  }

  return (
    <div className={styles.pageHeader}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 className={styles.pageTitle}>{tableProps.listLabel}</h1>
        {tableProps.customElements?.getHeaderLeftActions?.(props)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {tableProps.customElements?.getHeaderRightActions?.(props)}
        {!!(filters?.length || sortBy?.column
          || tableProps.isFilterActive?.()) && (
            <Tooltip title="Clear filters">
              <span>
                <IconButton className={clsx(styles.iconButton)}
                  onClick={clearAllFilters}
                ><ClearFilterIcon className="w-5 h-5" />
                </IconButton>
              </span>
            </Tooltip>
          )}
        <DeleteSelectedButton
          style={{ marginRight: '10px' }}
          onClick={handleDeleteSelected}
          totalElements={totalElements}
        />
        {tableProps.entityBaseRoute && !tableProps.hideAddNew && (
          <TextButton
            onClick={handleCreate}
          >Add new</TextButton>
        )}
      </div>
    </div>
  )
}