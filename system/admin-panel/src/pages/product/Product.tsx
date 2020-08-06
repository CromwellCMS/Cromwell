import React, { useEffect, useState } from 'react';
import {
    useParams
} from "react-router-dom";
import { TProduct, TPagedList, TProductInput } from '@cromwell/core';
import styles from './Product.module.scss';
import LoadBox from '../../components/loadBox/LoadBox';
import {
    createStyles, makeStyles, Theme, Card,
    CardActionArea,
    CardActions,
    Collapse,
    IconButton,
    TextField,
    MenuItem,
    Button,
    CircularProgress
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import {
    AddCircleOutline as AddCircleOutlineIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Edit as EditIcon,
    HighlightOff as HighlightOffIcon,
    OpenInNew as OpenInNewIcon
} from '@material-ui/icons';
import { getGraphQLClient, getGlobalCurrencySymbol, CGallery } from '@cromwell/core-frontend';


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
            prefix={getGlobalCurrencySymbol()}
        />
    );
}

const ProductPage = () => {
    const { id } = useParams();
    const client = getGraphQLClient();
    const [product, setProdData] = useState<TProduct | null>(null);
    const [isLoading, setIsloading] = useState(false);

    useEffect(() => {
        (async () => {
            setIsloading(true);
            try {
                const prod = await client.getProductById(id, true);
                setProdData(prod);
            } catch (e) { console.log(e) }

            setIsloading(false);
        })();
    }, []);

    const handleChange = (prop: keyof TProduct, val: any) => {
        if (product) {
            const prod: TProduct = Object.assign({}, product);
            (prod[prop] as any) = val;
            setProdData(prod)
        }
    }

    const handleSave = () => {
        if (product) {
            const imput: TProductInput = {
                name: product.name,
                categoryIds: product.categories ? product.categories.map(c => c.id) : [],
                price: product.price,
                oldPrice: product.oldPrice,
                mainImage: product.mainImage,
                images: product.images,
                description: product.description,
            }
        }
    }

    return (
        <div className={styles.Product}>
            {/* <h2>Edit product</h2> */}
            <div className={styles.header}>
                <p>Product id: {id}</p>
                <IconButton
                    aria-label="open"
                    onClick={() => { if (product) window.open(`http://localhost:4128/product/${product.id}`, '_blank'); }}
                >
                    <OpenInNewIcon />
                </IconButton>
            </div>
            {isLoading && <LoadBox />}
            {product && (
                <>
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
                    <TextField label="Old price (before sale)" variant="outlined"
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
                        <CGallery id="CGallery" settings={{
                            images: product.images ? product.images.map((src, id) => ({ src, id })) : [],
                            height: '350px',
                            slidesPerView: 3,
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
                                                <IconButton
                                                    aria-label="make primary"
                                                    onClick={() => { console.log('show more') }}
                                                >
                                                    {isPrimary ? <StarIcon /> : <StarBorderIcon />}
                                                </IconButton>
                                                <IconButton
                                                    aria-label="change image"
                                                    onClick={() => { console.log('show more') }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="delete image"
                                                    onClick={() => { console.log('show more') }}
                                                >
                                                    <HighlightOffIcon />
                                                </IconButton>
                                            </div>
                                            {props.children}
                                        </div>
                                    )
                                }
                            }
                        }} />
                    </div>
                    <TextField label="HTML Description" variant="outlined"
                        value={product.description || ''}
                        className={styles.textField}
                        multiline
                        // rows={4}
                        onChange={(e) => { handleChange('description', e.target.value) }}
                    />
                    <TextField label="SEO URL" variant="outlined"
                        value={product.slug || ''}
                        className={styles.textField}
                        onChange={(e) => { handleChange('slug', e.target.value) }}
                    />
                    <TextField label="SEO Title" variant="outlined"
                        value={product.pageTitle || ''}
                        className={styles.textField}
                        onChange={(e) => { handleChange('pageTitle', e.target.value) }}
                    />
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="large"
                        onClick={async () => {
                            setIsloading(true);


                            setIsloading(false);
                        }}>
                        Save
                        </Button>
                </>
            )}

        </div>
    )
}

export default ProductPage;
