import {
  getBlockInstance,
  getRandStr,
  resolvePageRoute,
  TAttributeValue,
  TFilteredProductList,
  TFrontendPluginProps,
  TProduct,
  TProductCategory,
  TProductFilter,
  TProductFilterMeta,
} from '@cromwell/core';
import { iconFromPath, LoadBox, TCList } from '@cromwell/core-frontend';
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
} from '@mui/material';
import { withStyles } from '@mui/styles';
import clsx from 'clsx';
import { NextRouter } from 'next/router';
import React from 'react';
import { debounce } from 'throttle-debounce';

import { defaultSettings } from '../../constants';
import { IFrontendFilter, TInitialFilterData, TInstanceSettings, TPluginProductFilterData } from '../../types';
import { styles } from '../styles';
import { getAttributes, getCategoryBySlug, getFilteredProducts } from '../utils/queries';
import { Slider } from './Slider';

const ExpandMoreIcon = iconFromPath(<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>);
const FilterListIcon = iconFromPath(<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path>);
const CloseIcon = iconFromPath(
  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>,
);

type FilterState = {
  collapsedItems: Record<string, boolean>;
  minPrice: number;
  maxPrice: number;
  isMobileOpen: boolean;
  isLoading?: boolean;
};

type FilterProps = {
  router?: NextRouter;
  isMobile?: boolean;
} & TFrontendPluginProps<TPluginProductFilterData, TInstanceSettings>;

export class ProductFilter extends React.Component<FilterProps, FilterState> implements IFrontendFilter {
  private priceRange: (number | undefined)[] = [];
  private search: string = '';
  private collapsedByDefault = false;
  private checkedAttrs: Record<string, string[]> = {};
  private initialData?: TInitialFilterData;
  /** Cached fetched categories { [slug]: category } */
  private cachedCategories: Record<string, TProductCategory | Promise<TProductCategory | undefined>> = {};
  private isFilterApplied: boolean = false;
  private lastPageSlug: string | null = null;
  private lastAppliedFilterStr: string | null = null;
  private instanceId = getRandStr(12);
  private fullInstanceId = `@cromwell/plugin-product-filter__${this.instanceId}`;
  private searchInputId = `${this.instanceId}_search`;

  constructor(props) {
    super(props);
    this.state = {
      collapsedItems: {},
      minPrice: 0,
      maxPrice: 0,
      isMobileOpen: false,
      isLoading: false,
    };
    this.props?.instanceSettings?.getInstance?.(this);

    this.props.router?.events?.on('routeChangeComplete', this.routeChangeComplete);
  }

  componentDidMount() {
    this.props?.instanceSettings?.onMount?.(this);
    this.init();
  }

  componentWillUnmount() {
    this.isFilterApplied = false;
    this.props.router?.events?.off('routeChangeComplete', this.routeChangeComplete);

    const { list } = this.getCList();
    if (list) {
      list.unregisterLoaderGetter(this.fullInstanceId);
    }
  }

  private routeChangeComplete = () => {
    const slug: string = this.getCurrentCategorySlug();
    if (slug && this.lastPageSlug !== slug) {
      this.lastPageSlug = slug;
      this.init();
    }
  };

  private async init() {
    this.isFilterApplied = false;
    this.checkedAttrs = {};
    this.priceRange = [];
    this.search = '';
    this.lastAppliedFilterStr = null;

    this.setState({ isLoading: true });
    const slug: string = this.getCurrentCategorySlug();

    this.cachedCategories[slug] = new Promise<TProductCategory | undefined>((resolve) => {
      (async () => {
        try {
          this.initialData = await this.getInitialData(slug);
        } catch (error) {
          console.error(error);
        }
        resolve(this.initialData?.productCategory);
      })();
    });

    const result = await this.cachedCategories[slug];
    if (result) {
      this.cachedCategories[slug] = result;
    } else {
      delete this.cachedCategories[slug];
    }

    const filterMeta = this.initialData?.filterMeta;

    this.setState({
      minPrice: filterMeta?.minPrice ?? 0,
      maxPrice: filterMeta?.maxPrice ?? 0,
      isLoading: false,
    });
  }

