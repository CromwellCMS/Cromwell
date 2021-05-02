import React, { useState, useEffect } from 'react';
import {
    MenuItem,
    FormControl,
    Select,
    TextField as MuiTextField,
    ListItem,
    IconButton,
    InputLabel
} from '@material-ui/core';
import { TProduct, getBlockInstance, TPagedParams } from '@cromwell/core';
import { getGraphQLClient, TCGraphQLClient, TCList } from '@cromwell/core-frontend';

type TSortOption = {
    key?: keyof TProduct;
    title: string;
    direction?: 'ASC' | 'DESC'
};

export const CategorySort = (props: {
    listId: string;
}) => {
    const [sortTitle, setSortTitle] = useState('Default');
    const handleKeyChange = (event: React.ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) => {
        const val = event.target.value as string
        setSortTitle(val);
        setTimeout(() => {
            const listId = props.listId;
            const option: TSortOption | undefined = sortOptions.find(o => o.title === val);
            if (option && listId) {
                const list: TCList | undefined = getBlockInstance(listId)?.getContentInstance() as any;
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
            <InputLabel>Sort</InputLabel>
            <Select
                value={sortTitle}
                onChange={handleKeyChange}
            >
                {sortOptions.map(opt => (
                    <MenuItem value={opt.title} key={opt.title}>{opt.title}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}