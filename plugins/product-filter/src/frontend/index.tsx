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
    Theme,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer,
    TextField,
    Typography,
    useMediaQuery,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import { NextRouter, withRouter } from 'next/router';
import React from 'react';
import { debounce } from 'throttle-debounce';

import { defaultSettings } from '../constants';
import { TInstanceSettings, IFrontendFilter } from '../types';
import { Slider } from './components/slider';
import { filterCList, setListProps, TProductFilterData } from './service';
import { getStyles } from './styles';

const ExpandMoreIcon = iconFromPath(<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>);
const FilterListIcon = iconFromPath(<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path>);
const CloseIcon = iconFromPath(<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>);

type FilterState = {
    collapsedItems: Record<string, boolean>;
    minPrice: number;
    maxPrice: number;
    isMobileOpen: boolean;
}

type FilterProps = WithStyles<ReturnType<typeof getStyles>, true> & {
    router: NextRouter;
    isMobile?: boolean;
} & TFrontendPluginProps<TProductFilterData, TInstanceSettings>;

class ProductFilter extends React.Component<FilterProps, FilterState> implements IFrontendFilter {
    private priceRange: number[] = [];
    private search: string = '';
    private collapsedByDefault = false;
    private checkedAttrs: Record<string, string[]> = {};
    private client = getGraphQLClient();

    constructor(props) {
        super(props);
        const filterMeta = this.props.data?.filterMeta;

        this.state = {
            collapsedItems: {},
            minPrice: filterMeta?.minPrice ?? 0,
            maxPrice: filterMeta?.maxPrice ?? 0,
            isMobileOpen: false,
        }
        this.props?.instanceSettings?.getInstance?.(this);
    }

    componentDidMount() {
        this.props?.instanceSettings?.onMount?.(this);
    }

    private handleSetAttribute = (key: string, checks: string[]) => {
        this.checkedAttrs = JSON.parse(JSON.stringify(this.checkedAttrs));
        this.checkedAttrs[key] = checks;
        this.forceUpdate();
        this.applyFilter();
    }

    public updateFilterMeta = (filteredList: TFilteredProductList | undefined) => {
        if (filteredList && filteredList.filterMeta) {
            if (filteredList.filterMeta.minPrice !== undefined) this.setState({
                minPrice: filteredList.filterMeta.minPrice
            });
            if (filteredList.filterMeta.maxPrice !== undefined) this.setState({
                maxPrice: filteredList.filterMeta.maxPrice
            });
        }
    }

    private getFilterParams = (): TProductFilter => {
        return {
            attributes: Object.keys(this.checkedAttrs).map(key => ({
                key, values: this.checkedAttrs[key]
            })),
            minPrice: this.priceRange[0],
            maxPrice: this.priceRange[1],
            nameSearch: (this.search && this.search !== '') ? this.search : undefined,
        }
    }

    private applyFilter = () => {
        const filterParams = this.getFilterParams();
        const { instanceSettings } = this.props;
        const { productCategory, pluginSettings } = this.props.data ?? {};
        const productListId = instanceSettings?.listId ?? pluginSettings?.listId;

        instanceSettings?.onChange?.(filterParams);

        if (!productListId) {
            // console.error('ProductFilter:applyFilter: !productListId', props?.settings)
            return;
        }
        if (!productCategory?.id) {
            // console.error('ProductFilter:applyFilter: !productCategoryId', productCategory)
            return;
        }

        filterCList(filterParams, productListId, productCategory, this.client, this.updateFilterMeta)
    }

    private onPriceRangeChange = debounce(500, (newValue: number[]) => {
        this.priceRange = newValue;
        this.applyFilter();
    });

    private onSearchChange = debounce(500, (newValue: string) => {
        this.search = newValue;
        this.applyFilter();
    });

    public handleMobileOpen = () => {
        this.setState({ isMobileOpen: true });
    }
    public handleMobileClose = () => {
        this.setState({ isMobileOpen: false });
    }

    private handleCategoryClick = (category: TProductCategory) => () => {
        const skip = this.props?.instanceSettings?.onCategoryClick?.(category);
        if (skip) return;

        if (!category?.slug && !category?.id || !this.props.router) return;
        const url = resolvePageRoute('category', { slug: category.slug ?? category.id });
        this.props.router?.push(url);
    }

    private getFilterItem = (props: {
        title: string;
        key: string;
        content: JSX.Element;
    }) => {
        const { collapsedItems } = this.state;
        const { classes } = this.props;

        if (collapsedItems[props.key] === undefined) {
            collapsedItems[props.key] = this.collapsedByDefault;
        }
        const isExpanded = !collapsedItems[props.key];

        return (
            <Card className={classes.card}>
                <div className={classes.headerWrapper}
                    onClick={() => this.setState(prev => ({
                        collapsedItems: {
                            ...prev.collapsedItems,
                            [props.key]: !prev.collapsedItems[props.key]
                        }
                    }))}
                >
                    <Typography gutterBottom style={{
                        fontSize: '14px',
                        margin: '0 0 0 15px'
                    }}>{props.title}</Typography>
                    <IconButton
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
            </Card >
        )
    }

