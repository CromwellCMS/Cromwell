import 'swiper/swiper-bundle.min.css';

import { gql } from '@apollo/client';
import { TAttribute, TAttributeInstanceValue, TAttributeProductVariant, TProduct, TProductInput } from '@cromwell/core';
import { CGallery, getCStore, getGraphQLClient } from '@cromwell/core-frontend';
import { Button, Fade, IconButton, MenuItem, Paper, Popper, Tab, Tabs, TextField, Tooltip } from '@material-ui/core';
import {
    DeleteForever as DeleteForeverIcon,
    Edit as EditIcon,
    HighlightOff as HighlightOffIcon,
    OpenInNew as OpenInNewIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
} from '@material-ui/icons';
import Quill from 'quill';
import React, { useEffect, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useParams } from 'react-router-dom';
import { toast } from '../../components/toast/toast';

import LoadBox from '../../components/loadBox/LoadBox';
import TransferList from '../../components/transferList/TransferList';
import { initEditor, getQuillHTML } from '../../helpers/quill';
import styles from './Product.module.scss';

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix={getCStore().getActiveCurrencySymbol()}
        />
    );
}
const editorId = "quill-editor";

const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [loadingProgress, setIsloading] = useState([false, false]);
    const [product, setProdData] = useState<TProduct | null>(null);
    const [attributes, setAttributes] = useState<TAttribute[]>([]);
    const [popperAnchorEl, setPopperAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [popperOpen, setPopperOpen] = React.useState(false);
    const [activeTabNum, setActiveTabNum] = React.useState(0);
    const quillEditor = useRef<Quill | null>(null);
    const [notFound, setNotFound] = useState(false);

    const [editingProductVariant, setEditingProductVariant] = React.useState<{
        prodAttrIdx: number; value: string;
    } | null>(null);

    const getProduct = async () => {
        setIsloading(loadingProgress.slice().splice(0, 1, true));
        let prod: TProduct | undefined;
        try {
            prod = await client?.getProductById(id, gql`
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
                        }
                    }
                }
            }
        `, 'AdminPanelProductFragment');

        } catch (e) { console.log(e) }

        if (prod?.id) {
            setProdData(prod);

            let descriptionDelta: string | undefined;
            if (prod.descriptionDelta) {
                try {
                    descriptionDelta = JSON.parse(prod.descriptionDelta);
                } catch (e) { console.error(e) }
            }
            quillEditor.current = initEditor('#quill-editor', descriptionDelta);

        }
        else setNotFound(true);

        setIsloading(loadingProgress.slice().splice(0, 1, false));
    }

    const getAttributes = async () => {
        setIsloading(loadingProgress.slice().splice(1, 1, true));
        try {
            const attr = await client?.getAttributes();
            if (attr) setAttributes(attr);
        } catch (e) { console.log(e) }

        setIsloading(loadingProgress.slice().splice(1, 1, false));
    }

    useEffect(() => {
        getProduct();
        getAttributes();
    }, []);


    const handleSave = async () => {
        console.log('product', product)
        if (product) {
            const input: TProductInput = {
                name: product.name,
                categoryIds: product.categories ? product.categories.map(c => c.id) : [],
                price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                oldPrice: typeof product.oldPrice === 'string' ? parseFloat(product.oldPrice) : product.oldPrice,
                mainImage: product.mainImage,
                images: product.images,
                description: getQuillHTML(quillEditor.current, `#${editorId}`),
                descriptionDelta: JSON.stringify(quillEditor.current?.getContents() ?? null),
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
                            description: val.productVariant.description
                        } : undefined
                    })) : []
                })),
                pageTitle: product.pageTitle,
                isEnabled: product.isEnabled
            }
            setIsloading(loadingProgress.slice().splice(0, 1, true));
            try {
                await client?.updateProduct(product.id, input);
                const prod = await client?.getProductById(id);
                toast.success('Saved!');
                if (prod) setProdData(prod);
            } catch (e) {
                toast.error('Falied to save');
                console.log(e);
            }

            setIsloading(loadingProgress.slice().splice(0, 1, false));

        }
    }

    const isLoading = loadingProgress.some(i => Boolean(i));

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
                <Paper>
                    <Tabs
                        value={activeTabNum}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
                            setActiveTabNum(newValue);
                        }}
                    >
                        <Tab label="Main" />
                        <Tab label="Attributes" />
                        <Tab label="Categories" />
                    </Tabs>
                </Paper>
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
            {isLoading && <LoadBox />}
            {!isLoading && product && (
                <>
                    <TabPanel value={activeTabNum} index={0}>
                        <MainInfoCard product={product} setProdData={setProdData} />
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
                                                            }
                                                        }}
                                                    >
                                                        <DeleteForeverIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                            <TransferList
                                                left={leftValues.map(v => v.value)}
                                                setLeft={(val) => {
                                                }}
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
                                                    const newVals: TAttributeInstanceValue[] = [];
                                                    val.forEach(newVal => {
                                                        if (prod.attributes) {
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
                                                        }
                                                    });
                                                    if (prod.attributes) {
                                                        prod.attributes[prodAttrIdx].values = newVals;
                                                        setProdData(prod);
                                                    }
                                                }}
                                            />
                                            {editingProductVariant && editingProductVariant.prodAttrIdx === prodAttrIdx && (
                                                <div className={styles.editingProductVariant}>
                                                    <div className={styles.attributeHeader}>
                                                        <h3>Editing product variant for value: <span className={styles.tag}>{editingProductVariant.value}</span></h3>
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

const MainInfoCard = (props: {
    product: TAttributeProductVariant | TProduct,
    setProdData: (data: TProduct) => void;
    isProductVariant?: boolean;
    productVariantVal?: string;
}) => {
    const { product, setProdData } = props;
    const [canUpdateGallery, setCanUpdateGallery] = useState(false);
    const [galleryId] = useState('_' + Math.random().toString(36).substr(2, 9));
    const productVariantVal = useRef(props.productVariantVal);
    const isNewVariant = productVariantVal.current !== props.productVariantVal;
    if (isNewVariant) {
        productVariantVal.current = props.productVariantVal;
    }
    // console.log('MainInfoCard render', product)
    const handleChange = (prop: keyof TProduct, val: any) => {
        if (product) {
            const prod = Object.assign({}, product);
            (prod[prop] as any) = val;
            setProdData(prod as TProduct);
        }
    }

    const setMainImage = (idx: number) => {
        if (product && product.images) {
            const newMain = product.images[idx];
            if (newMain && newMain !== product.mainImage) {
                const prod = Object.assign({}, product);
                // Sort images to move mainImage into first item in the array
                const imgs = [newMain, ...product.images.filter((src, i) => i !== idx)];
                prod.images = imgs;
                prod.mainImage = newMain;
                setProdData(prod as TProduct);
                setCanUpdateGallery(true);
                setTimeout(() => {
                    setCanUpdateGallery(false);
                }, 500);
            }
        }
    }

    const deleteImage = (idx: number) => {
        if (product && product.images) {
            const prod = Object.assign({}, product);
            // Sort images to move mainImage into first item in the array
            prod.images = product.images.filter((val, i) => i !== idx);
            setProdData(prod as TProduct);
            setCanUpdateGallery(true);
            setTimeout(() => {
                setCanUpdateGallery(false);
            }, 500);
            // product.mainImage = src;
        }
    }

    if (!product) return null;

    return (
        <div>
            <TextField label="Name" variant="outlined"
                value={product.name || ''}
                className={styles.textField}
                onChange={(e) => { handleChange('name', e.target.value) }}
            />
            <TextField label="Price" variant="outlined"
                value={product.price || ''}
                className={styles.textField}
                onChange={(e) => { handleChange('price', e.target.value) }}
                InputProps={{
                    inputComponent: NumberFormatCustom as any,
                }}
            />
            <TextField label="Old price" variant="outlined"
                value={product.oldPrice || ''}
                className={styles.textField}
                onChange={(e) => {
                    const val = e.target.value;
                    handleChange('oldPrice', (val && val !== '') ? val : null);
                }}
                InputProps={{
                    inputComponent: NumberFormatCustom as any,
                }}
            />
            <div className={styles.imageBlock}>
                <CGallery id={"CGallery" + galleryId}
                    shouldComponentUpdate={isNewVariant ? true : canUpdateGallery}
                    gallery={{
                        images: product.images ? product.images.map((src, id) => ({ src, id })) : [],
                        maxHeight: '350px',
                        slidesPerView: 4,
                        showPagination: true,
                        navigation: {},
                        loop: false,
                        backgroundSize: 'contain',
                        components: {
                            imgWrapper: (props) => {
                                const isPrimary = props.image.src === product.mainImage;
                                return (
                                    <div className={styles.imageWrapper}>
                                        <div className={styles.imageActions}>
                                            <Tooltip title="Make primary">
                                                <IconButton
                                                    aria-label="make primary"
                                                    onClick={() => { setMainImage(props.image.id as number) }}
                                                >
                                                    {isPrimary ? <StarIcon /> : <StarBorderIcon />}
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Change image">
                                                <IconButton
                                                    aria-label="Change image"
                                                    onClick={() => { console.log('show more') }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete image">
                                                <IconButton
                                                    aria-label="Delete"
                                                    onClick={() => { deleteImage(props.image.id as number) }}
                                                >
                                                    <DeleteForeverIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                        {props.children}
                                    </div>
                                )
                            }
                        }
                    }} />
            </div>
            <div className={styles.descriptionEditor}>
                <div style={{ maxHeight: '400px' }} id={editorId}></div>
            </div>
            {props.isProductVariant !== true && (
                <TextField label="SEO URL" variant="outlined"
                    value={(product as TProduct).slug || ''}
                    className={styles.textField}
                    onChange={(e) => { handleChange('slug', e.target.value) }}
                />
            )}
            {props.isProductVariant !== true && (
                <TextField label="SEO Title" variant="outlined"
                    value={(product as TProduct).pageTitle || ''}
                    className={styles.textField}
                    onChange={(e) => { handleChange('pageTitle', e.target.value) }}
                />
            )}
        </div>
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
                <Paper className={styles.tabContent}>{children}</Paper>
            )}
        </div>
    );
}

export default ProductPage;
