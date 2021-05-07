import { TAttribute, TStoreListItem } from '@cromwell/core';
import { getCStore, getGraphQLClient } from '@cromwell/core-frontend';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { appState } from '../../../helpers/AppState';
import { useForceUpdate } from '../../../helpers/forceUpdate';
import { LoadBox } from '../../loadbox/Loadbox';
import commonStyles from '../../../styles/common.module.scss';
import { ProductCard } from '../../productCard/ProductCard';
import Modal from '../baseModal/Modal';
import styles from './WatchedModal.module.scss';

export const WatchedModal = observer(() => {
    const forceUpdate = useForceUpdate();
    const handleClose = () => {
        appState.isWatchedOpen = false;
    }

    const [list, setList] = useState<TStoreListItem[]>([]);
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
        if (appState.isWatchedOpen) {
            (async () => {
                setIsLoading(true);
                await Promise.all([cstore.updateWatchedItems(), updateAttributes()])
                const watched = cstore.getWatchedItems()
                setList(watched);
                setIsLoading(false);
            })();
        }
    }, [appState.isWatchedOpen]);

    useEffect(() => {
        cstore.onWathcedItemsUpdate(() => {
            const watched = cstore.getWatchedItems();
            setList(watched);
            forceUpdate();
        }, 'WatchedModal');
    }, []);

    return (
        <Modal
            className={clsx(commonStyles.center)}
            open={appState.isWatchedOpen}
            onClose={handleClose}
            blurSelector={"#CB_root"}
        >
            <div className={clsx(styles.watchedtModal)}>
                <IconButton onClick={handleClose} className={styles.closeBtn}>
                    <CloseIcon />
                </IconButton>
                {isLoading && (
                    <LoadBox />
                )}
                {!isLoading && (
                    <div className={styles.watched}>
                        <h3 className={styles.modalTitle}>Watched Items</h3>
                        {[...list].reverse().map((it, i) => {
                            return (
                                <ProductCard
                                    className={styles.prductCard}
                                    attributes={attributes}
                                    key={i}
                                    data={it.product}
                                    variant='list'
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </Modal>
    )
});