import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';

import styles from './Sort.module.scss';

export type TSortOption<TEntity> = {
  key: keyof TEntity;
  label: string;
};

export default function Sort<TEntity>(props: {
  options: TSortOption<TEntity>[];
  onChange: (key: keyof TEntity, order: 'ASC' | 'DESC') => any;
}) {
  const [orderByKey, setOrderByKey] = useState<keyof TEntity | null>(null);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');

  const handleChangeOrderByKey = (key: keyof TEntity) => {
    setOrderByKey(key);
    props.onChange(key, order);
  };
  const toggleOrder = () => {
    setOrder((prev) => {
      const newOrder = prev === 'ASC' ? 'DESC' : 'ASC';
      props.onChange(orderByKey, newOrder);
      return newOrder;
    });
  };
  return (
    <FormControl className={styles.wrapper}>
      <InputLabel>Sort</InputLabel>
      <Select
        style={{ minWidth: '60px', maxWidth: '100px' }}
        size="small"
        value={orderByKey ?? 'id'}
        label="Sort"
        onChange={(event) => handleChangeOrderByKey(event.target.value as any)}
        classes={{
          icon: styles.selectIcon,
          select: styles.muiSelect,
        }}
      >
        {props.options.map((sort) => (
          <MenuItem key={sort.key + ''} value={sort.key + ''}>
            {sort.label}
          </MenuItem>
        ))}
      </Select>
      <div onClick={toggleOrder} className={styles.orderButton}>
        <ArrowDropDownIcon
          style={{
            transform: order === 'ASC' ? 'rotate(180deg)' : undefined,
            transition: '0.3s',
          }}
        />
      </div>
    </FormControl>
  );
}
