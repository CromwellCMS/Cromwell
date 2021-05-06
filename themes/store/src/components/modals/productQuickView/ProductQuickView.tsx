import { TAttribute, TProduct } from '@cromwell/core';
import { IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import React from 'react';

import commonStyles from '../../../styles/common.module.scss';
import ProductDetails from '../../productDetails/ProductDetails';
import Modal from '../baseModal/Modal';
import styles from './ProductQuickView.module.scss';

export default function ProductQuickView(props: {
    onClose: () => void;
    open: boolean;
    product?: TProduct | null;
    attributes?: TAttribute[];
}) {
    return (
        <Modal
            className={commonStyles.center}
            open={props.open}
            onClose={props.onClose}
            blurSelector={"#CB_root"}
        >
            <div className={styles.ProductQuickView}>
                <IconButton onClick={props.onClose} className={styles.closeBtn}>
                    <CloseIcon />
                </IconButton>
                <ProductDetails
                    compact={true}
                    product={props.product}
                    attributes={props.attributes}
                />
            </div>
        </Modal>
    )
}