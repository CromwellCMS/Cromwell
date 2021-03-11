import { TAttribute } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button } from '@material-ui/core';
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
        attributes.current.push({
            key: '',
            values: [],
            type: 'radio'
        } as any);
        forceUpdate();
    }

    return (
        <div className={styles.Attributes}>
            {attributes.current && attributes.current.map(attribute => (
                <div className={styles.listItem} key={attribute.id}>
                    <AttributeItem data={attribute} />
                </div>
            ))}
            {isLoading && Array(3).fill(1).map((it, index) => {
                return (
                    <Skeleton key={index} variant="rect" height="315px" width="100%" style={{ margin: '0 10px 20px 10px' }} > </Skeleton>
                )
            })}
            {!isLoading && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '15px' }}>
                    <Button
                        onClick={handleAddAttribute}
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<AddCircleOutlineIcon />}
                    >Add attribute</Button>
                </div>
            )}
        </div>
    )
}
