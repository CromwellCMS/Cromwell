import { EDBEntity, TAttribute, TFilteredProductList, TProduct, TProductFilter } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Close as CloseIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import { Drawer, IconButton, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import ProductFilter from '@cromwell/plugin-product-filter/src/frontend/components/Filter';
import { IFrontendFilter } from '@cromwell/plugin-product-filter/src/types';
import EntityTable from '../../components/entity/entityTable/EntityTable';
import { IEntityListPage } from '../../components/entity/types';
import { productListInfo, productPageInfo } from '../../constants/PageInfos';
import { baseEntityColumns } from '../../helpers/customEntities';
import styles from './ProductList.module.scss';
import { useForceUpdate } from '@helpers/forceUpdate';

export default function ProductListPage() {
  const client = getGraphQLClient();
  const [showFilter, setShowFilter] = useState(false);
  const filterInstRef = useRef<IFrontendFilter | null>(null);
  const [attributes, setAttributes] = useState<TAttribute[] | null>(null);
  const productsRef = useRef<TFilteredProductList | null>(null);
  const filterInputRef = useRef<TProductFilter>({});
  const initialFilterRef = useRef<TProductFilter>({});
  const entityListPageRef = useRef<IEntityListPage<TProduct, TProductFilter> | null>(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    init();

    if (filterInstRef.current && initialFilterRef.current) {
      const filter = initialFilterRef.current;
      if (filter.attributes || filter.minPrice || filter.maxPrice || filter.nameSearch) {
        filterInstRef.current.setFilter(filter);
        filterInputRef.current = filter;
        entityListPageRef.current?.resetList?.();
      }
    }
  }, []);

  const init = async () => {
    const attributes = await client.getAttributes({ pagedParams: { pageSize: 1000 } });
    setAttributes(attributes?.elements);
  };

  const handleToggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const onFilterMount = () => {
    filterInstRef.current?.setFilterMeta(productsRef.current?.filterMeta);
  };

  const onFilterChange = (params: TProductFilter) => {
    const filter = filterInputRef.current ?? {};
    filter.attributes = params.attributes;
    filter.minPrice = params.minPrice;
    filter.maxPrice = params.maxPrice;
    filter.nameSearch = params.nameSearch;
    filter.categoryId = params.categoryId;

    entityListPageRef.current?.resetList?.();
    forceUpdate();
  };

  return (
    <>
      <EntityTable
        entityCategory={EDBEntity.Product}
        entityListRoute={productListInfo.route}
        entityBaseRoute={productPageInfo.baseRoute}
        listLabel="Products"
        entityLabel="Product"
        nameProperty="name"
        getMany={async (options) => {
          if (!options.filterParams) options.filterParams = {};
          options.filterParams.minPrice = filterInputRef.current?.minPrice;
          options.filterParams.maxPrice = filterInputRef.current?.maxPrice;
          options.filterParams.attributes = filterInputRef.current?.attributes;
          options.filterParams.nameSearch = filterInputRef.current?.nameSearch;

          const data = await client.getProducts(options);
          filterInstRef.current?.setFilterMeta(data?.filterMeta);
          productsRef.current = data;
          return data;
        }}
        deleteOne={client.deleteProduct}
        deleteMany={client.deleteManyProducts}
        getPageListInstance={(inst) => {
          entityListPageRef.current = inst;
          initialFilterRef.current = Object.assign({}, inst.getFilterInput());
        }}
        onClearAllFilters={() => {
          filterInstRef.current?.setFilter({});
          filterInputRef.current = {};
        }}
        isFilterActive={() => {
          const filter = filterInputRef.current;
          return !!(filter.nameSearch || filter.attributes || filter.maxPrice || filter.minPrice);
        }}
        columns={[
          {
            name: 'mainImage',
            label: 'Image',
            type: 'Image',
            visible: true,
          },
          {
            name: 'name',
            label: 'Name',
            type: 'Simple text',
            visible: true,
            minWidth: '25%',
          },
          {
            name: 'sku',
            label: 'SKU',
            type: 'Simple text',
            visible: true,
          },
          {
            name: 'price',
            label: 'Price',
            type: 'Currency',
            visible: true,
          },
          {
            name: 'oldPrice',
            label: 'Old Price',
            type: 'Currency',
            visible: false,
          },
          {
            name: 'stockStatus',
            label: 'Stock status',
            type: 'Simple text',
            visible: true,
            exactSearch: true,
            searchOptions: [
              {
                value: 'In stock',
                label: 'In stock',
              },
              {
                value: 'Out of stock',
                label: 'Out of stock',
              },
              {
                value: 'On backorder',
                label: 'On backorder',
              },
            ],
          },
          ...baseEntityColumns.map((col) => {
            if (col.name === 'createDate') return { ...col, visible: true };
            return { ...col, visible: false };
          }),
        ]}
        customElements={{
          getHeaderLeftActions: () => (
            <div>
              <Tooltip title="Attribute filter">
                <IconButton
                  className={styles.attributeFilterButton}
                  onClick={handleToggleFilter}
                  aria-label="show filter"
                >
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </div>
          ),
        }}
      />
      <Drawer
        classes={{ paper: styles.filterDrawer }}
        variant="persistent"
        anchor={'left'}
        open={showFilter}
        onClose={() => setShowFilter(false)}
      >
        <div className={styles.filterHeader}>
          <h3>Filter</h3>
          <Tooltip title="Close">
            <IconButton onClick={handleToggleFilter} aria-label="close filter">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
        <ProductFilter
          instanceSettings={{
            disableMobile: true,
            onChange: onFilterChange,
            getInstance: (inst) => {
              filterInstRef.current = inst;
            },
            onMount: onFilterMount,
          }}
          data={{
            attributes,
          }}
        />
      </Drawer>
    </>
  );
}
