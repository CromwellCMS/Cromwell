import { EDBEntity, TProduct, TProductReview, TProductReviewFilter } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import {
    Done as DoneIcon,
    HourglassEmpty as HourglassEmptyIcon,
    ThumbUp as ThumbUpIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { IconButton, Rating, Tooltip } from '@mui/material';
import React, { useRef, useState } from 'react';

import EntityTable from '../../components/entity/entityTable/EntityTable';
import { IEntityListPage, TEntityPageProps } from '../../components/entity/types';
import Modal from '../../components/modal/Modal';
import { toast } from '../../components/toast/toast';
import { reviewListPageInfo } from '../../constants/PageInfos';
import ProductListItem from '../productList/ProductListItem';
import styles from './ReviewListItem.module.scss';

const EntityTableComp = EntityTable as React.ComponentType<TEntityPageProps<TProductReview, TProductReviewFilter>>;

export default function ProductReviewTable() {
    const client = getGraphQLClient();
    const [itemToView, setItemToView] = useState<TProductReview | null>(null);
    const approvedToast = useRef<number | string | null>(null);
    const [productToView, setProductToView] = useState<TProduct | null>(null);
    const entityListPageRef = useRef<IEntityListPage<TProductReviewFilter> | null>(null);

    const ellipsisStyle: React.CSSProperties = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }

    const handleApproveReview = async (data: TProductReview, inst?: React.Component<any>): Promise<boolean> => {
        const review = await client.getProductReviewById(data.id);
        try {
            await client?.updateProductReview(data.id, {
                productId: review.productId,
                title: review.title,
                description: review.description,
                rating: review.rating,
                userName: review.userName,
                userId: review.userId,
                approved: true,
            });
            if (approvedToast.current) {
                toast.dismiss(approvedToast.current);
            }
            approvedToast.current = toast.success('Approved!');

            if (inst) {
                inst.props.data.approved = true;
                inst.forceUpdate();
            }
            return true;
        } catch (e) {
            toast.error('Failed to save');
            console.error(e);
            return false;
        }
    }

    const handleOpenReview = async (data: TProductReview) => {
        const review = await client.getProductReviewById(data.id);
        const product = await client.getProductById(review.productId);
        setItemToView(review);
        if (product) {
            setProductToView(product);
        }
    }

    return (
        <>
            <EntityTableComp
                entityCategory={EDBEntity.ProductReview}
                entityListRoute={reviewListPageInfo.route}
                listLabel="Product reviews"
                getManyFiltered={client.getFilteredProductReviews}
                deleteOne={client.deleteProductReview}
                deleteMany={client.deleteManyProductReviews}
                deleteManyFiltered={client.deleteManyFilteredProductReviews}
                getPageListInstance={inst => {
                    entityListPageRef.current = inst;
                }}
                columns={[
                    {
                        name: 'userName',
                        label: 'Name',
                        type: 'Simple text',
                        visible: true,
                    },
                    {
                        name: 'rating',
                        label: 'Rating',
                        type: 'Rating',
                        visible: true,
                        exactSearch: true,
                    },
                    {
                        name: 'createDate',
                        label: 'Created',
                        type: 'Datetime',
                        visible: true,
                    },
                    {
                        name: 'productId',
                        label: 'Product ID',
                        type: 'Simple text',
                        exactSearch: true,
                        visible: true,
                    },
                    {
                        name: 'approved',
                        label: 'Status',
                        type: 'Simple text',
                        visible: true,
                        exactSearch: true,
                        searchOptions: [
                            {
                                label: 'Approved',
                                value: true,
                            },
                            {
                                label: 'Pending',
                                value: false,
                            },
                        ],
                        getValueView: (value: boolean) => (
                            <p style={ellipsisStyle} className={styles.status}>{value ? <DoneIcon /> : <HourglassEmptyIcon />} {value ? 'Approved' : 'Pending'}</p>
                        )
                    },
                    {
                        name: 'id',
                        label: 'ID',
                        type: 'Simple text',
                        exactSearch: true,
                        visible: false,
                    },
                    {
                        name: 'title',
                        label: 'Title',
                        type: 'Simple text',
                        visible: false,
                    },
                    {
                        name: 'userEmail',
                        label: 'Email',
                        type: 'Simple text',
                        visible: false,
                    },
                    {
                        name: 'userId',
                        label: 'User ID',
                        type: 'Simple text',
                        visible: false,
                    },
                    {
                        name: 'updateDate',
                        label: 'Updated',
                        type: 'Datetime',
                        visible: false,
                    },
                ]}
                customElements={{
                    getListItemActions: (entity, inst) => {
                        return (
                            <>
                                {!entity?.approved && (
                                    <Tooltip title="Approve">
                                        <IconButton
                                            aria-label="view"
                                            onClick={() => handleApproveReview(entity, inst)}
                                        >
                                            <ThumbUpIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                <Tooltip title="Open">
                                    <IconButton
                                        aria-label="view"
                                        onClick={() => handleOpenReview(entity)}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )
                    }
                }}
            />
            <Modal
                open={!!itemToView}
                onClose={() => {
                    setItemToView(null);
                    setProductToView(null);
                }}
                blurSelector="#root"
            >
                <div className={styles.itemToView}>
                    <div className={styles.itemToViewHeader}>
                        <p className={styles.userName}>{itemToView?.userName}</p>
                        <Rating name="read-only"
                            className={styles.rating}
                            value={itemToView?.rating}
                            precision={0.5}
                            readOnly />
                    </div>
                    <h4 className={styles.title}>{itemToView?.title}</h4>
                    <p className={styles.description}>{itemToView?.description}</p>
                    {!itemToView?.approved && (
                        <Tooltip title="Approve">
                            <IconButton
                                className={styles.approveBtn}
                                aria-label="view"
                                onClick={async () => {
                                    const success = await handleApproveReview(itemToView);
                                    if (success) {
                                        itemToView.approved = true;
                                        setItemToView({ ...itemToView });
                                        entityListPageRef.current?.resetList();
                                    }
                                }}
                            >
                                <ThumbUpIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {productToView && (
                        <div className={styles.productToView}>
                            <ProductListItem
                                embedded={true}
                                data={productToView}
                                listItemProps={{
                                    handleDeleteProductBtnClick: () => null,
                                    toggleSelection: () => null,
                                }}
                            />
                        </div>
                    )}

                </div>
            </Modal>
        </>
    )
}