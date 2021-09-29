import { resolvePageRoute, serviceLocator, TAttributeProductVariant, TProduct } from '@cromwell/core';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useRef } from 'react';

import GalleryPicker from '../../components/galleryPicker/GalleryPicker';
import { getEditorData, getEditorHtml, initTextEditor } from '../../helpers/editor/editor';
import { useForceUpdate } from '../../helpers/forceUpdate';
import { NumberFormatCustom } from '../../helpers/NumberFormatCustom';
import { editorId, TInfoCardRef } from './Product';
import styles from './Product.module.scss';


const MainInfoCard = (props: {
    product: TAttributeProductVariant | TProduct,
    setProdData: (data: TProduct) => void;
    isProductVariant?: boolean;
    productVariantVal?: string;
    infoCardRef?: React.MutableRefObject<TInfoCardRef>;
}) => {
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

    const fullSave = async () => {
        setProdData({
            ...(product as TProduct),
            description: await getEditorHtml(editorId),
            descriptionDelta: JSON.stringify(await getEditorData(editorId)),
        });
    }

    if (props.infoCardRef) props.infoCardRef.current = {
        save: async () => await fullSave(),
    };

    const productVariantVal = useRef(props.productVariantVal);
    const isNewVariant = productVariantVal.current !== props.productVariantVal;
    if (isNewVariant) {
        productVariantVal.current = props.productVariantVal;
    }

    useEffect(() => {
        init();

        // Save editor content on close
        return () => {
            fullSave();
        }
    }, [])

    const init = async () => {
        let descriptionDelta;
        if (product?.descriptionDelta) {
            try {
                descriptionDelta = JSON.parse(product.descriptionDelta);
            } catch (e) { console.error(e) }
        }

        await initTextEditor({
            htmlId: editorId,
            data: descriptionDelta,
            placeholder: 'Product description...',
        });
    }

    const handleChange = (prop: keyof TProduct, val: any) => {
        if (product) {
            const prod = Object.assign({}, product);
            (prod[prop] as any) = val;

            if (prop === 'images') {
                prod.mainImage = val?.[0];
            }
            setProdData(prod as TProduct);
        }
    }

    if (!product) return null;

    let pageFullUrl;
    if ((product as TProduct)?.slug) {
        pageFullUrl = serviceLocator.getFrontendUrl() + resolvePageRoute('product', {
            slug: (product as TProduct).slug ?? (product as TProduct).id,
        });
    }

    return (
        <div>
            <TextField label="Name" variant="outlined"
                value={product.name ?? ''}
                className={styles.textField}
                onChange={(e) => { handleChange('name', e.target.value) }}
            />
            <TextField label="Price" variant="outlined"
                value={product.price ?? ''}
                className={styles.textField}
                onChange={(e) => { handleChange('price', e.target.value) }}
                InputProps={{
                    inputComponent: NumberFormatCustom as any,
                }}
            />
            <TextField label="Old price" variant="outlined"
                value={product.oldPrice ?? ''}
                className={styles.textField}
                onChange={(e) => {
                    const val = e.target.value;
                    handleChange('oldPrice', (val && val !== '') ? val : null);
                }}
                InputProps={{
                    inputComponent: NumberFormatCustom as any,
                }}
            />
            <TextField label="SKU" variant="outlined"
                value={product.sku ?? ''}
                className={styles.textField}
                onChange={(e) => { handleChange('sku', e.target.value) }}
            />
            <div className={styles.imageBlock}>
                <GalleryPicker
                    classes={{
                        imagePicker: {
                            root: styles.imageItem
                        }
                    }}
                    images={((product as TProduct)?.images ?? []).map(src => ({ src }))}
                    onChange={(val) => handleChange('images', val.map(s => s.src))}
                />
            </div>
            <div className={styles.descriptionEditor} >
                <div id={editorId}></div>
            </div>
            {props.isProductVariant !== true && (
                <TextField label="Page URL" variant="outlined"
                    value={(product as TProduct).slug ?? ''}
                    className={styles.textField}
                    onChange={(e) => { handleChange('slug', e.target.value) }}
                    helperText={pageFullUrl}
                />
            )}
            {props.isProductVariant !== true && (
                <TextField label="Meta title" variant="outlined"
                    value={(product as TProduct).pageTitle ?? ''}
                    className={styles.textField}
                    onChange={(e) => { handleChange('pageTitle', e.target.value) }}
                />
            )}
            {props.isProductVariant !== true && (
                <TextField label="Meta description" variant="outlined"
                    value={(product as TProduct).pageDescription ?? ''}
                    className={styles.textField}
                    onChange={(e) => { handleChange('pageDescription', e.target.value) }}
                />
            )}
            {props.isProductVariant !== true && (
                <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    className={styles.textField}
                    value={((product as TProduct).meta?.keywords ?? []) as any}
                    getOptionLabel={(option) => option}
                    onChange={(e, newVal) => {
                        handleChange('meta', {
                            ...((product as TProduct).meta ?? {}),
                            keywords: newVal
                        })
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Meta keywords"
                        />
                    )}
                />
            )}
        </div>
    )
}

export default MainInfoCard;