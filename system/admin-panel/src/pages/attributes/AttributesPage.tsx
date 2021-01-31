import { TAttribute } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button } from '@material-ui/core';
import { AddCircleOutline as AddCircleOutlineIcon } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';

import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import { AttributeItem } from './AttributeItem';
import styles from './Attributes.module.scss';

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
                <div className={styles.listItem}>
                    <AttributeItem data={attribute} />
                </div>
            ))}
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
            <LoadingStatus isActive={isLoading} />
        </div>
    )
}
