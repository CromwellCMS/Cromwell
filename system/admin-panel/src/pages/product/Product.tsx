import { gql } from '@apollo/client';
import { resolvePageRoute, serviceLocator, TAttribute, TProduct, TProductInput } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { ArrowBack as ArrowBackIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Button, IconButton, Skeleton, Tab, Tabs, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { toast } from '../../components/toast/toast';
import { productListInfo, productPageInfo } from '../../constants/PageInfos';
import { useForceUpdate } from '../../helpers/forceUpdate';
import { resetSelected } from '../../redux/helpers';
import { store } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import AttributesTab from './AttributesTab';
import CategoriesTab from './CategoriesTab';
import MainInfoCard from './MainInfoCard';
import styles from './Product.module.scss';

export const editorId = "prod-text-editor";

export type TInfoCardRef = {
    save: () => Promise<void>;
};

const ProductPage = () => {
    const { id: productId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [isLoading, setIsLoading] = useState(false);
    // const [product, setProdData] = useState<TProduct | null>(null);
    const [attributes, setAttributes] = useState<TAttribute[]>([]);

    const [activeTabNum, setActiveTabNum] = React.useState(0);
    const infoCardRef = React.useRef<TInfoCardRef | null>(null);
    const productRef = React.useRef<TProduct | null>(null);
    const [notFound, setNotFound] = useState(false);
    const forceUpdate = useForceUpdate();
    const history = useHistory();

    const product: TProduct | undefined = productRef.current;

    const setProdData = (data: TProduct) => {
        if (!productRef.current) productRef.current = data;
        else Object.keys(data).forEach(key => {
            productRef.current[key] = data[key];
        });
    }

    useEffect(() => {
        return () => {
            resetSelected();
        }
    }, []);

    const getProduct = async () => {
        if (productId && productId !== 'new') {
            let prod: TProduct | undefined;
            try {
                prod = await client?.getProductById(productId, gql`
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
                        categories(pagedParams: {pageSize: 9999}) {
                            id
                        }
                        attributes {
                            key
                            values {
                                value
                                productVariant {
                                    name
                                    price
                                    oldPrice
                                    sku
                                    mainImage
                                    images
                                    description
                                    descriptionDelta
                                }
                            }
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
    }

    const getAttributes = async () => {
        try {
            const attr = await client?.getAttributes();
            if (attr) setAttributes(attr);
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


    const handleSave = async () => {
        await infoCardRef?.current?.save();
        const product = productRef.current;

        const productAttributes = product.attributes?.map(attr => ({
            key: attr.key,
            values: attr.values ? attr.values.map(val => ({
                value: val.value,
                productVariant: val.productVariant ? {
                    name: val.productVariant.name,
                    price: typeof val.productVariant.price === 'string' ? parseFloat(val.productVariant.price) : val.productVariant.price,
                    oldPrice: typeof val.productVariant.oldPrice === 'string' ? parseFloat(val.productVariant.oldPrice) : val.productVariant.oldPrice,
                    sku: val.productVariant.sku,
                    mainImage: val.productVariant.mainImage,
                    images: val.productVariant.images,
                    description: val.productVariant.description,
                    descriptionDelta: val.productVariant.descriptionDelta,
                } : undefined
            })) : []
        }));

        const selectedItems = store.getState().selectedItems;
        const categoryIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
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
                description: product.description,
                descriptionDelta: product.descriptionDelta,
                slug: product.slug,
                attributes: productAttributes,
                pageTitle: product.pageTitle,
                pageDescription: product.pageDescription,
                meta: product.meta && {
                    keywords: product.meta.keywords
                },
                isEnabled: product.isEnabled,
            }

            if (productId === 'new') {
                setIsLoading(true);
                try {
                    const prod = await client?.createProduct(input);
                    if (prod?.id) {
                        toast.success('Created product');
                        history.push(`${productPageInfo.baseRoute}/${prod.slug}`)
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
        pageFullUrl = serviceLocator.getFrontendUrl() + resolvePageRoute('product', { slug: product.slug ?? product.id });
    }

    return (
        <div className={styles.Product}>
            {/* <h2>Edit product</h2> */}
            <div className={styles.header}>
                {/* <p>Product id: {id}</p> */}
                <div className={styles.headerLeft}>
                    <Link to={productListInfo.route}>
                        <IconButton
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Link>
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
                        <Tab label="Categories" />
                    </Tabs>
                </div>
                <div className={styles.headerActions}>
                    {pageFullUrl && (
                        <Tooltip title="Open product page in new tab">
                            <IconButton
                                className={styles.openPageBtn}
                                aria-label="open"
                                onClick={() => { window.open(pageFullUrl, '_blank'); }}
                            >
                                <OpenInNewIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Button variant="contained" color="primary"
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
                                infoCardRef={infoCardRef}
                            />
                        </div>
                    </TabPanel>
                    <TabPanel value={activeTabNum} index={1}>
                        <AttributesTab
                            forceUpdate={forceUpdate}
                            product={product}
                            attributes={attributes}
                            setProdData={setProdData}
                            infoCardRef={infoCardRef}
                        />
                    </TabPanel>
                    <TabPanel value={activeTabNum} index={2}>
                        <CategoriesTab />
                    </TabPanel>
                </>
            )
            }

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
