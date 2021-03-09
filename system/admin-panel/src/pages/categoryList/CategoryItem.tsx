import { gql } from '@apollo/client';
import { TProductCategory } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Checkbox, Collapse, Grid, IconButton, Tooltip } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import {
    DeleteForever as DeleteForeverIcon,
    Edit as EditIcon,
    ExpandMore as ExpandMoreIcon,
    SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { Link } from 'react-router-dom';
import { animated, useSpring } from 'react-spring/web.cjs.js';

import { categoryPageInfo } from '../../constants/PageInfos';
import { TAppState } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import styles from './CategoryItem.module.scss';
import { ListItemProps } from './CategoryList';

export type TCategoryItemProps = {
    data: TProductCategory;
    collapsedItemsRef?: React.MutableRefObject<Record<string, boolean>>;
    deletedItemsRef?: React.MutableRefObject<Record<string, boolean>>;
    listItemProps: ListItemProps;
}

const mapStateToProps = (state: TAppState, ownProps: TCategoryItemProps) => {
    return {
        selectedItems: state.selectedItems,
        allSelected: state.allSelected,
    }
}
type TPropsType = PropsType<PropsType, TCategoryItemProps,
    ReturnType<typeof mapStateToProps>>;

const CategoryItem = (props: TPropsType) => {
    const { data: category } = props;
    const displayType = props.listItemProps.displayType;
    const client = getGraphQLClient();
    let expanded = !!props.collapsedItemsRef?.current[category.id];

    if (props.deletedItemsRef?.current[category.id]) {
        return <></>;
    }

    if (props.collapsedItemsRef?.current['all'] === true && !expanded) {
        props.collapsedItemsRef.current[category.id] = true;
        expanded = true;
    }
    if (props.collapsedItemsRef?.current['all'] === false && expanded) {
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


    const handleDelete = () => {
        props.listItemProps.handleDeleteBtnClick(category);
    }

    let hasChildren = Boolean(category.children && category.children.length > 0);
    let selected = false;
    if (props.allSelected && !props.selectedItems[category.id]) selected = true;
    if (!props.allSelected && props.selectedItems[category.id]) selected = true;

    return (

        <div className={`${styles.CategoryItem} ${displayType === 'list' ? styles.listItem : ''}`}>
            <Grid container className={styles.header}>
                <Grid item xs={displayType === 'list' ? 4 : 8} className={styles.headerLeft}>
                    {displayType === 'tree' && (
                        <>
                            {hasChildren ? (
                                <IconButton onClick={handleToggleCollapse}
                                    className={styles.expandBtn}
                                >
                                    <ExpandMoreIcon
                                        className={styles.expandMoreIcon}
                                        style={{ transform: expanded ? 'rotate(180deg)' : '' }}
                                    />
                                </IconButton>
                            ) : <div style={{ height: '48px', width: '48px' }}></div>}
                        </>
                    )}
                    <div className={commonStyles.center}>
                        <Checkbox
                            checked={selected}
                            onChange={() => props.listItemProps.toggleSelection(category)} />
                    </div>
                    <p>{category.name}</p>
                </Grid>
                {displayType === 'list' && (
                    <Grid item xs={4} className={styles.treeInfo}>
                        <>
                            <p>id: <b>{category.id}</b></p>
                            {category.parent?.id ? <p>parent id: <b>{category.parent?.id}</b></p> : <b>root category</b>}
                        </>
                    </Grid>
                )}
                <Grid item xs={4} className={styles.itemActions}>
                    <Link to={`${categoryPageInfo.baseRoute}/new?parentId=${category?.id}`}>
                        <Tooltip title="Add subcategory">
                            <IconButton
                                className={styles.itemActionBtn}
                                aria-label="Add subcategory"
                            >
                                <SubdirectoryArrowRightIcon />
                            </IconButton>
                        </Tooltip>
                    </Link>
                    <Link to={`${categoryPageInfo.baseRoute}/${category?.id}`}>
                        <Tooltip title="Edit">
                            <IconButton
                                className={styles.actionBtn}
                                aria-label="Edit"
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </Link>
                    <Tooltip title="Delete">
                        <IconButton
                            className={styles.actionBtn}
                            aria-label="Delete"
                            onClick={handleDelete}
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            {hasChildren && displayType === 'tree' && (
                <div className={styles.subList}>
                    {isLoading ? category.children?.map(child => <Skeleton variant="text" height="30px" style={{ margin: '10px 0' }} />)
                        : (
                            <TransitionComponent in={expanded}>
                                {childCategories?.map(childCat => {
                                    return (
                                        <ConnectedComponent
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

const ConnectedComponent = connect(mapStateToProps)(CategoryItem);

export default ConnectedComponent;