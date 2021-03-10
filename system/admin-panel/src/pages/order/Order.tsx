import { TOrder, TOrderInput } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button, TextField, IconButton } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderListPageInfo } from '../../constants/PageInfos';

import { toast } from '../../components/toast/toast';
import styles from './Order.module.scss';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

const OrderPage = () => {
    const { id: orderId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [data, setData] = useState<TOrder | undefined>(undefined);
    const [notFound, setNotFound] = useState(false);

    const getOrderData = async () => {
        let orderData;
        try {
            orderData = await client.getOrderById(orderId);
            if (orderData) setData(orderData);
        } catch (e) {
            console.error(e)
        }

        if (!orderData) {
            setNotFound(true);
        }
    }

    useEffect(() => {
        getOrderData();
    }, []);

    const handleSave = async () => {
        if (data) {
            const inputData: TOrderInput = {
                status: data.status,
                cart: data.cart,
                totalPrice: data.totalPrice,
                oldTotalPrice: data.oldTotalPrice,
                totalQnt: data.totalQnt,
                userId: data.userId,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                customerAddress: data.customerAddress,
                customerComment: data.customerComment,
                shippingMethod: data.shippingMethod,
            }
            try {
                await client?.updateOrder(data.id, inputData);
                await getOrderData();
                toast.success('Saved!');
            } catch (e) {
                toast.error('Falied to save');
                console.error(e)
            }
        }
    }

    const handleInputChange = (prop: keyof TOrder, val: any) => {
        if (data) {
            const newData = Object.assign({}, data);
            (newData[prop] as any) = val;
            setData(newData);
        }
    }

    if (notFound) {
        return (
            <div className={styles.OrderPage}>
                <div className={styles.notFoundPage}>
                    <p className={styles.notFoundText}>Post not found</p>
                </div>
            </div>
        )
    }

    const statuses = ['Awaiting shipment', 'Shipped', 'Refunded', 'Cancelled', 'Completed',]

    return (
        <div className={styles.OrderPage}>
            <div className={styles.header}>
                <div>
                    <Link to={orderListPageInfo.route}>
                        <IconButton
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Link>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="small"
                        onClick={handleSave}>Update</Button>
                </div>
            </div>
            <div className={styles.fields}>
                <Autocomplete
                    value={data?.status ?? statuses[0]}
                    onChange={(event: any, newValue: string | null) => {
                        handleInputChange('status', newValue);
                    }}
                    options={statuses}
                    getOptionLabel={(option) => option}
                    className={styles.textField}
                    fullWidth
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params}
                        label="Status"
                        fullWidth
                    />}
                />
                <TextField label="Name"
                    value={data?.customerName || ''}
                    fullWidth
                    className={styles.textField}
                    onChange={(e) => { handleInputChange('customerName', e.target.value) }}
                />
                <TextField label="Phone"
                    value={data?.customerPhone || ''}
                    fullWidth
                    className={styles.textField}
                    onChange={(e) => { handleInputChange('customerPhone', e.target.value) }}
                />
                <TextField label="Address"
                    value={data?.customerAddress || ''}
                    fullWidth
                    className={styles.textField}
                    onChange={(e) => { handleInputChange('customerAddress', e.target.value) }}
                />
                <TextField label="Comment"
                    value={data?.customerComment || ''}
                    fullWidth
                    className={styles.textField}
                    onChange={(e) => { handleInputChange('customerComment', e.target.value) }}
                />
                <TextField label="Created"
                    value={toLocaleDateString(data?.createDate)}
                    fullWidth
                    className={styles.textField}
                />
                <TextField label="Last updated"
                    value={toLocaleDateString(data?.updateDate)}
                    fullWidth
                    className={styles.textField}
                />
            </div>
        </div>
    )
}


export default OrderPage;

const toLocaleDateString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
