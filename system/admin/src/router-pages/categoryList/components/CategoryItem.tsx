import { gql } from '@apollo/client';
import { TProductCategory } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  ExpandMore as ExpandMoreIcon,
  SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
} from '@mui/icons-material';
import { Collapse, Grid, Skeleton, Tooltip } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useSelectedItems } from '@store/selectedItems';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { animated, useSpring } from 'react-spring';

import { IconButton } from '../../../components/buttons/IconButton';
import { CheckboxInput } from '../../../components/inputs/CheckboxInput';
import { categoryPageInfo } from '../../../constants/PageInfos';
import { useForceUpdate } from '../../../helpers/forceUpdate';
import commonStyles from '../../../styles/common.module.scss';
import { ListItemProps } from '../CategoryList';
import styles from './CategoryItem.module.scss';

export type TCategoryItemProps = {
  data: TProductCategory;
  collapsedItemsRef?: React.MutableRefObject<Record<string, boolean>>;
  deletedItemsRef?: React.MutableRefObject<Record<string, boolean>>;
  listItemProps: ListItemProps;
};

const CategoryItem = (props: TCategoryItemProps) => {
  const { data: category } = props;
  const client = getGraphQLClient();
  let expanded = !!props.collapsedItemsRef?.current[category.id];

  const { allSelected, selectedItems } = useSelectedItems();
  const [isLoading, setIsLoading] = useState(false);
  const [childCategories, setChildCategories] = useState<TProductCategory[] | null>(null);
  const forceUpdate = useForceUpdate();

  if (props.collapsedItemsRef?.current['all'] === true && !expanded) {
    props.collapsedItemsRef.current[category.id] = true;
    expanded = true;
  }
  if (props.collapsedItemsRef?.current['all'] === false && expanded) {
    props.collapsedItemsRef.current[category.id] = false;
    expanded = false;
  }

  const setExpanded = (val: boolean) => {
    if (!props.collapsedItemsRef?.current) return;
    delete props.collapsedItemsRef.current['all'];
    props.collapsedItemsRef.current[category.id] = !val;
    forceUpdate();
  };

  const handleToggleCollapse = async () => {
    setExpanded(expanded);
  };

  const loadChildren = async () => {
    setIsLoading(true);
    let childrenInfo;
    try {
      childrenInfo = await client.getProductCategoryById(
        category.id,
        gql`
          fragment ChildrenCategoryFragment on ProductCategory {
            children {
              id
              slug
              isEnabled
              name
              mainImage
              children {
                id
                slug
              }
            }
          }
        `,
        'ChildrenCategoryFragment',
      );
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
    setChildCategories(childrenInfo.children ?? []);
  };

  useEffect(() => {
    if (expanded && !childCategories) {
      loadChildren();
    }
  }, [expanded]);

  const handleDelete = () => {
    props.listItemProps.handleDeleteCategory(category);
  };

  const hasChildren = Boolean(category.children && category.children.length > 0);
  let selected = false;
  if (allSelected && !selectedItems[category.id]) selected = true;
  if (!allSelected && selectedItems[category.id]) selected = true;

  if (props.deletedItemsRef?.current[category.id]) {
    return <></>;
  }

  return (
    <div className={`${styles.CategoryItem}`}>
      <Grid container className={styles.header}>
        <Grid item xs={9} className={styles.headerLeft}>
          {hasChildren ? (
            <IconButton onClick={handleToggleCollapse} className={styles.expandBtn}>
              <ExpandMoreIcon
                className={styles.expandMoreIcon}
                style={{ transform: expanded ? 'rotate(180deg)' : '' }}
              />
            </IconButton>
          ) : (
            <div style={{ height: '38px', width: '40px' }}></div>
          )}
          <div className={commonStyles.center}>
            <CheckboxInput checked={selected} onChange={() => props.listItemProps.toggleSelection?.(category)} />
          </div>
          <p className={styles.ellipsis}>{category.name}</p>
        </Grid>
        <Grid item xs={3} className={`${styles.itemActions} `}>
          <Link to={`${categoryPageInfo.baseRoute}/new?parentId=${category?.id}`}>
            <Tooltip title="Add subcategory">
              <IconButton className={styles.itemActionBtn} aria-label="Add subcategory">
                <SubdirectoryArrowRightIcon
                  className="h-4 w-4 text-gray-300"
                  style={{ width: '1.1rem', height: '1.1rem' }}
                />
              </IconButton>
            </Tooltip>
          </Link>
          <Link to={`${categoryPageInfo.baseRoute}/${category?.id}`}>
            <Tooltip title="Edit">
              <IconButton className={styles.actionBtn} aria-label="Edit">
                <PencilIcon className="h-4 text-gray-300 w-4 float-right " />
              </IconButton>
            </Tooltip>
          </Link>
          <Tooltip title="Delete">
            <IconButton className={styles.actionBtn} aria-label="Delete" onClick={handleDelete}>
              <TrashIcon aria-label="delete" className="h-4 text-gray-300 w-4" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      {hasChildren && (
        <div className={styles.subList}>
          {isLoading ? (
            category.children?.map((child) => (
              <Skeleton variant="text" height="30px" style={{ margin: '10px 20px' }} key={child.id} />
            ))
          ) : (
            <TransitionComponent in={expanded}>
              {childCategories?.map((childCat) => {
                return (
                  <CategoryItem
                    key={childCat.id}
                    data={childCat}
                    collapsedItemsRef={props.collapsedItemsRef}
                    deletedItemsRef={props.deletedItemsRef}
                    listItemProps={props.listItemProps}
                  />
                );
              })}
            </TransitionComponent>
          )}
        </div>
      )}
    </div>
  );
};

function TransitionComponent(props: TransitionProps & { children: React.ReactNode }) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

export default CategoryItem;
