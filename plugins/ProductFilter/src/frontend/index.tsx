import { TAttributeValue, TFrontendPluginProps, TProduct } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import {
    Card,
    CardHeader,
    Checkbox,
    Collapse,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, FilterList as FilterListIcon, Close as CloseIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { debounce } from 'debounce';
import React, { Component, useEffect, useRef, useState } from 'react';

import { TFilteredList, TProductFilterSettings } from '../types';
import { Slider } from './components/slider';
import { filterCList, TProductFilterData } from './service';
import { useStyles } from './styles';
import { defaultSettings } from '../constants';

const ProductFilter = (props: TFrontendPluginProps<TProductFilterData, TProductFilterSettings>): JSX.Element => {
    const { attributes, productCategory, filterMeta } = props.data ?? {};
    const [checkedAttrs, setCheckedAttrs] = useState<Record<string, string[]>>({});
    const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>({});
    const [minPrice, setMinPrice] = useState<number>(filterMeta?.minPrice || 0);
    const [maxPrice, setMaxPrice] = useState<number>(filterMeta?.maxPrice || 0);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const priceRange = useRef<number[]>([])
    const classes = useStyles();
    const client = getGraphQLClient();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const _collapsedByDefault = props.settings?.collapsedByDefault ?? defaultSettings.collapsedByDefault
    const _mobileCollapsedByDefault = props.settings?.mobileCollapsedByDefault ?? defaultSettings.mobileCollapsedByDefault;
    const collapsedByDefault = isMobile ? _mobileCollapsedByDefault : _collapsedByDefault;

    const handleSetAttribute = (key: string, checks: string[]) => {
        setCheckedAttrs(prev => {
            const newCheckedAttrs: Record<string, string[]> = JSON.parse(JSON.stringify(prev));
            newCheckedAttrs[key] = checks;
            return newCheckedAttrs;
        })
    }

    const updateFilterMeta = (filteredList: TFilteredList<TProduct> | undefined) => {
        if (filteredList && filteredList.filterMeta) {
            if (filteredList.filterMeta.minPrice !== undefined) setMinPrice(filteredList.filterMeta.minPrice);
            if (filteredList.filterMeta.maxPrice !== undefined) setMaxPrice(filteredList.filterMeta.maxPrice);
        }
    }

    const applyFilter = () => {
        const productListId = props?.settings?.productListId;
        const productCategoryId = productCategory?.id;
        if (productListId && productCategoryId) {
            filterCList(checkedAttrs, priceRange.current, productListId,
                productCategoryId, client, updateFilterMeta)
        }
    }

    useEffect(() => {
        applyFilter();
    }, [checkedAttrs]);

    const onPriceRangeChange = debounce((newValue: number[]) => {
        priceRange.current = newValue;
        applyFilter();
    }, 500);

    const isPriceExpanded = collapsedItems['price'] === undefined ? !collapsedByDefault : collapsedItems['price'];

    const handleMobileOpen = () => {
        setIsMobileOpen(true);
    }
    const handleMobileClose = () => {
        setIsMobileOpen(false);
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
            <Card className={classes.card}>
                <div className={classes.headerWrapper}>
                    <Typography id="price-range-slider" gutterBottom style={{
                        fontSize: '14px',
                        margin: '0 0 0 15px'
                    }}>Price</Typography>
                    <IconButton
                        onClick={() => [
                            setCollapsedItems((prev) => {
                                const copy = Object.assign({}, prev);
                                copy['price'] = !copy['price'];
                                return copy
                            })
                        ]}
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: isPriceExpanded,
                        })}
                        aria-expanded={isPriceExpanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </div>
                <Collapse in={isPriceExpanded} timeout="auto" unmountOnExit>
                    <Slider
                        onChange={onPriceRangeChange}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />
                </Collapse>
            </Card>
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
                    const isExpanded = collapsedItems[attr.key] === undefined ? !collapsedByDefault : collapsedItems[attr.key];
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
                                    onClick={() => [
                                        setCollapsedItems((prev) => {
                                            const copy = Object.assign({}, prev);
                                            copy[attr.key] = !copy[attr.key];
                                            return copy
                                        })
                                    ]}
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
                                <List className={classes.list} dense component="div" role="list">
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
        const mobileIconPosition = props.settings?.mobileIconPosition ?? defaultSettings.mobileIconPosition;

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
        )

    }
    return filterContent;

}

export { getStaticProps } from './service'

export default ProductFilter;
