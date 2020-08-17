import {
    TGetStaticProps, TProductCategory, TAttribute, TAttributeValue,
    TPagedParams, TProduct, TPagedList, TFrontendPluginProps, getBlockInstance
} from '@cromwell/core';
import { FrontendPlugin, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import React, { Component, useEffect, useState } from 'react';
import {
    Checkbox, FormHelperText,
    FormControlLabel,
    List,
    Card,
    CardHeader,
    ListItem,
    ListItemText,
    ListItemIcon,
    Button,
    Divider,
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

import { useStyles } from './styles';
import { gql } from '@apollo/client';
import { TProductFilter } from '../types';

interface TProductFilterData {
    productCategory?: TProductCategory;
    slug?: string;
    attributes: TAttribute[];
}
interface TProductFilterSettings {
    productListId: string;
}


const ProductFilter = (props: TFrontendPluginProps<TProductFilterData, TProductFilterSettings>): JSX.Element => {
    const { attributes, productCategory } = props.data
    const [checkedAttrs, setCheckedAttrs] = useState<Record<string, string[]>>({});
    const classes = useStyles();
    const client = getGraphQLClient();

    const getFiltered = async (categoryId: string, pagedParams?: TPagedParams<TProduct>,
        filterParams?: TProductFilter, withCategories = false): Promise<TPagedList<TProduct>> => {
        const data = await client?.query({
            query: gql`
                query getFilteredProductsFromCategory($categoryId: String!, $pagedParams: PagedParamsInput!, $filterParams: ProductFilter!, $withCategories: Boolean!) {
                    getFilteredProductsFromCategory(categoryId: $categoryId, pagedParams: $pagedParams, filterParams: $filterParams) {
                        pagedMeta {
                            ...PagedMetaFragment
                        }
                        elements {
                            ...ProductFragment
                        }
                    }
                }
                ${client?.ProductFragment}
                ${client?.PagedMetaFragment}
            `,
            variables: {
                pagedParams,
                withCategories,
                filterParams,
                categoryId
            }
        });
        return data?.data?.getFilteredProductsFromCategory;
    }

    const handleSetAttribute = (key: string, checks: string[]) => {
        setCheckedAttrs(prev => {
            const newCheckedAttrs: Record<string, string[]> = JSON.parse(JSON.stringify(prev));
            newCheckedAttrs[key] = checks;
            return newCheckedAttrs;
        })
    }

    useEffect(() => {
        if (Object.keys(checkedAttrs).length > 0 && productCategory && productCategory.id) {
            const productListId = props?.settings?.productListId;
            if (productListId) {
                const list: TCList | undefined = getBlockInstance(productListId)?.getContentInstance() as any;
                if (list) {
                    const listProps = Object.assign({}, list.getProps());
                    listProps.loader = (pageNum: number): Promise<TPagedList<TProduct>> => {
                        const filterOptions = {
                            attributes: Object.keys(checkedAttrs).map(key => ({
                                key, values: checkedAttrs[key]
                            }))
                        }
                        const pagedParams: TPagedParams<TProduct> = {
                            pageNumber: pageNum
                        }
                        return getFiltered(productCategory.id, pagedParams, filterOptions);
                    };
                    listProps.firstBatch = undefined;
                    list.setProps(listProps);
                    list.clearState();
                    list.init();
                }
            }
            
        }

    }, [checkedAttrs]);

    return (
        <div>
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
                    return (
                        <Card className={classes.card}>
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
                        </Card>
                    )
                })
            )}
        </div>
    )
}

export const getStaticProps: TGetStaticProps = async (context) => {
    // console.log('context', context)
    const slug = (context && context.params) ? context.params.slug : null;
    console.log('CategoryThemePage::getStaticProps: slug', slug, 'context.params', context.params)
    let productCategory: TProductCategory | undefined = undefined;
    if (slug && typeof slug === 'string') {
        try {
            productCategory = await getGraphQLClient()?.
                getProductCategoryBySlug(slug, { pageSize: 20 });
        } catch (e) {
            console.error('Product::getStaticProps', e)
        }
    } else {
        console.error('Product::getStaticProps: !pid')
    }

    let attributes: TAttribute[] | undefined;

    try {
        attributes = await getGraphQLClient()?.getAttributes();
    } catch (e) {
        console.error('Product::getStaticProps', e)
    }

    return {
        slug,
        productCategory,
        attributes
    }
}

export default FrontendPlugin(ProductFilter, 'ProductFilter');
