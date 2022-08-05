import { TProductCategory, TProductCategoryFilter } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Skeleton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import { IEntityListPage } from '../../../components/entity/types';
import { resetSelected, toggleItemSelection } from '../../../redux/helpers';
import styles from '../CategoryList.module.scss';
import CategoryItem from './CategoryItem';


export function TreeView(props: {
  entityListPageRef: React.MutableRefObject<IEntityListPage<TProductCategory, TProductCategoryFilter>>;
  collapsedItemsRef: React.MutableRefObject<Record<string, boolean>>;
  deletedItemsRef: React.MutableRefObject<Record<string, boolean>>;
  updateRoot: any;
}) {
  const client = getGraphQLClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rootCategories, setRootCategories] = useState<TProductCategory[] | null>(null);
  const totalElements = useRef<number | null>(null);

  const handleDeleteCategory = async (category: TProductCategory) => {
    const success = await props.entityListPageRef.current.handleDeleteItem(category);
    if (!success) return;
    props.deletedItemsRef.current[category.id] = true;
    await getRootCategories();
  }

  const getRootCategories = async () => {
    setIsLoading(true);
    try {
      const categories = await client.getRootCategories();
      if (categories?.elements && Array.isArray(categories?.elements)) {
        setRootCategories(categories.elements);
        totalElements.current = categories.pagedMeta?.totalElements;
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  }

  const handleToggleItemSelection = (data: TProductCategory) => {
    toggleItemSelection(data.id);
  }

  useEffect(() => {
    getRootCategories();

    resetSelected();
    return () => {
      resetSelected();
    }
  }, [props.updateRoot]);

  return (
    <div className={styles.treeList}>
      {isLoading && Array(5).fill(1).map((it, index) => {
        return <Skeleton key={index} variant="text" height="20px" style={{ margin: '20px 20px 0 20px' }} />
      })}
      {rootCategories?.map(category => {
        return (
          <CategoryItem
            key={category.id}
            data={category}
            collapsedItemsRef={props.collapsedItemsRef}
            deletedItemsRef={props.deletedItemsRef}
            listItemProps={{
              handleDeleteCategory,
              toggleSelection: handleToggleItemSelection,
              embeddedView: false,
            }}
          />
        )
      })}
    </div>
  )
}
