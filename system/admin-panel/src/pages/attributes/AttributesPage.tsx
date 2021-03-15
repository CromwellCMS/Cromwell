import { TAttribute } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button, GridList, GridListTile } from '@material-ui/core';
import { AddCircleOutline as AddCircleOutlineIcon } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';

import AttributeItem from './AttributeItem';
import styles from './Attributes.module.scss';
import { Skeleton } from '@material-ui/lab';

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

export default function AttributesPage() {
    const attributes = useRef<TAttribute[] | null>(null);
    const graphClient = getGraphQLClient();
    const forceUpdate = useForceUpdate();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getAttributes = async () => {
        try {
            const attrs = await graphClient?.getAttributes();
            if (attrs && Array.isArray(attrs)) attributes.current = attrs;
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getAttributes();
    }, []);

    const handleAddAttribute = () => {
        attributes.current.unshift({
            key: '',
            values: [],
            type: 'radio'
        } as any);
        forceUpdate();
    }

    return (
        <div className={styles.Attributes}>
            <div className={styles.header}>
                <div></div>
                <Button
                    onClick={handleAddAttribute}
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<AddCircleOutlineIcon />}
                >Create attribute</Button>
            </div>
            <GridList
                className={styles.list}
                cellHeight={315}
                spacing={15}
            >
                {attributes.current && attributes.current.map(attribute => (
                    <GridListTile key={attribute.id}>
                        <div className={styles.listItem} >
                            <AttributeItem data={attribute} />
                        </div>
                    </GridListTile>
                ))}
                {isLoading && Array(3).fill(1).map((it, index) => {
                    return (
                        <GridListTile className={styles.listItem} key={index}>
                            <Skeleton key={index} variant="rect" height="315px" width="100%" style={{ margin: '0 10px 20px 10px' }} > </Skeleton>
                        </GridListTile>
                    )
                })}
            </GridList>
        </div>
    )
}
