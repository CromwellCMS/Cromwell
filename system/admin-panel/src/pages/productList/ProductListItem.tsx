import { TProduct } from '@cromwell/core';
import { IconButton } from '@material-ui/core';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon } from '@material-ui/icons';
import React from 'react';
import { Link } from 'react-router-dom';

import { productInfo } from '../../constants/PageInfos';
import styles from './ProductList.module.scss';
import commonStyles from '../../styles/common.module.scss';


export type TProductItemProps = {
    data?: TProduct;
}

export const ProductListItem = (props: TProductItemProps) => {
    // console.log('ProductItem::props', props)
    return (
        <div className={styles.listItem}>
            {props.data && (
                <>
                    <div style={{ width: '10%' }}>
                        <p>{props.data?.id}</p>
                    </div>
                    <div style={{ width: '100%' }}>
                        <p>{props.data?.name}</p>
                    </div>
                    <div style={{ width: '10%' }}>
                        <Link to={`${productInfo.baseRoute}/${props.data?.id}`}>
                            <IconButton
                                aria-label="edit"
                            >
                                <EditIcon />
                            </IconButton>
                        </Link>
                    </div>
                    <div style={{ width: '10%' }}>
                        <IconButton
                            aria-label="delete"
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    </div>
                </>
            )}
        </div>
    )
}