  private cacheKey = `@cromwell/plugin-product-filter__initialDataStore`;

  private getInitialDataCachedStore(): Record<string, TInitialFilterData> {
    const str = window.sessionStorage.getItem(this.cacheKey);
    if (str) {
      try {
        const data = JSON.parse(str) as Record<string, TInitialFilterData>;
        return data;
      } catch (error) {
        //
      }
    }
    return {};
  }

  private saveInitialDataIntoCache(data: TInitialFilterData, slug: string) {
    if (!slug) return;
    const store = this.getInitialDataCachedStore();
    store[slug] = data;
    window.sessionStorage.setItem(this.cacheKey, JSON.stringify(store));
  }

  private getInitialDataCached(slug: string): TInitialFilterData | undefined {
    const data = this.getInitialDataCachedStore();
    if (data?.[slug]) {
      return data?.[slug];
    }
  }

  private async getInitialData(slug?: string): Promise<TInitialFilterData> {
    // const timestamp = Date.now();

    if (this.props.instanceSettings?.cacheSessionData && slug) {
      const cached = this.getInitialDataCached(slug);
      if (cached) {
        return cached;
      }
    }

    const [{ productCategory, filterMeta }, attributes] = await Promise.all([
      getCategoryBySlug(slug).then(async (productCategory) => {
        let filterMeta: TProductFilterMeta | undefined;

        if (productCategory?.id) {
          const result = await getFilteredProducts({
            // Just to get filterMeta to show min/max price on the filter, products are not needed
            pagedParams: { pageSize: 1 },
            categoryId: productCategory.id,
          });
          filterMeta = result?.filterMeta;
        }

        return { productCategory, filterMeta };
      }),
      getAttributes(),
    ]);

    // const timestamp2 = Date.now();
    // console.log('ProductFilter::getStaticProps time elapsed: ' + (timestamp2 - timestamp) + 'ms');
    const data: TInitialFilterData = {
      productCategory,
      attributes,
      filterMeta,
    };

    if (this.props.instanceSettings?.cacheSessionData && slug) {
      this.saveInitialDataIntoCache(data, slug);
    }

    return data;
  }

  public getProductListId() {
    const { instanceSettings } = this.props;
    const { pluginSettings } = this.props.data ?? {};
    const productListId = instanceSettings?.listId ?? pluginSettings?.listId;
    return productListId;
  }

  public getCurrentCategorySlug() {
    const slug: string = this.props.router?.query?.slug || (this.props.data?.slug as any);
    return slug;
  }

  public async getCurrentCategory() {
    const slug: string = this.getCurrentCategorySlug();

    if (this.cachedCategories[slug]) return this.cachedCategories[slug];

    if (slug === this.props.router?.query?.slug) {
      // category may not load yet. await and check promise
      await new Promise((res) => setTimeout(res, 100));
      return await this.cachedCategories[slug];
    }
  }

  private handleSetAttribute = (key: string, checks: string[]) => {
    this.checkedAttrs = JSON.parse(JSON.stringify(this.checkedAttrs));
    this.checkedAttrs[key] = checks;
    this.forceUpdate();
    this.applyFilter();
  };

  public setFilterMeta = (filterMeta: TProductFilterMeta | undefined) => {
    if (filterMeta?.minPrice !== undefined && filterMeta?.minPrice !== null)
      this.setState({
        minPrice: filterMeta.minPrice,
      });
    if (filterMeta?.maxPrice)
      this.setState({
        maxPrice: filterMeta.maxPrice,
      });
  };

  public getFilterParams = (): TProductFilter => {
    const filter: TProductFilter = {
      attributes: Object.keys(this.checkedAttrs)
        .map((key) => ({
          key,
          values: this.checkedAttrs[key],
        }))
        .filter((attr) => attr.key && attr.values?.length),
      minPrice: this.priceRange[0],
      maxPrice: this.priceRange[1],
      nameSearch: this.search,
    };

    if (!filter.attributes?.length) {
      delete filter.attributes;
    }

    if (typeof filter.minPrice !== 'number') {
      delete filter.minPrice;
    }
    if (typeof filter.maxPrice !== 'number') {
      delete filter.maxPrice;
    }
    if (!filter.nameSearch) {
      delete filter.nameSearch;
    }

    return filter;
  };

