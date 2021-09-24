import { TAttribute, TProduct } from '@cromwell/core';
import { getGraphQLClient, getGraphQLErrorInfo } from '@cromwell/core-frontend';
import { IconButton } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

import { appState } from '../../../helpers/AppState';
import commonStyles from '../../../styles/common.module.scss';
import { CloseIcon } from '../../icons';
import { LoadBox } from '../../loadbox/Loadbox';
import ProductDetails from '../../productDetails/ProductDetails';
import Modal from '../baseModal/Modal';
import styles from './ProductQuickView.module.scss';

const ProductQuickView = observer(() => {
    const [attributes, setAttributes] = useState<TAttribute[]>([]);
    const [product, setProduct] = useState<TProduct | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleClose = () => {
        appState.isQuickViewOpen = false;
    }

    const updateAttributes = async () => {
        setIsLoading(true);
        try {
            if (!appState.quickViewProductId) return;

            const [attrs, prod] = await Promise.all([
                getGraphQLClient()?.getAttributes(),
                getGraphQLClient()?.getProductById(appState.quickViewProductId)
            ])
            if (prod) setProduct(prod);
            if (attrs) setAttributes(attrs);
        } catch (e) {
            console.error(getGraphQLErrorInfo(e));
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (appState.isQuickViewOpen) {
            updateAttributes();
        }
    }, [appState.isQuickViewOpen]);

    return (
        <Modal
            className={commonStyles.center}
            open={appState.isQuickViewOpen}
            onClose={handleClose}
            blurSelector={"#CB_root"}
        >

            <div className={styles.ProductQuickView}>
                <IconButton onClick={handleClose} className={styles.closeBtn}>
                    <CloseIcon />
                </IconButton>
                <div className={styles.list}>
                    {isLoading && (
                        <LoadBox />
                    )}
                    {!isLoading && (
                        <>

                            <ProductDetails
                                compact={true}
                                product={product}
                                attributes={attributes}
                            />
                        </>
                    )}
                </div>
            </div>
        </Modal>
    )
})

export default ProductQuickView;
