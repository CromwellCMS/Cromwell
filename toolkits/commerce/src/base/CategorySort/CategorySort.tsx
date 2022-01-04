import { getBlockInstance, TProduct } from '@cromwell/core';
import { TCList } from '@cromwell/core-frontend';
import React, { useState } from 'react';

import { moduleState } from '../../helpers/state';
import { BaseSelect, TBaseSelect } from '../shared/Select';
import styles from './CategorySort.module.scss';

export type TSortOption = {
  value: keyof TProduct;
  label: string;
  direction?: 'ASC' | 'DESC'
};

export type CategorySortProps = {
  listId?: string;
  text?: {
    default?: string;
    highestRated?: string;
    mostPopular?: string;
    priceLowest?: string;
    priceHighest?: string;
    sort?: string;
  }
  elements?: {
    Select?: TBaseSelect;
  }
}

export const CategorySort = (props: CategorySortProps) => {
  const [sortTitle, setSortTitle] = useState('Default');
  const { text } = props;
  const { Select = BaseSelect } = props?.elements ?? {};

  const handleKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSortTitle(value);
    setTimeout(() => {
      const { listId = moduleState.categoryListId } = props;
      const option: TSortOption | undefined = sortOptions.find(o => o.value === value);
      if (option && listId) {
        if (!option.value || option.value === 'Default' as any) {
          option.value = 'id';
        }

        const list = getBlockInstance<TCList>(listId)?.getContentInstance();
        if (list) {
          const params = Object.assign({}, list.getPagedParams());
          params.order = option.direction;
          params.orderBy = option.value;
          list.setPagedParams(params);
          list.updateData();
        }
      }
    }, 100);
  }
  const sortOptions: TSortOption[] = [
    {
      label: text?.default ?? 'Default',
      value: 'Default' as any,
    },
    {
      value: 'rating',
      direction: 'DESC',
      label: text?.highestRated ?? 'Highest rated',
    },
    {
      value: 'views',
      direction: 'DESC',
      label: text?.mostPopular ?? 'Most popular',
    },
    {
      value: 'price',
      direction: 'ASC',
      label: text?.priceLowest ?? 'Price - Lowest',
    },
    {
      value: 'price',
      direction: 'DESC',
      label: text?.priceHighest ?? 'Price - Highest',
    },
  ];

  return (
    <Select
      className={styles.CategorySort}
      label={text?.sort ?? 'Sort'}
      options={sortOptions}
      onChange={e => handleKeyChange(e)}
      value={sortTitle}
    />
  )
}