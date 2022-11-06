import { TPaginationProps } from '@cromwell/core-frontend';
import { Pagination as MUIPagination } from '@mui/material';
import React from 'react';

import styles from './Pagination.module.scss';

const Pagination = (props: TPaginationProps) => {
  return (
    <div className={styles.paginationContainer}>
      <MUIPagination
        count={props.count}
        page={props.page}
        onChange={(event: React.ChangeEvent<unknown>, value: number) => {
          props.onChange(value);
        }}
        className={styles.pagination}
        showFirstButton
        showLastButton
      />
    </div>
  );
};

export default Pagination;
