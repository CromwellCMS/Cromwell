import { gql } from '@apollo/client';
import {
    EDBEntity,
    getRandStr,
    resolvePageRoute,
    serviceLocator,
    TCoupon,
    TCouponInput,
    TPagedParams,
    TProduct,
    TProductCategory,
} from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { ArrowBack as ArrowBackIcon, OpenInNew as OpenInNewIcon, SmartButton as SmartButtonIcon } from '@mui/icons-material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Button, Grid, IconButton, InputAdornment, SelectChangeEvent, Skeleton, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Autocomplete from '../../components/autocomplete/Autocomplete';
import LoadBox from '../../components/loadBox/LoadBox';
import { Select } from '../../components/select/Select';
import { toast } from '../../components/toast/toast';
import { couponPageInfo } from '../../constants/PageInfos';
import { getCustomMetaFor, getCustomMetaKeysFor, RenderCustomFields } from '../../helpers/customFields';
import { handleOnSaveError } from '../../helpers/handleErrors';
import { NumberFormatCustom } from '../../helpers/NumberFormatCustom';
import commonStyles from '../../styles/common.module.scss';
import styles from './Coupon.module.scss';


const CouponPage = () => {
    const { id: couponId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [data, setData] = useState<TCoupon | null>(null);
    const [pickedCategories, setPickedCategories] = useState<TProductCategory[] | null>(null);
    const [pickedProducts, setPickedProducts] = useState<TProduct[] | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [couponLoading, setCouponLoading] = useState<boolean>(false);
    const history = useHistory();
    const [canValidate, setCanValidate] = useState(false);

    const getCouponData = async (id: number) => {
        let couponData: TCoupon;
        try {
            couponData = await client.getCouponById(id,
                gql`
                    fragment AdminPanelCouponFragment on Coupon {
                        id
                        createDate
                        updateDate
                        pageTitle
                        pageDescription
                        meta {
                            keywords
                        }
                        isEnabled
                        discountType
                        value
                        code
                        description
                        allowFreeShipping
                        minimumSpend
                        maximumSpend
                        categoryIds
                        productIds
                        expiryDate
                        usageLimit
                        customMeta (keys: ${JSON.stringify(getCustomMetaKeysFor(EDBEntity.Coupon))})
                    }`, 'AdminPanelCouponFragment');
            if (couponData) {
                setData(couponData);
            }
        } catch (e) {
            console.error(e)
        }

        if (!couponData) {
            setNotFound(true);
        }
        return couponData;
    }

    const init = async () => {
        setCouponLoading(true);

        let couponData: TCoupon;

        if (couponId && couponId !== 'new') {
            couponData = await getCouponData(parseInt(couponId));
        }

        if (couponId === 'new') {
            setData({} as any);
        }

        setCouponLoading(false);


        if (couponData?.categoryIds?.length) {
            const categories = await Promise.all(couponData.categoryIds.map(async id => {
                try {
                    return await client.getProductCategoryById(Number(id));
                } catch (error) {
                    console.error(error);
                }
            }));
            setPickedCategories(categories ?? []);
        } else setPickedCategories([]);

        if (couponData?.productIds?.length) {
            const products = await Promise.all(couponData.productIds.map(async id => {
                try {
                    return await client.getProductById(Number(id));
                } catch (error) {
                    console.error(error);
                }
            }));
            setPickedProducts(products ?? []);
        } else setPickedProducts([]);
    }

    useEffect(() => {
        init();
    }, []);

    const handleSave = async () => {
        setCanValidate(true);
        if (!data?.code || !data.value || !data.discountType) return;

        setIsSaving(true);

        const inputData: TCouponInput = {
            slug: data.slug,
            pageTitle: data.pageTitle,
            pageDescription: data.pageDescription,
            meta: data.meta && {
                keywords: data.meta.keywords,
            },
            isEnabled: data.isEnabled,
            discountType: data.discountType,
            value: data.value,
            code: data.code,
            description: data.description,
            allowFreeShipping: data.allowFreeShipping,
            minimumSpend: data.minimumSpend,
            maximumSpend: data.maximumSpend,
            categoryIds: data.categoryIds,
            productIds: data.productIds,
            expiryDate: data.expiryDate,
            usageLimit: data.usageLimit,
            customMeta: Object.assign({}, data.customMeta, await getCustomMetaFor(EDBEntity.Coupon)),
        }

        if (couponId === 'new') {
            try {
                const newData = await client?.createCoupon(inputData);
                toast.success('Created coupon!');
                history.replace(`${couponPageInfo.baseRoute}/${newData.id}`)
                await getCouponData(newData.id);
            } catch (e) {
                toast.error('Failed to create coupon');
                handleOnSaveError(e);
                console.error(e);
            }
        } else {
            try {
                await client?.updateCoupon(data.id, inputData);
                await getCouponData(data.id);
                toast.success('Saved!');
            } catch (e) {
                toast.error('Failed to save');
                handleOnSaveError(e);
                console.error(e)
            }
        }
        setIsSaving(false);
        setCanValidate(false);
    }

    const handleInputChange = (prop: keyof TCoupon, val: any) => {
        if (data) {
            setData((prevData) => {
                const newData = Object.assign({}, prevData);
                (newData[prop] as any) = val;
                return newData;
            });
        }
    }

    const handleGenerateCode = () => {
        handleInputChange('code', getRandStr(8).toUpperCase());
    }

    const handleSearchCategory = async (text: string, params: TPagedParams<TProductCategory>) => {
        return client?.getFilteredProductCategories({
            filterParams: {
                nameSearch: text
            },
            pagedParams: params
        });
    }

    const handleSearchProduct = async (text: string, params: TPagedParams<TProduct>) => {
        return client?.getFilteredProducts({
            filterParams: {
                nameSearch: text
            },
            pagedParams: params
        });
    }

    const refetchMeta = async () => {
        if (!couponId) return;
        const data = await getCouponData(parseInt(couponId));
        return data?.customMeta;
    };

    if (notFound) {
        return (
            <div className={styles.CouponPage}>
                <div className={styles.notFoundPage}>
                    <p className={styles.notFoundText}>Coupon not found</p>
                </div>
            </div>
        )
    }

    let pageFullUrl;
    if (data) {
        pageFullUrl = serviceLocator.getFrontendUrl() + resolvePageRoute('coupon', { slug: data.slug ?? data.id + '' });
    }

    return (
        <div className={styles.CouponPage}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <IconButton
                        onClick={() => window.history.back()}
                    >
                        <ArrowBackIcon style={{ fontSize: '18px' }} />
                    </IconButton>
                    <p className={commonStyles.pageTitle}>coupon</p>
                </div>
                <div className={styles.headerActions}>
                    {pageFullUrl && (
                        <Tooltip title="Open coupon in the new tab">
                            <IconButton
                                style={{ marginRight: '10px' }}
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
                        size="small"
                        disabled={isSaving}
                        onClick={handleSave}>Save</Button>
                </div>
            </div>
            <div className={styles.fields}>
                {couponLoading && (
                    Array(8).fill(1).map((it, index) => (
                        <Skeleton style={{ marginBottom: '10px' }} key={index} height={"50px"} />
                    ))
                )}
                {!couponLoading && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Code"
                                value={data?.code || ''}
                                fullWidth
                                variant="standard"
                                className={styles.textField}
                                onChange={(e) => { handleInputChange('code', e.target.value) }}
                                error={canValidate && !data?.code}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title="Generate code">
                                                <IconButton
                                                    aria-label="Generate code"
                                                    onClick={handleGenerateCode}
                                                    edge="end"
                                                >
                                                    {<SmartButtonIcon />}
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}></Grid>
                        <Grid item xs={12} sm={6}>
                            <Select
                                fullWidth
                                variant="standard"
                                label="Discount type"
                                value={(data?.discountType ?? '')}
                                onChange={(event: SelectChangeEvent<unknown>) => {
                                    handleInputChange('discountType', event.target.value)
                                }}
                                error={canValidate && !data?.discountType}
                                options={[
                                    {
                                        value: 'fixed',
                                        label: 'Fixed'
                                    },
                                    {
                                        value: 'percentage',
                                        label: 'Percentage'
                                    }
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Discount value"
                                className={styles.textField}
                                fullWidth
                                variant="standard"
                                value={data?.value || ''}
                                error={canValidate && !data?.value}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (!isNaN(val)) handleInputChange('value', val);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                label="Description"
                                className={styles.textField}
                                fullWidth
                                multiline
                                variant="standard"
                                value={data?.description || ''}
                                onChange={(e) => { handleInputChange('description', e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Cart total minimum"
                                className={styles.textField}
                                fullWidth
                                multiline
                                variant="standard"
                                value={data?.minimumSpend || ''}
                                onChange={(e) => { handleInputChange('minimumSpend', e.target.value) }}
                                InputProps={{
                                    inputComponent: NumberFormatCustom as any,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Cart total maximum"
                                className={styles.textField}
                                fullWidth
                                multiline
                                variant="standard"
                                value={data?.maximumSpend || ''}
                                onChange={(e) => { handleInputChange('maximumSpend', e.target.value) }}
                                InputProps={{
                                    inputComponent: NumberFormatCustom as any,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Expiry date"
                                    value={data?.expiryDate}
                                    onChange={(newValue) => {
                                        if (!newValue) {
                                            handleInputChange('expiryDate', null);
                                            return;
                                        }
                                        const date = new Date(newValue);
                                        if (isNaN(date.getTime())) {
                                            handleInputChange('expiryDate', null);
                                            return;
                                        }
                                        handleInputChange('expiryDate', date);
                                    }}
                                    renderInput={(params) => <TextField
                                        variant="standard"
                                        fullWidth
                                        {...params}
                                    />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Usage limit"
                                className={styles.textField}
                                fullWidth
                                variant="standard"
                                value={data?.usageLimit || ''}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (!isNaN(val)) handleInputChange('usageLimit', val);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            {pickedCategories ? (
                                <Autocomplete<TProductCategory>
                                    multiple
                                    loader={handleSearchCategory}
                                    onSelect={(data: TProductCategory[]) => {
                                        if (!data?.length) handleInputChange('categoryIds', null);
                                        else handleInputChange('categoryIds', data.map(cat => cat.id));
                                    }}
                                    getOptionLabel={(data) => `${data.name} (id: ${data.id}${data?.parent?.id ? `; parent id: ${data.parent.id}` : ''})`}
                                    getOptionValue={(data) => data.name}
                                    fullWidth
                                    className={styles.textField}
                                    defaultValue={pickedCategories}
                                    label={"Categories"}
                                />
                            ) : <LoadBox size={30} />}
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            {pickedProducts ? (
                                <Autocomplete<TProduct>
                                    multiple
                                    loader={handleSearchProduct}
                                    onSelect={(data: TProduct[]) => {
                                        if (!data?.length) handleInputChange('productIds', null);
                                        else handleInputChange('productIds', data.map(cat => cat.id));
                                    }}
                                    getOptionLabel={(data) => `${data.name} (id: ${data.id})`}
                                    getOptionValue={(data) => data.name}
                                    fullWidth
                                    className={styles.textField}
                                    defaultValue={pickedProducts}
                                    label={"Products"}
                                />
                            ) : <LoadBox size={30} />}
                        </Grid>
                        <Grid item xs={12} >
                            {data && (
                                <RenderCustomFields
                                    entityType={EDBEntity.Coupon}
                                    entityData={data}
                                    refetchMeta={refetchMeta}
                                />
                            )}
                        </Grid>
                    </Grid>
                )}
            </div>
        </div>
    )
}


export default CouponPage;