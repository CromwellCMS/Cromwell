import { TAttribute, TProduct } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

import { appState } from '../../../helpers/AppState';
import commonStyles from '../../../styles/common.module.scss';
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
            console.error(e);
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
                {isLoading && (
                    <LoadBox />
                )}
                {!isLoading && (
                    <>
                        <IconButton onClick={handleClose} className={styles.closeBtn}>
                            <CloseIcon />
                        </IconButton>
                        <ProductDetails
                            compact={true}
                            product={product}
                            attributes={attributes}
                        />
                    </>
                )}
            </div>
        </Modal>
    )
})

export default ProductQuickView;
