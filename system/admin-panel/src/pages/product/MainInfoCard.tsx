import { serviceLocator, TAttributeProductVariant, TProduct } from '@cromwell/core';
import { TextField } from '@material-ui/core';
import { Quill as QuillType } from 'quill';
import React, { useEffect, useRef } from 'react';

import GalleryPicker from '../../components/galleryPicker/GalleryPicker';
import { useForceUpdate } from '../../helpers/forceUpdate';
import { NumberFormatCustom } from '../../helpers/NumberFormatCustom';
import { getQuillHTML, initQuillEditor } from '../../helpers/quill';
import { store } from '../../redux/store';
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

    const productVariantVal = useRef(props.productVariantVal);
    const isNewVariant = productVariantVal.current !== props.productVariantVal;
    const quillEditor = useRef<QuillType | null>(null);
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
        const Quill: any = await import('quill');
        quillEditor.current = initQuillEditor(Quill?.default, `#${editorId}`, descriptionDelta);
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

    const themeProductPage = store.getState()?.activeTheme?.defaultPages?.product;
    let pageFullUrl;
    if (themeProductPage && (product as TProduct)?.slug) {
        pageFullUrl = serviceLocator.getFrontendUrl() + '/' + themeProductPage.replace('[slug]', (product as TProduct).slug);
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
            <div className={styles.descriptionEditor}>
                <div style={{ maxHeight: '300px' }} id={editorId}></div>
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
        </div>
    )
}

export default MainInfoCard;