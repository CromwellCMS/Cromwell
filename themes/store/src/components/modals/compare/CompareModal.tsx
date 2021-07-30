import { TAttribute, TStoreListItem } from '@cromwell/core';
import { getCStore, getGraphQLClient } from '@cromwell/core-frontend';
import { IconButton } from '@material-ui/core';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

import { appState } from '../../../helpers/AppState';
import { useForceUpdate } from '../../../helpers/forceUpdate';
import commonStyles from '../../../styles/common.module.scss';
import { CloseIcon } from '../../icons';
import { LoadBox } from '../../loadbox/Loadbox';
import { ProductCard } from '../../productCard/ProductCard';
import Modal from '../baseModal/Modal';
import styles from './CompareModal.module.scss';

export const CompareModal = observer(() => {
    const forceUpdate = useForceUpdate();
    const handleClose = () => {
        appState.isCompareOpen = false;
    }

    const [compare, setCompare] = useState<TStoreListItem[]>([]);
    const [attributes, setAttributes] = useState<TAttribute[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cstore = getCStore();

    const updateAttributes = async () => {
        try {
            const data = await getGraphQLClient()?.getAttributes();
            if (data) setAttributes(data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        /**
         * Since getCart method wll retrieve products from local storage and 
         * after a while products can be modified at the server, we need to refresh cart first  
         */
        if (appState.isCompareOpen) {
            (async () => {
                setIsLoading(true);
                await Promise.all([cstore.updateComparisonList(), updateAttributes()])
                const compare = cstore.getCompare()
                setCompare(compare);
                setIsLoading(false);
            })();
        }
    }, [appState.isCompareOpen]);

    useEffect(() => {
        cstore.onCompareUpdate(() => {
            const compare = cstore.getCompare();
            setCompare(compare);
            forceUpdate();
        }, 'CompareModal');
    }, []);

    return (
        <Modal
            className={clsx(commonStyles.center)}
            open={appState.isCompareOpen}
            onClose={handleClose}
            blurSelector={"#CB_root"}
        >
            <div className={clsx(styles.compareModal)}>
                <IconButton onClick={handleClose} className={styles.closeBtn}>
                    <CloseIcon />
                </IconButton>
                {isLoading && (
                    <LoadBox />
                )}
                {!isLoading && (
                    <>
                        <h3 className={styles.modalTitle}>Compare</h3>
                        <div className={styles.compareList}>
                            {[...compare].reverse().map((it, i) => {
                                return (
                                    <ProductCard
                                        className={styles.productCard}
                                        attributes={attributes}
                                        key={i}
                                        data={it.product}
                                    />
                                )
                            })}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
});