import { TAttributeProductVariant, TProduct } from '@cromwell/core';
import { CGallery, getCStore } from '@cromwell/core-frontend';
import { IconButton, TextField, Tooltip } from '@material-ui/core';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    DeleteForever as DeleteForeverIcon,
    Edit as EditIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
} from '@material-ui/icons';
import Quill from 'quill';
import React, { useEffect, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';

import { getFileManager } from '../../components/fileManager/helpers';
import { getQuillHTML, initQuillEditor } from '../../helpers/quill';
import { editorId, TInfoCardRef } from './Product';
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

const MainInfoCard = (props: {
    product: TAttributeProductVariant | TProduct,
    setProdData: (data: TProduct) => void;
    isProductVariant?: boolean;
    productVariantVal?: string;
    infoCardRef?: React.MutableRefObject<TInfoCardRef>;
}) => {
    // const { product, setProdData } = props;
    const productPrevRef = React.useRef<TAttributeProductVariant | TProduct | null>(props.product);
    const productRef = React.useRef<TAttributeProductVariant | TProduct | null>(props.product);
    if (props.product !== productPrevRef.current) {
        productPrevRef.current = props.product;
        productRef.current = props.product;
    }
    const forceUpdate = useForceUpdate();

    const product = productRef.current;

    const setProdData = (data: TProduct) => {
        Object.keys(data).forEach(key => { productRef.current[key] = data[key] })
        props.setProdData(data);
        forceUpdate();
    }

    const fullSave = () => {
        setProdData({
            ...(product as TProduct),
            description: getQuillHTML(quillEditor.current, `#${editorId}`),
            descriptionDelta: JSON.stringify(quillEditor.current?.getContents() ?? null),
        });
    }

    if (props.infoCardRef) props.infoCardRef.current = {
        save: () => fullSave()
    };

    const [canUpdateGallery, setCanUpdateGallery] = useState(false);
    const [galleryId] = useState('_' + Math.random().toString(36).substr(2, 9));
    const productVariantVal = useRef(props.productVariantVal);
    const isNewVariant = productVariantVal.current !== props.productVariantVal;
    const quillEditor = useRef<Quill | null>(null);
    if (isNewVariant) {
        productVariantVal.current = props.productVariantVal;
    }

    useEffect(() => {
        let descriptionDelta;
        if (product?.descriptionDelta) {
            try {
                descriptionDelta = JSON.parse(product.descriptionDelta);
            } catch (e) { console.error(e) }
        }
        quillEditor.current = initQuillEditor(`#${editorId}`, descriptionDelta);

        // Save editor content on close
        return () => {
            fullSave();
        }
    }, [])

    // console.log('MainInfoCard render', product)
    const handleChange = (prop: keyof TProduct, val: any) => {
        if (product) {
            const prod = Object.assign({}, product);
            (prod[prop] as any) = val;
            setProdData(prod as TProduct);
        }
    }

    const updateGallery = () => {
        setCanUpdateGallery(true);
        setTimeout(() => {
            setCanUpdateGallery(false);
        }, 500);
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
                updateGallery();
            }
        }
    }

    const deleteImage = (idx: number) => {
        if (product && product.images) {
            const prod = Object.assign({}, product);
            // Sort images to move mainImage into first item in the array
            prod.images = product.images.filter((val, i) => i !== idx);
            setProdData(prod as TProduct);
            updateGallery();
        }
    }

    const handleChangeImage = async (idx: number) => {
        const newSrc = await getFileManager()?.getPhoto();
        if (newSrc) {
            if (product?.images) {
                const prod = Object.assign({}, product);
                // Sort images to move mainImage into first item in the array
                prod.images = product.images.map((val, i) => {
                    if (i === idx) {
                        return newSrc;
                    }
                    return val;
                });
                setProdData(prod as TProduct);
                updateGallery();
            }
        }
    }

    const handleAddImage = async () => {
        const newSrc = await getFileManager()?.getPhoto();
        if (newSrc && product) {
            const images = product?.images ?? [];
            images.push(newSrc);
            setProdData({ ...(product as TProduct), images });
            updateGallery();
        }
    }

    const handleDeleteAllImages = () => {
        setProdData({ ...(product as TProduct), images: [] });
        updateGallery();
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
                <div className={styles.galleryContainer}>
                    <CGallery id={"CGallery" + galleryId}
                        shouldComponentUpdate={isNewVariant ? true : canUpdateGallery}
                        gallery={{
                            images: product.images ? product.images.map((src, id) => ({ src, id })) : [],
                            maxHeight: '300px',
                            slidesPerView: 1,
                            showPagination: true,
                            navigation: {},
                            loop: false,
                            backgroundSize: 'contain',
                            breakpoints: {
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 10,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 10,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 10,
                                },
                            },
                            components: {
                                imgWrapper: (props) => {
                                    const isPrimary = props.image.src === product.mainImage;
                                    return (
                                        <div className={styles.imageWrapper}>
                                            <div className={styles.imageActions}>
                                                <Tooltip title="Make primary">
                                                    <IconButton
                                                        className={styles.galleryActionBtn}
                                                        aria-label="make primary"
                                                        onClick={() => { setMainImage(props.image.id as number) }}
                                                    >
                                                        {isPrimary ? <StarIcon /> : <StarBorderIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Change image">
                                                    <IconButton
                                                        className={styles.galleryActionBtn}
                                                        aria-label="Change image"
                                                        onClick={() => { handleChangeImage(props.image.id as number) }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Remove image">
                                                    <IconButton
                                                        className={styles.galleryActionBtn}
                                                        aria-label="remove"
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
                <div className={styles.galleryActions}>
                    <Tooltip title="Add image">
                        <IconButton
                            className={styles.galleryAddImageBtn}
                            aria-label="add image"
                            onClick={handleAddImage}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Clear all images">
                        <IconButton
                            className={styles.galleryAddImageBtn}
                            aria-label="clear image"
                            onClick={handleDeleteAllImages}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className={styles.descriptionEditor}>
                <div style={{ maxHeight: '300px' }} id={editorId}></div>
            </div>
            {props.isProductVariant !== true && (
                <TextField label="Page slug (SEO URL)" variant="outlined"
                    value={(product as TProduct).slug || ''}
                    className={styles.textField}
                    onChange={(e) => { handleChange('slug', e.target.value) }}
                />
            )}
            {props.isProductVariant !== true && (
                <TextField label="Meta title (SEO)" variant="outlined"
                    value={(product as TProduct).pageTitle || ''}
                    className={styles.textField}
                    onChange={(e) => { handleChange('pageTitle', e.target.value) }}
                />
            )}
            {props.isProductVariant !== true && (
                <TextField label="Meta description (SEO)" variant="outlined"
                    value={(product as TProduct).pageDescription || ''}
                    className={styles.textField}
                    onChange={(e) => { handleChange('pageDescription', e.target.value) }}
                />
            )}
        </div>
    )
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

export default MainInfoCard;