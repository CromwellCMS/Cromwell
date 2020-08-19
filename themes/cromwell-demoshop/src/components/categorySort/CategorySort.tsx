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

type TSortOption = { key: keyof TProduct; title: string; direction: 'ASC' | 'DESC' };

export const CategorySort = (props: {
    listId: string;
}) => {
    const [sortKey, setSortKey] = useState('');
    const handleKeyChange = (event: React.ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) => {
        setSortKey(event.target.value as string);
    }
    const sortOptions: TSortOption[] = [
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

    useEffect(() => {
        const listId = props.listId;
        const option: TSortOption | undefined = sortOptions.find(o => o.key === sortKey);

        if (option && listId) {
            const param: TPagedParams<TProduct> = {
                orderBy: option.key,
                order: option.direction
            }
            const list: TCList | undefined = getBlockInstance(listId)?.getContentInstance() as any;
            if (list) {
                list.setPagedParams(Object.assign({}, list.getPagedParams(), param));
                list.clearState();
                list.init();
            }

        }

    }, [sortKey])

    return (
        <FormControl variant="filled">
            <InputLabel>Sort</InputLabel>
            <Select
                value={sortKey}
                onChange={handleKeyChange}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {sortOptions.map(opt => (
                    <MenuItem value={opt.title}>{opt.title}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}