    render() {
        const { classes, instanceSettings } = this.props;
        const { attributes, productCategory, pluginSettings } = this.props.data ?? {};
        const { isMobileOpen, minPrice, maxPrice, collapsedItems } = this.state;

        const isMobile = !instanceSettings?.disableMobile && this.props.isMobile;
        const pcCollapsedByDefault = pluginSettings?.collapsedByDefault ?? defaultSettings.collapsedByDefault
        const mobileCollapsedByDefault = pluginSettings?.mobileCollapsedByDefault ?? defaultSettings.mobileCollapsedByDefault;
        const _collapsedByDefault = isMobile ? mobileCollapsedByDefault : pcCollapsedByDefault;
        const productListId = instanceSettings?.listId ?? pluginSettings?.listId;

        instanceSettings?.getInstance?.(this);

        if (this.collapsedByDefault !== _collapsedByDefault) {
            this.collapsedByDefault = _collapsedByDefault;
            this.setState({ collapsedItems: {} });
        }

        setListProps(productListId, productCategory, this.client, this.getFilterParams(), this.updateFilterMeta);

        const filterContent = (
            <div>
                {isMobile && (
                    <div className={classes.mobileHeader}>
                        <p>Filter</p>
                        <IconButton
                            className={classes.mobileCloseBtn}
                            onClick={this.handleMobileClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                )}
                {this.getFilterItem({
                    title: 'Search',
                    key: 'search',
                    content: (
                        <TextField
                            style={{
                                padding: '0 15px 15px 15px',
                                width: '100%',
                            }}
                            placeholder="type to search..."
                            onChange={e => this.onSearchChange(e.target.value)}
                        />
                    )
                })}
                {productCategory &&
                    !!(productCategory.parent || productCategory.children?.length) &&
                    this.getFilterItem({
                        title: 'Categories',
                        key: 'categories',
                        content: (
                            <div className={clsx(classes.categoryBox, classes.styledScrollBar, classes.list)}>
                                {productCategory.parent && (
                                    <Chip className={classes.category}
                                        label={productCategory.parent.name}
                                        onClick={this.handleCategoryClick(productCategory.parent)} />
                                )}
                                {productCategory && (
                                    <Chip className={classes.category}
                                        variant="outlined"
                                        disabled
                                        style={{ marginLeft: productCategory.parent ? '15px' : '' }}
                                        label={productCategory.name}
                                        onClick={this.handleCategoryClick(productCategory)} />
                                )}
                                {!!productCategory.children?.length && (
                                    <>
                                        {productCategory.children.map(child => (
                                            <Chip key={child.id}
                                                className={classes.category}
                                                style={{ marginLeft: ((productCategory?.parent ? 15 : 0) + 15) + 'px' }}
                                                label={child.name}
                                                onClick={this.handleCategoryClick(child)} />
                                        ))}
                                    </>
                                )}
                            </div>
                        )
                    })}
                {this.getFilterItem({
                    title: 'Price',
                    key: 'price',
                    content: (
                        <Slider
                            onChange={this.onPriceRangeChange}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                        />
                    )
                })}
                {attributes && (
                    attributes.map(attr => {
                        const checked: string[] | undefined = this.checkedAttrs[attr.key];
                        const numberOfChecked = () => checked ? checked.length : 0;
                        const handleToggleAll = () => {
                            if (attr.values.length !== 0) {
                                if (numberOfChecked() === attr.values.length) {
                                    this.handleSetAttribute(attr.key, [])
                                } else {
                                    this.handleSetAttribute(attr.key, attr.values.map(v => v.value))
                                }
                            }
                        }
                        if (collapsedItems[attr.key] === undefined) {
                            collapsedItems[attr.key] = this.collapsedByDefault;
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
                                        onClick={() => this.setState(prev => ({
                                            collapsedItems: {
                                                ...prev.collapsedItems,
                                                [attr.key]: !prev.collapsedItems[attr.key]
                                            }
                                        }))}
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
                                                        this.handleSetAttribute(attr.key, newChecked);
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
            const mobileIconPosition = pluginSettings?.mobileIconPosition ?? defaultSettings.mobileIconPosition;

            return (
                <div>
                    <IconButton
                        className={classes.mobileOpenBtn}
                        style={{
                            top: mobileIconPosition.top + 'px',
                            left: mobileIconPosition.left + 'px'
                        }}
                        onClick={this.handleMobileOpen}>
                        <FilterListIcon />
                    </IconButton>
                    <SwipeableDrawer
                        open={isMobileOpen}
                        onClose={this.handleMobileClose}
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
}

const withMediaQuery = (queries: Record<string, ((theme: Theme) => string)> = {}) => Component => props => {
    const mediaProps = {}
    Object.keys(queries).forEach(qName => {
        mediaProps[qName] = useMediaQuery(queries[qName], {
            defaultMatches: true,
        })
    })
    return <Component {...mediaProps} {...props} />
}

let hocComp: any = withMediaQuery({
    'isMobile': theme => theme?.breakpoints?.down('xs'),
})(ProductFilter);

hocComp = withStyles(
    getStyles, { withTheme: true }
)(hocComp);

if (withRouter) {
    hocComp = withRouter(hocComp);
}

export default hocComp;

export { getStaticProps } from './service'
