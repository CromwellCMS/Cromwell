import { EDBEntity, TAttribute, TFilteredProductList, TProduct, TProductFilter } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Close as CloseIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import { Drawer, IconButton, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import ProductFilter from '../../../../../plugins/product-filter/src/frontend/components/Filter';
import { IFrontendFilter } from '../../../../../plugins/product-filter/src/types';
import EntityTable from '../../components/entity/entityTable/EntityTable';
import { IEntityListPage, TEntityPageProps } from '../../components/entity/types';
import { productListInfo, productPageInfo } from '../../constants/PageInfos';
import { baseEntityColumns } from '../../helpers/customEntities';
import styles from './ProductList.module.scss';

const EntityTableComp = EntityTable as React.ComponentType<TEntityPageProps<TProduct, TProductFilter>>;

export default function ProductTable() {
    const client = getGraphQLClient();
    const [showFilter, setShowFilter] = useState(false);
    const filterInstRef = useRef<IFrontendFilter | null>(null);
    const [attributes, setAttributes] = useState<TAttribute[] | null>(null);
    const productsRef = useRef<TFilteredProductList | null>(null);
    const attributesFilterInput = useRef<TProductFilter>({});
    const initialFilterRef = useRef<TProductFilter>({});
    const entityListPageRef = useRef<IEntityListPage<TProductFilter> | null>(null);

    useEffect(() => {
        init();

        if (filterInstRef.current && initialFilterRef.current) {
            const filter = initialFilterRef.current;
            if (filter.attributes || filter.minPrice || filter.maxPrice || filter.nameSearch) {
                filterInstRef.current.setFilter(filter);
                attributesFilterInput.current = filter;
                entityListPageRef.current?.resetList?.();
            }
        }
    }, []);

    const init = async () => {
        const attributes = await client.getAttributes();
        setAttributes(attributes);
    }

    const handleToggleFilter = () => {
        setShowFilter(prev => !prev);
    }

    const onFilterMount = () => {
        filterInstRef.current?.updateFilterMeta(productsRef.current);
    }

    const onFilterChange = (params: TProductFilter) => {
        Object.keys(params).forEach(key => {
            attributesFilterInput.current[key] = params[key];
        });
        entityListPageRef.current?.resetList?.();
    }

    return (
        <>
            <EntityTableComp
                entityCategory={EDBEntity.Product}
                entityListRoute={productListInfo.route}
                entityBaseRoute={productPageInfo.baseRoute}
                listLabel="Products"
                getManyFiltered={async (options) => {
                    if (!options.filterParams) options.filterParams = {};
                    options.filterParams.minPrice = attributesFilterInput.current?.minPrice;
                    options.filterParams.maxPrice = attributesFilterInput.current?.maxPrice;
                    options.filterParams.attributes = attributesFilterInput.current?.attributes;
                    options.filterParams.nameSearch = attributesFilterInput.current?.nameSearch;

                    const data = await client.getFilteredProducts(options);
                    filterInstRef.current?.updateFilterMeta(data);
                    productsRef.current = data;
                    return data;
                }}
                deleteOne={client.deleteProduct}
                deleteMany={client.deleteManyProducts}
                deleteManyFiltered={client.deleteManyFilteredProducts}
                getPageListInstance={inst => {
                    entityListPageRef.current = inst;
                    initialFilterRef.current = Object.assign({}, inst.getFilterInput());
                }}
                onClearAllFilters={() => {
                    filterInstRef.current?.setFilter({});
                    attributesFilterInput.current = {};
                }}
                isFilterActive={() => {
                    const filter = attributesFilterInput.current;
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
                        width: '25%',
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
                                key: 'In stock',
                                label: 'In stock',
                            },
                            {
                                key: 'Out of stock',
                                label: 'Out of stock',
                            },
                            {
                                key: 'On backorder',
                                label: 'On backorder',
                            },
                        ]
                    },
                    ...baseEntityColumns.map(col => {
                        if (col.name === 'createDate') return { ...col, visible: true }
                        return { ...col, visible: false }
                    }),
                ]}
                customElements={{
                    listLeftActions: (
                        <div>
                            <Tooltip title="Attributes filter">
                                <IconButton
                                    onClick={handleToggleFilter}
                                    aria-label="show filter"
                                >
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    )
                }}
            />
            <Drawer
                classes={{ paper: styles.filterDrawer }}
                variant="persistent"
                anchor={'left'}
                open={showFilter}
                onClose={() => setShowFilter(false)}>
                <div className={styles.filterHeader}>
                    <h3>Filter</h3>
                    <Tooltip title="Close">
                        <IconButton
                            onClick={handleToggleFilter}
                            aria-label="close filter"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <ProductFilter
                    instanceSettings={{
                        disableMobile: true,
                        onChange: onFilterChange,
                        getInstance: (inst) => { filterInstRef.current = inst },
                        onMount: onFilterMount,
                    }}
                    data={{
                        attributes
                    }}
                />
            </Drawer>
        </>
    )
}
