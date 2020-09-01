import React from 'react';
import { getGraphQLClient, CList } from '@cromwell/core-frontend';
import { TProduct, TPagedList } from '@cromwell/core';
import { productInfo } from '../../constants/PageInfos';
import LoadBox from '../../components/loadBox/LoadBox';
import { Link } from 'react-router-dom';
import styles from './ProductList.module.scss';
import {
    IconButton,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import {
    AddCircle as AddCircleIcon, ExpandMore as ExpandMoreIcon,
    HighlightOff as HighlightOffIcon,
    DeleteForever as DeleteForeverIcon,
    Edit as EditIcon
} from '@material-ui/icons';



const ProductList = () => {
    const client = getGraphQLClient();
    return (
        <div className={styles.ProductList}>
            <div className={styles.productListHeader}>
                <div style={{ width: '10%' }}>
                    <p>id</p>
                </div>
                <div style={{ width: '100%' }}>
                    <p>title</p>
                </div>
                <div style={{ width: '10%' }}>
                    <IconButton
                        aria-label="add"
                    >
                        <AddCircleIcon />
                    </IconButton>
                </div>
            </div>
            <CList<TProduct>
                className={styles.productListWrapper}
                id="Admin_ProductsList"
                ListItem={ProductItem}
                useAutoLoading
                usePagination
                useQueryPagination
                loader={(params) => {
                    return client?.getProducts(params);
                }}
                cssClasses={{ scrollBox: styles.list }}
                elements={{
                    pagination: (props) => {
                        return (
                            <Pagination count={props.count} page={props.page}
                                onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                                    props.onChange(value)
                                }}
                                className={styles.pagination}
                                showFirstButton showLastButton
                            />
                        )
                    },
                    preloader: <LoadBox />
                }}
            />
        </div>
    )
}

export default ProductList;

type TProductItemProps = {
    data?: TProduct;
}

const ProductItem = (props: TProductItemProps) => {
    // console.log('ProductItem::props', props)
    return (
        <div className={styles.productItem}>
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