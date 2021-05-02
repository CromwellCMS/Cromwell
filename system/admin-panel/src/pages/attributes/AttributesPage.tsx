import { TAttribute } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button, Grid } from '@material-ui/core';
import { AddCircleOutline as AddCircleOutlineIcon } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';

import { useForceUpdate } from '../../helpers/forceUpdate';
import commonStyles from '../../styles/common.module.scss';
import AttributeItem from './AttributeItem';
import styles from './Attributes.module.scss';


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

    const handleRemove = (attribute: TAttribute) => {
        attributes.current = attributes.current.filter(attr => attr !== attribute);
        forceUpdate();
    }

    return (
        <div className={styles.Attributes}>
            <div className={styles.header}>
                <div>
                    <p className={commonStyles.pageTitle}>attributes</p>
                </div>
                <Button
                    onClick={handleAddAttribute}
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<AddCircleOutlineIcon />}
                >Create attribute</Button>
            </div>
            <Grid
                spacing={3}
                container
                className={styles.list}
            >
                {attributes.current && attributes.current.map((attribute, index) => (
                    <Grid item xs={12} sm={6} key={attribute.id ?? 'temp_' + index}>
                        <div className={styles.listItem} key={attribute.id ?? index} >
                            <AttributeItem data={attribute} handleRemove={handleRemove} />
                        </div>
                    </Grid>
                ))}
                {isLoading && Array(3).fill(1).map((it, index) => {
                    return (
                        <Grid item xs={12} sm={6} key={index}>
                            <Skeleton key={index} className={styles.listItem} variant="rect" height="315px" width="100%" style={{ margin: '0 10px 20px 10px' }} > </Skeleton>
                        </Grid>
                    )
                })}
            </Grid>
        </div>
    )
}
