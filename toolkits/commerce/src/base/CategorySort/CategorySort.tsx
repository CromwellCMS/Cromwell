import { getBlockInstance, TProduct } from '@cromwell/core';
import { TCList } from '@cromwell/core-frontend';
import React, { useState } from 'react';

import { useModuleState } from '../../helpers/state';
import { BaseSelect, TBaseSelect } from '../shared/Select';
import styles from './CategorySort.module.scss';

export type TSortOption = {
  key: keyof TProduct;
  label: string;
  direction?: 'ASC' | 'DESC'
};

export type CategorySortProps = {
  classes?: Partial<Record<'root' | 'list', string>>;
  elements?: {
    Select?: TBaseSelect;
  }
  text?: {
    default?: string;
    highestRated?: string;
    mostPopular?: string;
    priceLowest?: string;
    priceHighest?: string;
    sort?: string;
  }

  /**
   * Provide another target CList id. Usually it is not needed, since this
   * component can "detect" id of `CategoryList` on the same page. 
   */
  listId?: string;

  /**
   * Override sort options
   */
  overrideOptions?: TSortOption[]
}

/**
 * A component for picking sorting of products in `CategoryList`. 
 */
export const CategorySort = (props: CategorySortProps) => {
  const { text, overrideOptions } = props;
  const { Select = BaseSelect } = props?.elements ?? {};

  const sortOptions: TSortOption[] = overrideOptions ?? [
    {
      label: text?.default ?? 'Default',
      key: 'id',
    },
    {
      key: 'rating',
      direction: 'DESC',
      label: text?.highestRated ?? 'Highest rated',
    },
    {
      key: 'views',
      direction: 'DESC',
      label: text?.mostPopular ?? 'Most popular',
    },
    {
      key: 'price',
      direction: 'ASC',
      label: text?.priceLowest ?? 'Price - Lowest',
    },
    {
      key: 'price',
      direction: 'DESC',
      label: text?.priceHighest ?? 'Price - Highest',
    },
  ];

  const [sortValue, setSortValue] = useState<string>(text?.default ?? 'Default');
  const moduleState = useModuleState();
  const { listId = moduleState.categoryListId } = props;

  const handleValueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSortValue(value);
    setTimeout(() => {
      const option: TSortOption | undefined = sortOptions.find(opt => (opt.label || opt.key) === value);
      if (option && listId) {
        const list = getBlockInstance<TCList>(listId)?.getContentInstance();
        if (list) {
          const params = Object.assign({}, list.getPagedParams());
          params.order = option.direction;
          params.orderBy = option.key || 'id';
          list.setPagedParams(params);
          list.updateData();
        }
      }
    }, 100);
  }

  return (
    <Select
      className={styles.CategorySort}
      label={text?.sort ?? 'Sort'}
      options={sortOptions.map(opt => ({
        value: opt.label || opt.key,
        label: opt.label,
      }))}
      onChange={e => handleValueChange(e)}
      value={sortValue}
    />
  )
}