import {
    resolvePageRoute,
    TAttributeValue,
    TFilteredProductList,
    TFrontendPluginProps,
    TProductCategory,
    TProductFilter,
} from '@cromwell/core';
import { getGraphQLClient, iconFromPath } from '@cromwell/core-frontend';
import {
    Card,
    CardHeader,
    Checkbox,
    Chip,
    Collapse,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import clsx from 'clsx';
import * as nextRouter from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'throttle-debounce';

import { defaultSettings } from '../constants';
import { TInstanceSettings, TProductFilterSettings } from '../types';
import { Slider } from './components/slider';
import { filterCList, TProductFilterData } from './service';
import { useStyles } from './styles';

const ExpandMoreIcon = iconFromPath(<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>);
const FilterListIcon = iconFromPath(<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path>);
const CloseIcon = iconFromPath(<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>);

const ProductFilter = (props: TFrontendPluginProps<TProductFilterData, TProductFilterSettings, TInstanceSettings>): JSX.Element => {
    const { attributes, productCategory, filterMeta } = props.data ?? {};
    const [checkedAttrs, setCheckedAttrs] = useState<Record<string, string[]>>({});
    const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>({});
    const [minPrice, setMinPrice] = useState<number>(filterMeta?.minPrice || 0);
    const [maxPrice, setMaxPrice] = useState<number>(filterMeta?.maxPrice || 0);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const priceRange = useRef<number[]>([]);
    const search = useRef<string>('');
    const collapsedByDefault = useRef<boolean>(false);
    const classes = useStyles();
    const client = getGraphQLClient();
    const theme = useTheme();
    const isMobile = !props.instanceSettings?.disableMobile && useMediaQuery(theme.breakpoints.down('xs'));
    const pcCollapsedByDefault = props.globalSettings?.collapsedByDefault ?? defaultSettings.collapsedByDefault
    const mobileCollapsedByDefault = props.globalSettings?.mobileCollapsedByDefault ?? defaultSettings.mobileCollapsedByDefault;
    const _collapsedByDefault = isMobile ? mobileCollapsedByDefault : pcCollapsedByDefault;
    const router = nextRouter?.useRouter?.();

    if (collapsedByDefault.current !== _collapsedByDefault) {
        collapsedByDefault.current = _collapsedByDefault;
        setCollapsedItems({});
    }

    const handleSetAttribute = (key: string, checks: string[]) => {
        setCheckedAttrs(prev => {
            const newCheckedAttrs: Record<string, string[]> = JSON.parse(JSON.stringify(prev));
            newCheckedAttrs[key] = checks;
            return newCheckedAttrs;
        })
    }

    const updateFilterMeta = (filteredList: TFilteredProductList | undefined) => {
        if (filteredList && filteredList.filterMeta) {
            if (filteredList.filterMeta.minPrice !== undefined) setMinPrice(filteredList.filterMeta.minPrice);
            if (filteredList.filterMeta.maxPrice !== undefined) setMaxPrice(filteredList.filterMeta.maxPrice);
        }
    }

    const applyFilter = () => {
        const productListId = props.instanceSettings?.listId ?? props?.globalSettings?.listId;
        const productCategoryId = productCategory?.id;
        const nameSearch = search.current;

        const filterParams: TProductFilter = {
            attributes: Object.keys(checkedAttrs).map(key => ({
                key, values: checkedAttrs[key]
            })),
            minPrice: priceRange.current[0],
            maxPrice: priceRange.current[1],
            nameSearch: (nameSearch && nameSearch !== '') ? nameSearch : undefined,
        }

        props.instanceSettings?.onChange?.(filterParams);

        if (!productListId) {
            // console.error('ProductFilter:applyFilter: !productListId', props?.settings)
            return;
        }
        if (!productCategoryId) {
            // console.error('ProductFilter:applyFilter: !productCategoryId', productCategory)
            return;
        }

        filterCList(filterParams, productListId, productCategoryId, client, updateFilterMeta)
    }

    useEffect(() => {
        applyFilter();
    }, [checkedAttrs]);

    const onPriceRangeChange = debounce(500, (newValue: number[]) => {
        priceRange.current = newValue;
        applyFilter();
    });
    const onSearchChange = debounce(500, (newValue: string) => {
        search.current = newValue;
        applyFilter();
    });

    const handleMobileOpen = () => {
        setIsMobileOpen(true);
    }
    const handleMobileClose = () => {
        setIsMobileOpen(false);
    }

    const handleCategoryClick = (category: TProductCategory) => () => {
        const skip = props?.instanceSettings?.onCategoryClick?.(category);
        if (skip) return;

        if (!category?.slug && !category?.id || !router) return;
        const url = resolvePageRoute('category', { slug: category.slug ?? category.id });
        router?.push(url);
    }

    const getFilterItem = (props: {
        title: string;
        key: string;
        content: JSX.Element;
    }) => {
        if (collapsedItems[props.key] === undefined) {
            collapsedItems[props.key] = collapsedByDefault.current;
        }
        const isExpanded = !collapsedItems[props.key];
        return (
            <Card className={classes.card}>
                <div className={classes.headerWrapper}>
                    <Typography gutterBottom style={{
                        fontSize: '14px',
                        margin: '0 0 0 15px'
                    }}>{props.title}</Typography>
                    <IconButton
                        onClick={() => setCollapsedItems((prev) => {
                            const copy = Object.assign({}, prev);
                            copy[props.key] = !copy[props.key];
                            return copy
                        })}
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: isExpanded,
                        })}
                        aria-expanded={isExpanded}
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </div>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    {props.content}
                </Collapse>
            </Card>
        )
    }

    const filterContent = (
        <div>
            {isMobile && (
                <div className={classes.mobileHeader}>
                    <p>Filter</p>
                    <IconButton
                        className={classes.mobileCloseBtn}
                        onClick={handleMobileClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
            )}
            {getFilterItem({
                title: 'Search',
                key: 'search',
                content: (
                    <TextField
                        style={{
                            padding: '0 15px 15px 15px',
                            width: '100%',
                        }}
                        placeholder="type to search..."
                        onChange={e => onSearchChange(e.target.value)}
                    />
                )
            })}
            {props.data?.productCategory &&
                !!(props.data.productCategory.parent || props.data.productCategory.children?.length) &&
                getFilterItem({
                    title: 'Categories',
                    key: 'categories',
                    content: (
                        <div className={clsx(classes.categoryBox, classes.styledScrollBar, classes.list)}>
                            {props.data.productCategory.parent && (
                                <Chip className={classes.category}
                                    label={props.data.productCategory.parent.name}
                                    onClick={handleCategoryClick(props.data.productCategory.parent)} />
                            )}
                            {props.data.productCategory && (
                                <Chip className={classes.category}
                                    variant="outlined"
                                    disabled
                                    style={{ marginLeft: props.data.productCategory.parent ? '15px' : '' }}
                                    label={props.data.productCategory.name}
                                    onClick={handleCategoryClick(props.data.productCategory)} />
                            )}
                            {!!props.data.productCategory.children?.length && (
                                <>
                                    {props.data.productCategory.children.map(child => (
                                        <Chip key={child.id}
                                            className={classes.category}
                                            style={{ marginLeft: ((props?.data?.productCategory?.parent ? 15 : 0) + 15) + 'px' }}
                                            label={child.name}
                                            onClick={handleCategoryClick(child)} />
                                    ))}
                                </>
                            )}
                        </div>
                    )
                })}
            {getFilterItem({
                title: 'Price',
                key: 'price',
                content: (
                    <Slider
                        onChange={onPriceRangeChange}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />
                )
            })}
            {attributes && (
                attributes.map(attr => {
                    const checked: string[] | undefined = checkedAttrs[attr.key];
                    const numberOfChecked = () => checked ? checked.length : 0;
                    const handleToggleAll = () => {
                        if (attr.values.length !== 0) {
                            if (numberOfChecked() === attr.values.length) {
                                handleSetAttribute(attr.key, [])
                            } else {
                                handleSetAttribute(attr.key, attr.values.map(v => v.value))
                            }
                        }
                    }
                    if (collapsedItems[attr.key] === undefined) {
                        collapsedItems[attr.key] = collapsedByDefault.current;
                    }
                    const isExpanded = !collapsedItems[attr.key];
                    return (
                        <Card className={classes.card} key={attr.key}>
                            <div className={classes.headerWrapper}>
                                <CardHeader
                                    className={classes.cardHeader}
                                    avatar={
                                        <Checkbox
                                            color="primary"
                                            onClick={handleToggleAll}
                                            checked={numberOfChecked() === attr.values.length && attr.values.length !== 0}
                                            indeterminate={numberOfChecked() !== attr.values.length && numberOfChecked() !== 0}
                                            disabled={attr.values.length === 0}
                                            inputProps={{ 'aria-label': 'all items selected' }}
                                        />
                                    }
                                    title={attr.key}
                                    subheader={`${numberOfChecked()}/${attr.values.length} selected`}
                                />
                                <IconButton
                                    onClick={() => setCollapsedItems((prev) => {
                                        const copy = Object.assign({}, prev);
                                        copy[attr.key] = !copy[attr.key];
                                        return copy
                                    })}
                                    className={clsx(classes.expand, {
                                        [classes.expandOpen]: isExpanded,
                                    })}
                                    aria-expanded={isExpanded}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                            </div>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Divider />
                                <List className={clsx(classes.list, classes.styledScrollBar)} dense component="div" role="list">
                                    {attr.values.map((attrValue: TAttributeValue) => {
                                        const value = attrValue.value
                                        const labelId = `attribute-list-${attr.key}-${value}-label`;
                                        return (
                                            <ListItem key={value} role="listitem" button
                                                onClick={() => {
                                                    const newChecked = checked ? [...checked] : [];
                                                    const currentIndex = newChecked.indexOf(value);
                                                    if (currentIndex === -1) {
                                                        newChecked.push(value);
                                                    } else {
                                                        newChecked.splice(currentIndex, 1);
                                                    }
                                                    handleSetAttribute(attr.key, newChecked);
                                                }}>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        color="primary"
                                                        checked={checked ? checked.indexOf(value) !== -1 : false}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </ListItemIcon>
                                                {attrValue.icon && (
                                                    <div
                                                        style={{ backgroundImage: `url(${attrValue.icon}` }}
                                                        className={classes.attrValueIcon}></div>
                                                )}
                                                <ListItemText id={labelId} primary={value} />
                                            </ListItem>
                                        );
                                    })}
                                    <ListItem />
                                </List>
                            </Collapse>
                        </Card>
                    )
                })
            )}
        </div>
    );

    if (isMobile) {
        const onOpen = () => {

        }
        const mobileIconPosition = props.globalSettings?.mobileIconPosition ?? defaultSettings.mobileIconPosition;

        return (
            <div>
                <IconButton
                    className={classes.mobileOpenBtn}
                    style={{
                        top: mobileIconPosition.top + 'px',
                        left: mobileIconPosition.left + 'px'
                    }}
                    onClick={handleMobileOpen}>
                    <FilterListIcon />
                </IconButton>
                <SwipeableDrawer
                    open={isMobileOpen}
                    onClose={handleMobileClose}
                    onOpen={onOpen}
                >
                    <div className={classes.drawer}>
                        {filterContent}
                    </div>
                </SwipeableDrawer>
            </div>
        );
    }

    return filterContent;

}

export { getStaticProps } from './service'

export default ProductFilter;
