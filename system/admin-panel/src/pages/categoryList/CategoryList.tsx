import { TProductCategory } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { IconButton, Tooltip } from '@material-ui/core';
import {
    UnfoldLess as UnfoldLessIcon, UnfoldMore as UnfoldMoreIcon,
    Add as AddIcon
} from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import ConfirmationModal from '../../components/modal/Confirmation';
import { toast } from '../../components/toast/toast';
import { categoryPageInfo } from '../../constants/PageInfos';
import CategoryItem from './CategoryItem';
import styles from './CategoryList.module.scss';


const CategoryList = () => {
    const client = getGraphQLClient();
    const [rootCategories, setRootCategories] = useState<TProductCategory[] | null>(null);
    const collapsedItemsRef = useRef<Record<string, boolean>>({});
    const deletedItemsRef = useRef<Record<string, boolean>>({});
    const forceUpdate = useForceUpdate();
    const [categoryToDelete, setCategoryToDelete] = useState<TProductCategory | null>(null);
    const history = useHistory();

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

    const handleDeleteBtnClick = (category: TProductCategory) => {
        setCategoryToDelete(category);
    }

    const handleDeleteCategory = async () => {
        if (categoryToDelete) {
            try {
                await client?.deleteProductCategory(categoryToDelete.id)
                toast.success('Category deleted');
            } catch (e) {
                console.error(e);
                toast.success('Failed to delete category');
            }
        }
        setCategoryToDelete(null);
        deletedItemsRef.current[categoryToDelete.id] = true;
        forceUpdate();
    }

    const handleCreate = () => {
        history.push(`${categoryPageInfo.baseRoute}/new`)
    }

    return (
        <div className={styles.CategoryList} >
            <div className={styles.header}>
                <div>
                    <Tooltip title="Expand all">
                        <IconButton
                            className={styles.actionBtn}
                            aria-label="Expand all"
                            onClick={handleExpandAll}
                        >
                            <UnfoldMoreIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Collapse all">
                        <IconButton
                            className={styles.actionBtn}
                            aria-label="Collapse all"
                            onClick={hanleCollapseAll}
                        >
                            <UnfoldLessIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div>
                    <Tooltip title="Create category">
                        <IconButton
                            className={styles.actionBtn}
                            aria-label="Create category"
                            onClick={handleCreate}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className={styles.list}>
                {rootCategories?.map(category => {
                    return (
                        <CategoryItem
                            key={category.id}
                            category={category}
                            collapsedItemsRef={collapsedItemsRef}
                            deletedItemsRef={deletedItemsRef}
                            handleDeleteBtnClick={handleDeleteBtnClick}
                        />
                    )
                })}
            </div>
            <ConfirmationModal
                open={Boolean(categoryToDelete)}
                onClose={() => setCategoryToDelete(null)}
                onConfirm={handleDeleteCategory}
                title={`Delete category ${categoryToDelete?.name ?? ''}?`}
            />
        </div>
    )
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

export default CategoryList;