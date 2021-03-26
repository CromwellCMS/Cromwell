import 'swiper/swiper-bundle.min.css';

import { gql } from '@apollo/client';
import { TAttribute, TAttributeInstanceValue, TAttributeProductVariant, TProduct, TProductInput } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button, Fade, IconButton, MenuItem, Paper, Popper, Tab, Tabs, Tooltip } from '@material-ui/core';
import {
    DeleteForever as DeleteForeverIcon,
    Edit as EditIcon,
    HighlightOff as HighlightOffIcon,
    OpenInNew as OpenInNewIcon,
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { toast } from '../../components/toast/toast';
import TransferList from '../../components/transferList/TransferList';
import { productPageInfo } from '../../constants/PageInfos';
import MainInfoCard from './MainInfoCard';
import styles from './Product.module.scss';

export const editorId = "quill-editor";

export type TInfoCardRef = {
    save: () => void;
};

const ProductPage = () => {
    const { id: productId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [isLoading, setIsloading] = useState(false);
    // const [product, setProdData] = useState<TProduct | null>(null);
    const [attributes, setAttributes] = useState<TAttribute[]>([]);
    const [popperAnchorEl, setPopperAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [popperOpen, setPopperOpen] = React.useState(false);
    const [activeTabNum, setActiveTabNum] = React.useState(0);
    const infoCardRef = React.useRef<TInfoCardRef | null>(null);
    const productRef = React.useRef<TProduct | null>(null);
    const [notFound, setNotFound] = useState(false);
    const forceUpdate = useForceUpdate();
    const history = useHistory();

    const product: TProduct | undefined = productRef.current;

    const setProdData = (data: TProduct) => {
        productRef.current = data;
    }

    const [editingProductVariant, setEditingProductVariant] = React.useState<{
        prodAttrIdx: number; value: string;
    } | null>(null);

    const getProduct = async () => {
        if (productId && productId !== 'new') {

            setIsloading(true);
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
                        name
                        price
                        oldPrice
                        mainImage
                        images
                        description
                        descriptionDelta
                        views
                        attributes {
                            key
                            values {
                                value
                                productVariant {
                                    name
                                    price
                                    oldPrice
                                    mainImage
                                    images
                                    description
                                    descriptionDelta
                                }
                            }
                        }
                    }`, 'AdminPanelProductFragment'
                );

            } catch (e) { console.log(e) }

            if (prod?.id) {
                setProdData(prod);
                forceUpdate();
            }
            else setNotFound(true);

            setIsloading(false);


        } else if (productId === 'new') {
            setProdData({} as any);
            forceUpdate();
        }

    }

    const getAttributes = async () => {
        setIsloading(true);
        try {
            const attr = await client?.getAttributes();
            if (attr) setAttributes(attr);
        } catch (e) { console.log(e) }

        setIsloading(false);
    }

    useEffect(() => {
        getProduct();
        getAttributes();
    }, []);


    const handleSave = async () => {
        infoCardRef?.current?.save();
        const product = productRef.current;

        if (product) {
            const input: TProductInput = {
                name: product.name,
                categoryIds: product.categories ? product.categories.map(c => c.id) : [],
                price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                oldPrice: typeof product.oldPrice === 'string' ? parseFloat(product.oldPrice) : product.oldPrice,
                mainImage: product.mainImage,
                images: product.images,
                description: product.description,
                descriptionDelta: product.descriptionDelta,
                slug: product.slug,
                attributes: product.attributes?.map(attr => ({
                    key: attr.key,
                    values: attr.values ? attr.values.map(val => ({
                        value: val.value,
                        productVariant: val.productVariant ? {
                            name: val.productVariant.name,
                            price: typeof val.productVariant.price === 'string' ? parseFloat(val.productVariant.price) : val.productVariant.price,
                            oldPrice: typeof val.productVariant.oldPrice === 'string' ? parseFloat(val.productVariant.oldPrice) : val.productVariant.oldPrice,
                            mainImage: val.productVariant.mainImage,
                            images: val.productVariant.images,
                            description: val.productVariant.description,
                            descriptionDelta: val.productVariant.descriptionDelta,
                        } : undefined
                    })) : []
                })),
                pageTitle: product.pageTitle,
                pageDescription: product.pageDescription,
                isEnabled: product.isEnabled,
            }
            setIsloading(true);

            if (productId === 'new') {
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
                    console.log(e);
                }

            } else {
                try {
                    await client?.updateProduct(product.id, input);
                    const prod = await client?.getProductById(productId);
                    toast.success('Updated product');
                    if (prod) setProdData(prod);
                } catch (e) {
                    toast.error('Failed to update');
                    console.log(e);
                }
            }

            setIsloading(false);
        }
    }

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setActiveTabNum(newValue);
    }

    const leftAttributesToAdd: TAttribute[] = [];

    attributes.forEach(attr => {
        if (product) {
            let hasAttr = product.attributes ? product.attributes.some(a => a.key === attr.key) : false;
            if (!hasAttr) {
                leftAttributesToAdd.push(attr);
            }
        }
    });

    if (notFound) {
        return (
            <div className={styles.Product}>
                <div className={styles.notFoundPage}>
                    <p className={styles.notFoundText}>Product not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.Product}>
            {/* <h2>Edit product</h2> */}
            <div className={styles.header}>
                {/* <p>Product id: {id}</p> */}
                <div className={styles.paper}>
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
                <div>
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="large"
                        onClick={handleSave}>
                        Save
                        </Button>
                    <Tooltip title="Open product page in new tab">
                        <IconButton
                            aria-label="open"
                            onClick={() => { if (product) window.open(`http://localhost:4128/product/${product.id}`, '_blank'); }}
                        >
                            <OpenInNewIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            {isLoading && <Skeleton width="100%" height="100%" style={{
                transform: 'none',
                margin: '20px 0'
            }} />}
            {!isLoading && product && (
                <>
                    <TabPanel value={activeTabNum} index={0}>
                        <MainInfoCard
                            product={product}
                            setProdData={setProdData}
                            infoCardRef={infoCardRef}
                        />
                    </TabPanel>
                    <TabPanel value={activeTabNum} index={1}>
                        {product.attributes && attributes && (
                            product.attributes.map((prodAttr, prodAttrIdx) => {
                                let origAttr: TAttribute | undefined = undefined;
                                for (const attr of attributes) {
                                    if (attr.key === prodAttr.key) origAttr = attr;
                                }
                                if (origAttr) {
                                    const leftValues = origAttr.values.filter(v => !prodAttr.values.some(pv => pv.value === v.value))
                                    const rightValues = prodAttr.values.map(v => v.value);
                                    return (
                                        <div className={styles.attributeBlock}>
                                            <div className={styles.attributeHeader}>
                                                <p className={styles.tag}>{prodAttr.key}</p>
                                                <Tooltip title="Delete attribute">
                                                    <IconButton
                                                        aria-label="delete attribute"
                                                        onClick={() => {
                                                            const prod: TProduct = JSON.parse(JSON.stringify(product));
                                                            if (prod.attributes) {
                                                                prod.attributes = prod.attributes.filter((a, i) => i !== prodAttrIdx);
                                                                setProdData(prod);
                                                                forceUpdate();
                                                            }
                                                        }}
                                                    ><DeleteForeverIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                            <TransferList
                                                left={leftValues.map(v => v.value)}
                                                setLeft={(val) => { }}
                                                right={rightValues}
                                                itemComp={(props) => (
                                                    <div className={styles.attributeInstanceValue}>
                                                        <p>{props.value}</p>
                                                        {rightValues.includes(props.value) && (
                                                            <Tooltip title="Edit product variant">
                                                                <IconButton
                                                                    aria-label="edit product variant"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingProductVariant({
                                                                            prodAttrIdx,
                                                                            value: props.value
                                                                        })
                                                                    }}
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                )}
                                                setRight={(val) => {
                                                    const prod: TProduct = JSON.parse(JSON.stringify(product));
                                                    if (!prod.attributes) prod.attributes = [];

                                                    const newVals: TAttributeInstanceValue[] = [];
                                                    val.forEach(newVal => {
                                                        let hasVal = false;
                                                        prod.attributes[prodAttrIdx].values.forEach(prodVal => {
                                                            if (prodVal.value === newVal) {
                                                                newVals.push(prodVal);
                                                                hasVal = true;
                                                            }
                                                        })
                                                        if (!hasVal) {
                                                            newVals.push({
                                                                value: newVal
                                                            });
                                                        }
                                                    });

                                                    prod.attributes[prodAttrIdx].values = newVals.sort((a, b) => a.value > b.value ? 1 : -1);
                                                    setProdData(prod);
                                                    forceUpdate();
                                                }}
                                            />
                                            {editingProductVariant && editingProductVariant.prodAttrIdx === prodAttrIdx && (
                                                <div className={styles.editingProductVariant}>
                                                    <div className={styles.attributeHeader}>
                                                        <p className={styles.editingProductVariantTitle}>Editing product variant for value:
                                                            <span className={styles.tag}>{editingProductVariant.value}</span>
                                                        </p>
                                                        <div>
                                                            <Tooltip title="Close">
                                                                <IconButton
                                                                    aria-label="close editingProductVariant"
                                                                    onClick={() => {
                                                                        setEditingProductVariant(null)
                                                                    }}
                                                                >
                                                                    <HighlightOffIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                    <div className={styles.editingProductVariantCard}>
                                                        <MainInfoCard
                                                            infoCardRef={infoCardRef}
                                                            productVariantVal={editingProductVariant.value}
                                                            product={prodAttr.values.find(a => a.value === editingProductVariant.value)?.productVariant || product}
                                                            setProdData={(data: TAttributeProductVariant) => {
                                                                const prod: TProduct = JSON.parse(JSON.stringify(product));
                                                                if (prod.attributes) {
                                                                    prod.attributes[prodAttrIdx].values = prod.attributes[prodAttrIdx].values.map(val => {
                                                                        if (val.value === editingProductVariant.value) {
                                                                            return {
                                                                                value: val.value,
                                                                                productVariant: data
                                                                            }
                                                                        } else return val;
                                                                    });
                                                                    setProdData(prod);
                                                                }
                                                            }}
                                                            isProductVariant
                                                        />
                                                    </div>

                                                </div>
                                            )}
                                        </div>
                                    )
                                }

                            })
                        )}
                        <Button variant="outlined" color="primary"
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                setPopperAnchorEl(event.currentTarget);
                                setPopperOpen((prev) => !prev);
                            }}
                            disabled={!Boolean(leftAttributesToAdd.length)}
                        >Add attribute</Button>
                        <Popper open={popperOpen} anchorEl={popperAnchorEl} placement={'bottom-start'} transition>
                            {({ TransitionProps }) => (
                                <Fade {...TransitionProps} timeout={350}>
                                    <Paper className={styles.newAttributesList}>
                                        {leftAttributesToAdd.map(attr => {
                                            return (
                                                <MenuItem
                                                    onClick={() => {
                                                        const prod: TProduct = JSON.parse(JSON.stringify(product));
                                                        if (!prod.attributes) prod.attributes = [];
                                                        prod.attributes.push({
                                                            key: attr.key,
                                                            values: []
                                                        })
                                                        setPopperOpen(false);
                                                        setProdData(prod);
                                                    }}
                                                    className={styles.newAttributeOption}
                                                >{attr.key}</MenuItem>
                                            )
                                        })}
                                    </Paper>
                                </Fade>
                            )}
                        </Popper>
                    </TabPanel>
                    <TabPanel value={activeTabNum} index={2}>
                        Categories
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

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

export default ProductPage;
