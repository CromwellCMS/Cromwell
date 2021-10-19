import { getBlockInstance, TProduct } from '@cromwell/core';
import { TCList } from '@cromwell/core-frontend';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';

type TSortOption = {
    key?: keyof TProduct;
    title: string;
    direction?: 'ASC' | 'DESC'
};

export const CategorySort = (props: {
    listId: string;
}) => {
    const [sortTitle, setSortTitle] = useState('Default');
    const handleKeyChange = (event: SelectChangeEvent<unknown>) => {
        const val = event.target.value as string;
        setSortTitle(val);
        setTimeout(() => {
            const listId = props.listId;
            const option: TSortOption | undefined = sortOptions.find(o => o.title === val);
            if (option && listId) {
                const list = getBlockInstance<TCList>(listId)?.getContentInstance();
                if (list) {
                    const params = Object.assign({}, list.getPagedParams());
                    params.order = option.direction;
                    params.orderBy = option.key;
                    list.setPagedParams(params);
                    list.clearState();
                    list.init();
                }
            }
        }, 100);
    }
    const sortOptions: TSortOption[] = [
        {
            title: 'Default'
        },
        {
            key: 'rating',
            direction: 'DESC',
            title: 'Highest rated'
        },
        {
            key: 'views',
            direction: 'DESC',
            title: 'Most popular'
        },
        {
            key: 'price',
            direction: 'ASC',
            title: 'Price - Lowest'
        },
        {
            key: 'price',
            direction: 'DESC',
            title: 'Price - Highest'
        },
    ];

    return (
        <FormControl variant="filled">
            <InputLabel style={{ color: '#111' }}>Sort</InputLabel>
            <Select
                value={sortTitle}
                variant="standard"
                onChange={handleKeyChange}
            >
                {sortOptions.map(opt => (
                    <MenuItem value={opt.title} key={opt.title}>{opt.title}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}