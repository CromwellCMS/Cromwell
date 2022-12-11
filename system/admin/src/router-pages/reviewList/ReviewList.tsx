import { EDBEntity, TProduct, TProductReview, TProductReviewFilter } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { BookOpenIcon, CheckBadgeIcon, CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Box, Rating, Tooltip } from '@mui/material';
import React, { useRef, useState } from 'react';

import { IconButton } from '../../components/buttons/IconButton';
import EntityTable from '../../components/entity/entityTable/EntityTable';
import { IEntityListPage } from '../../components/entity/types';
import Modal from '../../components/modal/Modal';
import { toast } from '../../components/toast/toast';
import { reviewListPageInfo } from '../../constants/PageInfos';
import { formatTimeAgo } from '../../helpers/time';
import ProductListItem from './ProductListItem';
import styles from './ReviewListItem.module.scss';

export default function ProductReviewTable() {
  const client = getGraphQLClient();
  const [itemToView, setItemToView] = useState<TProductReview | null>(null);
  const approvedToast = useRef<number | string | null>(null);
  const [productToView, setProductToView] = useState<TProduct | null>(null);
  const entityListPageRef = useRef<IEntityListPage<TProductReview, TProductReviewFilter> | null>(null);

  const ellipsisStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

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
  };

  const handleOpenReview = async (data: TProductReview) => {
    const review = await client.getProductReviewById(data.id);
    const product = await client.getProductById(review.productId);
    setItemToView(review);
    if (product) {
      setProductToView(product);
    }
  };

  return (
    <>
      <EntityTable
        entityCategory={EDBEntity.ProductReview}
        entityListRoute={reviewListPageInfo.route}
        listLabel="Product reviews"
        entityLabel="Review"
        hideAddNew
        getMany={client.getProductReviews}
        deleteOne={client.deleteProductReview}
        deleteMany={client.deleteManyProductReviews}
        getPageListInstance={(inst) => {
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
            getValueView: (value) => formatTimeAgo(value),
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
              <p style={ellipsisStyle} className={styles.status}>
                {value ? <CheckIcon /> : <ClockIcon />} {value ? 'Approved' : 'Pending'}
              </p>
            ),
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
            getValueView: (value) => formatTimeAgo(value),
          },
        ]}
        getItemCustomActions={(entity, inst) => {
          return (
            <Box display="flex" alignItems="center">
              {!entity?.approved && (
                <Tooltip title="Approve">
                  <span>
                    <IconButton onClick={() => handleApproveReview(entity, inst)}>
                      <CheckBadgeIcon className="h-4 text-gray-300 w-4 cursor-pointer" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              <Tooltip title="Open">
                <span>
                  <IconButton onClick={() => handleOpenReview(entity)}>
                    <BookOpenIcon className="h-4 text-gray-300 w-4 cursor-pointer" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          );
        }}
        customActionsWidth={80}
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
            <Rating name="read-only" className={styles.rating} value={itemToView?.rating} precision={0.5} readOnly />
          </div>
          <h4 className={styles.title}>{itemToView?.title}</h4>
          <p className={styles.description}>{itemToView?.description}</p>
          {!itemToView?.approved && (
            <button
              onClick={async () => {
                const success = await handleApproveReview(itemToView);
                if (success) {
                  itemToView.approved = true;
                  setItemToView({ ...itemToView });
                  entityListPageRef.current?.resetList();
                }
              }}
              className="flex items-center rounded-lg py-2 font-bold bg-indigo-600 mt-4 my-2 text-sm text-white px-3 uppercase self-center hover:bg-indigo-500 disabled:bg-gray-700"
            >
              <CheckBadgeIcon className="h-5 w-5 mr-1 text-white-900 cursor-pointer" />
              Approve
            </button>
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
  );
}