  private applyFilter = () => {
    const filterParams = this.getFilterParams();
    const { instanceSettings } = this.props;

    if (Object.keys(filterParams).length === 0) {
      this.isFilterApplied = false;
    } else {
      this.isFilterApplied = true;
    }

    const filterParamsStr = JSON.stringify(filterParams);

    if (this.lastAppliedFilterStr !== filterParamsStr) {
      this.lastAppliedFilterStr = filterParamsStr;
      instanceSettings?.onChange?.(filterParams);

      this.applyFilterCList();

      if (!this.isFilterApplied) {
        // Set default meta
        const filterMeta = this.initialData?.filterMeta;
        this.setState({
          minPrice: filterMeta?.minPrice ?? 0,
          maxPrice: filterMeta?.maxPrice ?? 0,
        });
      }
    }
  };

  private getCList() {
    const listId = this.getProductListId();
    if (!listId) return {};

    const list: TCList<TProduct> | undefined = getBlockInstance<TCList>(listId)?.getContentInstance();
    return { list, listId };
  }

  private applyFilterCList() {
    const { list } = this.getCList();
    if (!list) return;

    this.registerFilterLoader();
    list.updateData();
  }

  private registerFilterLoader = () => {
    const { list } = this.getCList();
    if (!list) return;

    list.registerLoaderGetter(this.fullInstanceId, () => {
      if (!this.isFilterApplied) return;
      return {
        priority: 2,
        loader: async ({ pagedParams }): Promise<TFilteredProductList | undefined> => {
          // const timestamp = Date.now();
          const productCategory = await this.getCurrentCategory();
          const filterParams = this.getFilterParams();

          const filtered = await getFilteredProducts({
            pagedParams,
            filterParams,
            categoryId: productCategory?.id,
          });

          this.setFilterMeta(filtered?.filterMeta);
          // const timestamp2 = Date.now();
          // console.log('ProductFilterResolver::getFilteredProducts time elapsed: ' + (timestamp2 - timestamp) + 'ms');
          return filtered;
        },
      };
    });
  };

  private onPriceRangeChange = debounce(500, (newValue: number[]) => {
    this.priceRange = [...newValue];

    if (this.priceRange[0] === this.state.minPrice) {
      this.priceRange[0] = undefined;
    }
    if (this.priceRange[1] === this.state.maxPrice) {
      this.priceRange[1] = undefined;
    }
    this.applyFilter();
  });

  private onSearchChange = debounce(500, (newValue: string) => {
    this.search = newValue;
    this.applyFilter();
  });

  public handleMobileOpen = () => {
    this.setState({ isMobileOpen: true });
  };
  public handleMobileClose = () => {
    this.setState({ isMobileOpen: false });
  };

  private handleCategoryClick = (category: TProductCategory) => () => {
    const skip = this.props?.instanceSettings?.onCategoryClick?.(category);
    if (skip) return;

    if ((!category?.slug && !category?.id) || !this.props.router) return;
    const url = resolvePageRoute('category', { slug: category.slug ?? category.id + '' });
    this.props.router?.push(url);
  };

  public setFilter = (filterParams: TProductFilter) => {
    this.priceRange[0] = filterParams.minPrice;
    this.priceRange[1] = filterParams.maxPrice;
    this.search = filterParams.nameSearch || '';

    const searchInput = document.getElementById(this.searchInputId) as HTMLInputElement | null;
    if (searchInput) {
      searchInput.value = filterParams.nameSearch ?? '';
    }

    this.checkedAttrs = Object.assign(
      {},
      ...(filterParams.attributes?.map((attr) => {
        return {
          [attr.key]: attr.values,
        };
      }) ?? []),
    );

    this.forceUpdate();
  };

