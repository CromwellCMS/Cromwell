import React from 'react';
import { Pagination as MUIPagination } from '@material-ui/lab';
//@ts-ignore
import styles from './Pagination.module.scss';

export const Pagination = (props: {
    count: number;
    page: number;
    onChange: (page: number) => void;
}) => {
    return (
        <MUIPagination count={props.count} page={props.page}
            onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                props.onChange(value)
            }}
            className={styles.pagination}
            showFirstButton showLastButton
        />
    )
}