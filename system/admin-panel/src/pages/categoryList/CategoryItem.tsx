import { gql } from '@apollo/client';
import { TProductCategory } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Collapse, IconButton, Tooltip } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import {
    Add as AddIcon,
    DeleteForever as DeleteForeverIcon,
    Edit as EditIcon,
    ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring/web.cjs.js';

import styles from './CategoryItem.module.scss';


const CategoryItem = (props: {
    category: TProductCategory;
    collapsedItemsRef: React.MutableRefObject<Record<string, boolean>>;
}) => {
    const { category } = props;
    const client = getGraphQLClient();
    let expanded = !!props.collapsedItemsRef.current[category.id];
    if (props.collapsedItemsRef.current['all'] === true && !expanded) {
        props.collapsedItemsRef.current[category.id] = true;
        expanded = true;
    }
    if (props.collapsedItemsRef.current['all'] === false && expanded) {
        props.collapsedItemsRef.current[category.id] = false;
        expanded = false;
    }

    const [isLoading, setIsLoading] = useState(false);
    const [childCategories, setChildCategories] = useState<TProductCategory[] | null>(null);
    const forceUpdate = useForceUpdate();

    const setExpanded = (val: boolean) => {
        props.collapsedItemsRef.current['all'] = undefined;
        props.collapsedItemsRef.current[category.id] = !val;
        forceUpdate();
    }

    const handleToggleCollapse = async () => {
        setExpanded(expanded);
    }

    const loadChildren = async () => {
        setIsLoading(true);
        let childrenInfo;
        try {
            childrenInfo = await client.getProductCategoryById(category.id, gql`
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
        `, 'ChildrenCategoryFragment');
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
        setChildCategories(childrenInfo.children ?? []);
    }

    useEffect(() => {
        if (expanded && !childCategories) {
            loadChildren();
        }
    }, [expanded]);

    const handleAddSubcategory = () => {

    }

    const handleEdit = () => {

    }

    const handleDelete = () => {

    }

    const hasChildren = Boolean(category.children && category.children.length > 0);

    return (

        <div className={styles.CategoryItem}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    {hasChildren ? (
                        <IconButton onClick={handleToggleCollapse}
                            className={styles.expandBtn}
                        >
                            <ExpandMoreIcon
                                className={styles.expandMoreIcon}
                                style={{ transform: expanded ? 'rotate(180deg)' : '' }}
                            />
                        </IconButton>
                    ) : <div style={{ height: '48px', width: '58px' }}></div>}
                    <p>{category.name}</p>
                </div>
                <div className={styles.itemActions}>
                    <Tooltip title="Add subcategory">
                        <IconButton
                            className={styles.itemActionBtn}
                            aria-label="Add subcategory"
                            onClick={handleAddSubcategory}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton
                            className={styles.actionBtn}
                            aria-label="Edit"
                            onClick={handleEdit}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            className={styles.actionBtn}
                            aria-label="Delete"
                            onClick={handleDelete}
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            {hasChildren && (
                <div className={styles.subList}>
                    {isLoading ? category.children?.map(child => <Skeleton variant="text" height="30px" style={{ margin: '10px 0' }} />)
                        : (
                            <TransitionComponent in={expanded}>
                                {childCategories?.map(childCat => {
                                    return (
                                        <CategoryItem
                                            key={childCat.id}
                                            category={childCat}
                                            collapsedItemsRef={props.collapsedItemsRef}
                                        />
                                    );
                                })}
                            </TransitionComponent>
                        )}
                </div>
            )}
        </div>
    )
}

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

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

export default CategoryItem;