  private getFilterItem = (props: { title: string; key: string; content: JSX.Element }) => {
    const { collapsedItems } = this.state;
    if (collapsedItems[props.key] === undefined) {
      collapsedItems[props.key] = this.collapsedByDefault;
    }
    const isExpanded = !collapsedItems[props.key];

    return (
      <Card className="productFilter_card">
        <div
          className="productFilter_headerWrapper"
          onClick={() =>
            this.setState((prev) => ({
              collapsedItems: {
                ...prev.collapsedItems,
                [props.key]: !prev.collapsedItems[props.key],
              },
            }))
          }
        >
          <Typography
            gutterBottom
            style={{
              fontSize: '14px',
              margin: '0 0 0 15px',
            }}
          >
            {props.title}
          </Typography>
          <IconButton
            className={clsx('productFilter_expand', {
              productFilter_expandOpen: isExpanded,
            })}
            aria-expanded={isExpanded}
            aria-label={`Toggle ${props.title} filter visibility`}
          >
            <ExpandMoreIcon />
          </IconButton>
        </div>
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          {props.content}
        </Collapse>
      </Card>
    );
  };

  render() {
    const { instanceSettings } = this.props;
    const { pluginSettings } = this.props.data ?? {};
    const { attributes, productCategory } = this.initialData ?? {};
    const { isMobileOpen, minPrice, maxPrice, collapsedItems, isLoading } = this.state;
    instanceSettings?.getInstance?.(this);

    const isMobile = !instanceSettings?.disableMobile && this.props.isMobile;
    const pcCollapsedByDefault = pluginSettings?.collapsedByDefault ?? defaultSettings.collapsedByDefault;
    const mobileCollapsedByDefault =
      pluginSettings?.mobileCollapsedByDefault ?? defaultSettings.mobileCollapsedByDefault;
    const _collapsedByDefault = isMobile ? mobileCollapsedByDefault : pcCollapsedByDefault;

    if (this.collapsedByDefault !== _collapsedByDefault) {
      this.collapsedByDefault = _collapsedByDefault;
      this.setState({ collapsedItems: {} });
    }

    let filterContent = (
      <div style={{ position: 'relative' }}>
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 11,
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: '8px',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
            }}
          >
            <LoadBox size={60} />
          </div>
        )}
        {isMobile && (
          <div className="productFilter_mobileHeader">
            <p>Filter</p>
            <IconButton
              aria-label="Close filter"
              className="productFilter_mobileCloseBtn"
              onClick={this.handleMobileClose}
            >
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
              id={this.searchInputId}
              placeholder="type to search..."
              variant="standard"
              onChange={(e) => this.onSearchChange(e.target.value)}
            />
          ),
        })}
        {productCategory &&
          !!(productCategory.parent || productCategory.children?.length) &&
          this.getFilterItem({
            title: 'Categories',
            key: 'categories',
            content: (
              <div className={clsx('productFilter_categoryBox', 'productFilter_styledScrollBar', 'productFilter_list')}>
                {productCategory.parent && (
                  <Chip
                    className="productFilter_category"
                    label={productCategory.parent.name}
                    onClick={this.handleCategoryClick(productCategory.parent)}
                  />
                )}
                {productCategory && (
                  <Chip
                    className="productFilter_category"
                    variant="outlined"
                    disabled
                    style={{ marginLeft: productCategory.parent ? '15px' : '' }}
                    label={productCategory.name}
                    onClick={this.handleCategoryClick(productCategory)}
                  />
                )}
                {!!productCategory.children?.length && (
                  <>
                    {productCategory.children.map((child) => (
                      <Chip
                        key={child.id}
                        className="productFilter_category"
                        style={{ marginLeft: (productCategory?.parent ? 15 : 0) + 15 + 'px' }}
                        label={child.name}
                        onClick={this.handleCategoryClick(child)}
                      />
                    ))}
                  </>
                )}
              </div>
            ),
          })}
        {!!maxPrice &&
          minPrice !== maxPrice &&
          this.getFilterItem({
            title: 'Price',
            key: 'price',
            content: (
              <Slider
                onChange={this.onPriceRangeChange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                priceRange={[this.priceRange[0] ?? minPrice, this.priceRange[1] ?? maxPrice]}
              />
            ),
          })}
        {attributes &&
          attributes.map((attr) => {
            if (!attr.key || !attr.values) return null;
            if (!(attr.type === 'checkbox' || attr.type === 'radio')) return null;

            const checked: string[] | undefined = this.checkedAttrs[attr.key];
            const numberOfChecked = () => (checked ? checked.length : 0);
            const handleToggleAll = () => {
              if (attr.key && attr.values && attr.values?.length !== 0) {
                if (numberOfChecked() === attr.values?.length) {
                  this.handleSetAttribute(attr.key, []);
                } else {
                  this.handleSetAttribute(
                    attr.key,
                    attr.values.map((v) => v.value),
                  );
                }
              }
            };
            if (collapsedItems[attr.key] === undefined) {
              collapsedItems[attr.key] = this.collapsedByDefault;
            }
            const isExpanded = !collapsedItems[attr.key];
            return (
              <Card key={attr.key} className="productFilter_card">
                <div className="productFilter_headerWrapper">
                  <CardHeader
                    className="productFilter_cardHeader"
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
                    onClick={() =>
                      this.setState((prev) => ({
                        collapsedItems: {
                          ...prev.collapsedItems,
                          [attr.key!]: !prev.collapsedItems[attr.key!],
                        },
                      }))
                    }
                    className={clsx('productFilter_expand', {
                      productFilter_expandOpen: isExpanded,
                    })}
                    aria-label="Toggle filter visibility"
                    aria-expanded={isExpanded}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </div>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Divider />
                  <List
                    className={clsx('productFilter_list', 'productFilter_styledScrollBar')}
                    dense
                    component="div"
                    role="list"
                  >
                    {attr.values.map((attrValue: TAttributeValue) => {
                      const value = attrValue.value;
                      const labelId = `attribute-list-${attr.key}-${value}-label`;
                      return (
                        <ListItem
                          key={value}
                          role="listitem"
                          button
                          onClick={() => {
                            const newChecked = checked ? [...checked] : [];
                            const currentIndex = newChecked.indexOf(value);
                            if (currentIndex === -1) {
                              newChecked.push(value);
                            } else {
                              newChecked.splice(currentIndex, 1);
                            }
                            this.handleSetAttribute(attr.key!, newChecked);
                          }}
                        >
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
                              className="productFilter_attrValueIcon"
                            ></div>
                          )}
                          <ListItemText id={labelId} primary={value} />
                        </ListItem>
                      );
                    })}
                    <ListItem />
                  </List>
                </Collapse>
              </Card>
            );
          })}
      </div>
    );

    if (isMobile) {
      const onOpen = () => {};
      const mobileIconPosition = pluginSettings?.mobileIconPosition ?? defaultSettings.mobileIconPosition;

      filterContent = (
        <div>
          <IconButton
            aria-label="Open product filter"
            className="productFilter_mobileOpenBtn"
            style={{
              top: mobileIconPosition.top + 'px',
              left: mobileIconPosition.left + 'px',
            }}
            onClick={this.handleMobileOpen}
          >
            <FilterListIcon />
          </IconButton>
          <SwipeableDrawer
            open={isMobileOpen}
            onClose={this.handleMobileClose}
            onOpen={onOpen}
            classes={{ paper: 'productFilter_styledScrollBar' }}
          >
            <div className="productFilter_drawer">{filterContent}</div>
          </SwipeableDrawer>
        </div>
      );
    }

    return filterContent;
  }
}

let HocComp: any = (props: TFrontendPluginProps<TPluginProductFilterData, TInstanceSettings>) => {
  const isMobile = useMediaQuery(`(max-width:${props.data?.pluginSettings?.mobileBreakpoint || 600}px)`);
  return <ProductFilter {...props} isMobile={isMobile} />;
};

HocComp = withStyles(styles)(HocComp);
export default HocComp;
