import { Pagination as MUIPagination, UsePaginationProps } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Pagination.module.scss';
import { TPaginationProps } from '@cromwell/core-frontend';

const Pagination = (props: TPaginationProps) => {
    return (
        <div className={styles.paginationContainer}>
            <MUIPagination
                count={props.count}
                page={props.page}
                onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                    props.onChange(value)
                }}
                className={styles.pagination}
                showFirstButton
                showLastButton
            />
        </div>
    )
}

export default Pagination;