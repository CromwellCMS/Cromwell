import { TProductCategory } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { IconButton, Tooltip } from '@material-ui/core';
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';

import CategoryItem from './CategoryItem';
import styles from './CategoryList.module.scss';


const CategoryList = () => {
    const client = getGraphQLClient();
    const [rootCategories, setRootCategories] = useState<TProductCategory[] | null>(null);
    const collapsedItemsRef = useRef<Record<string, boolean>>({});
    const forceUpdate = useForceUpdate();

    const getRootCategories = async () => {
        const categories = await client.getRootCategories();
        if (categories && Array.isArray(categories)) {
            setRootCategories(categories);
        }
    }

    useEffect(() => {
        getRootCategories();
    }, []);

    const hanleCollapseAll = () => {
        collapsedItemsRef.current['all'] = false;
        forceUpdate();
    }

    const handleExpandAll = () => {
        collapsedItemsRef.current['all'] = true;
        forceUpdate();
    }

    return (
        <div className={styles.CategoryList} >
            <div className={styles.header}>
                <Tooltip title="Expand all">
                    <IconButton
                        className={styles.actionBtn}
                        aria-label="Expand all"
                        onClick={handleExpandAll}
                    >
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Collapse all">
                    <IconButton
                        className={styles.actionBtn}
                        aria-label="Collapse all"
                        onClick={hanleCollapseAll}
                    >
                        <RemoveIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <div className={styles.list}>
                {rootCategories?.map(category => {
                    return (
                        <CategoryItem
                            key={category.id}
                            category={category}
                            collapsedItemsRef={collapsedItemsRef}
                        />
                    )
                })}
            </div>
        </div>
    )
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

export default CategoryList;