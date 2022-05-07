import { gql } from '@apollo/client';
import { EDBEntity, resolvePageRoute, serviceLocator, TAttribute, TProduct, TProductInput } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { ArrowBack as ArrowBackIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Button, IconButton, Skeleton, Tab, Tabs, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { toast } from '../../components/toast/toast';
import { productPageInfo } from '../../constants/PageInfos';
import { getCustomMetaFor, getCustomMetaKeysFor, RenderCustomFields } from '../../helpers/customFields';
import { useForceUpdate } from '../../helpers/forceUpdate';
import { resetSelected } from '../../redux/helpers';
import { store } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import AttributesTab from './AttributesTab';
import CategoriesTab from './CategoriesTab';
import MainInfoCard from './MainInfoCard';
import styles from './Product.module.scss';
import VariantsTab from './VariantsTab';

const ProductPage = () => {
    const { id: productId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [isLoading, setIsLoading] = useState(false);
    const [attributes, setAttributes] = useState<TAttribute[]>([]);

    const [activeTabNum, setActiveTabNum] = React.useState(0);
    const productRef = React.useRef<TProduct | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [canValidate, setCanValidate] = useState(false);
    const forceUpdate = useForceUpdate();
    const history = useHistory();

    const product: TProduct | undefined = productRef.current;

    const setProdData = (data: TProduct) => {
        productRef.current = Object.assign({}, productRef.current, data);
    }

    useEffect(() => {
        return () => {
            resetSelected();
        }
    }, []);

    const getProduct = async () => {
        let prod: TProduct | undefined;
        if (productId && productId !== 'new') {
            try {
                prod = await client?.getProductById(parseInt(productId), gql`
                    fragment AdminPanelProductFragment on Product {
                        id
                        slug
                        createDate
                        updateDate
                        isEnabled
                        pageTitle
                        pageDescription
                        meta {
                            keywords
                        }
                        name
                        price
                        oldPrice
                        sku
                        mainImage
                        images
                        description
                        descriptionDelta
                        views
                        mainCategoryId
                        stockAmount
                        stockStatus
                        manageStock
                        categories(pagedParams: { pageSize: 10000 }) {
                            id
                        }
                        customMeta (keys: ${JSON.stringify(getCustomMetaKeysFor(EDBEntity.Product))})
                        attributes {
                            key
                            values {
                                value
                            }
                        }
                        variants {
                            id
                            name
                            price
                            oldPrice
                            sku
                            mainImage
                            images
                            description
                            descriptionDelta
                            stockAmount
                            stockStatus
                            manageStock
                            attributes
                        }
                    }`, 'AdminPanelProductFragment'
                );

            } catch (e) { console.error(e) }

            if (prod?.id) {
                setProdData(prod);
                store.setStateProp({
                    prop: 'selectedItems',
                    payload: Object.assign({}, ...(prod.categories ?? []).map(cat => ({ [cat.id]: true }))),
                });
                store.setStateProp({
                    prop: 'selectedItem',
                    payload: prod?.mainCategoryId,
                });

                forceUpdate();
            }
            else setNotFound(true);

        } else if (productId === 'new') {
            setProdData({} as any);
            forceUpdate();
        }
        return prod;
    }

    const getAttributes = async () => {
        try {
            const attr = await client?.getAttributes({ pagedParams: { pageSize: 1000 } });
            if (attr?.elements) setAttributes(attr.elements);
        } catch (e) { console.error(e) }
    }

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await getAttributes();
            await getProduct();
            setIsLoading(false);
        })();
    }, []);

    const refetchMeta = async () => {
        if (!productId) return;
        const data = await getProduct();
        return data?.customMeta;
    };

    const handleSave = async () => {
        const product = productRef.current;
        setCanValidate(true);

        if (!product?.name) return;

        const productAttributes = product.attributes?.map(attr => ({
            key: attr.key,
            values: attr.values ? attr.values.map(val => ({
                value: val.value,
            })) : [],
        }));

        const selectedItems = store.getState().selectedItems;
        const categoryIds = Object.keys(selectedItems)
            .filter(id => selectedItems[id]).map(Number).filter(Boolean);
        let mainCategoryId = store.getState().selectedItem ?? null;
        if (mainCategoryId && !categoryIds.includes(mainCategoryId)) mainCategoryId = null;

        if (product) {
            const input: TProductInput = {
                name: product.name,
                categoryIds,
                mainCategoryId,
                price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                oldPrice: typeof product.oldPrice === 'string' ? parseFloat(product.oldPrice) : product.oldPrice,
                sku: product.sku,
                mainImage: product.mainImage,
                images: product.images,
                stockStatus: product.stockStatus ?? 'In stock',
                stockAmount: product.stockAmount,
                description: product.description,
                descriptionDelta: product.descriptionDelta,
                slug: product.slug,
                attributes: productAttributes,
                pageTitle: product.pageTitle,
                pageDescription: product.pageDescription,
                meta: product.meta && {
                    keywords: product.meta.keywords
                },
                variants: product.variants?.map(variant => ({
                    id: typeof variant.id === 'number' ? variant.id : undefined,
                    name: variant.name,
                    price: typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price,
                    oldPrice: typeof variant.oldPrice === 'string' ? parseFloat(variant.oldPrice) : variant.oldPrice,
                    sku: variant.sku,
                    mainImage: variant.mainImage,
                    images: variant.images,
                    description: variant.description,
                    descriptionDelta: variant.descriptionDelta,
                    stockAmount: variant.stockAmount,
                    stockStatus: variant.stockStatus,
                    attributes: variant.attributes,
                })),
                customMeta: Object.assign({}, product.customMeta, await getCustomMetaFor(EDBEntity.Product)),
                isEnabled: product.isEnabled,
            }


            if (input.variants?.length) {
                // Ensure that variants have at least one specified attribute
                input.variants.forEach((variant, i) => {
                    const filteredAttributes: Record<string, string | number> = {};
                    Object.entries((variant.attributes ?? {})).forEach(([key, value]) => {
                        if (value && value !== 'any') filteredAttributes[key] = value;
                    });
                    if (!Object.keys(filteredAttributes).length) delete input.variants[i];
                });
                input.variants = input.variants.filter(Boolean);
            }


            if (productId === 'new') {
                setIsLoading(true);
                try {
                    const prod = await client?.createProduct(input);
                    if (prod?.id) {
                        toast.success('Created product');
                        history.replace(`${productPageInfo.baseRoute}/${prod.slug}`)
                        if (prod) setProdData(prod);
                        forceUpdate();
                    } else {
                        throw new Error('!prod?.id')
                    }
                } catch (e) {
                    toast.error('Failed to create');
                    console.error(e);
                }
                setIsLoading(false);

            } else {
                try {
                    await client?.updateProduct(product.id, input);
                    await getProduct();
                    toast.success('Updated product');
                } catch (e) {
                    toast.error('Failed to update');
                    console.error(e);
                }
            }
        }
        setCanValidate(false);
    }

    const handleTabChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
        setActiveTabNum(newValue);
    }


    if (notFound) {
        return (
            <div className={styles.Product}>
                <div className={styles.notFoundPage}>
                    <p className={styles.notFoundText}>Product not found</p>
                </div>
            </div>
        )
    }

    let pageFullUrl;
    if (product?.slug) {
        pageFullUrl = serviceLocator.getFrontendUrl() + resolvePageRoute('product', { slug: product.slug ?? product.id + '' });
    }

    return (
        <div className={styles.Product}>
            {/* <h2>Edit product</h2> */}
            <div className={styles.header}>
                {/* <p>Product id: {id}</p> */}
                <div className={styles.headerLeft}>
                    <IconButton
                        onClick={() => window.history.back()}
                    >
                        <ArrowBackIcon style={{ fontSize: '18px' }} />
                    </IconButton>
                    <p className={commonStyles.pageTitle}>product</p>
                </div>
                <div >
                    <Tabs
                        value={activeTabNum}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleTabChange}
                    >
                        <Tab label="Main" />
                        <Tab label="Attributes" />
                        <Tab label="Variants" />
                        <Tab label="Categories" />
                    </Tabs>
                </div>
                <div className={styles.headerActions}>
                    {pageFullUrl && (
                        <Tooltip title="Open product in the new tab">
                            <IconButton
                                className={styles.openPageBtn}
                                aria-label="open"
                                onClick={() => { window.open(pageFullUrl, '_blank'); }}
                            >
                                <OpenInNewIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Button variant="contained"
                        color="primary"
                        size="small"
                        className={styles.saveBtn}
                        onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </div>
            {isLoading && <Skeleton width="100%" height="100%" style={{
                transform: 'none',
                margin: '20px 0'
            }} />}
            {!isLoading && product && (
                <>
                    <TabPanel value={activeTabNum} index={0}>
                        <div className={styles.mainTab}>
                            <MainInfoCard
                                product={product}
                                setProdData={setProdData}
                                canValidate={canValidate}
                            />
                            <div style={{ marginBottom: '15px' }}></div>
                            <RenderCustomFields
                                entityType={EDBEntity.Product}
                                entityData={product}
                                refetchMeta={refetchMeta}
                            />
                        </div>
                    </TabPanel>
                    <TabPanel value={activeTabNum} index={1}>
                        <AttributesTab
                            forceUpdate={forceUpdate}
                            product={product}
                            attributes={attributes}
                            setProdData={setProdData}
                        />
                    </TabPanel>
                    <TabPanel value={activeTabNum} index={2}>
                        <VariantsTab
                            forceUpdate={forceUpdate}
                            product={product}
                            attributes={attributes}
                            setProdData={setProdData}
                        />
                    </TabPanel>
                    <TabPanel value={activeTabNum} index={3}>
                        <CategoriesTab />
                    </TabPanel>
                </>
            )}
        </div >
    )
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            className={styles.tab}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div className={styles.tabContent}>{children}</div>
            )}
        </div>
    );
}

export default ProductPage;
