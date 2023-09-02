import { TProduct } from '@cromwell/core';
import { getCStore } from '@cromwell/core-frontend';
import { Checkbox, Grid, IconButton } from '@mui/material';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon } from '@mui/icons-material';
import React from 'react';
import { Link } from 'react-router-dom';

import { productPageInfo } from '../../constants/PageInfos';
import commonStyles from '../../styles/common.module.scss';
import styles from './ProductListItem.module.scss';
import { useSelectedItems } from '@store/selectedItems';

export type TProductItemProps = {
  data?: TProduct;
  listItemProps: ListItemProps;
  embedded?: boolean;
};

export type ListItemProps = {
  handleDeleteProductBtnClick: (product?: TProduct) => void;
  toggleSelection: (data?: TProduct) => void;
};

const ProductListItem = (props: TProductItemProps) => {
  const cstore = getCStore();
  const { data } = props;

  if (!props.data) return null;

  const { allSelected, selectedItems } = useSelectedItems();

  let selected = false;
  if (allSelected && !selectedItems[data?.id || '']) selected = true;
  if (!allSelected && selectedItems[data?.id || '']) selected = true;

  return (
    <Grid container className={styles.listItem}>
      <Grid item xs={8} className={styles.itemMain}>
        {!props.embedded && (
          <div className={commonStyles.center}>
            <Checkbox checked={selected} onChange={() => props.listItemProps.toggleSelection(data)} />
          </div>
        )}
        <div style={{ backgroundImage: `url(${props?.data?.mainImage})` }} className={styles.itemImage}></div>
        <div className={styles.itemMainInfo}>
          <p className={styles.itemTitle}>{props.data?.name}</p>
          <div className={styles.priceBlock}>
            {data?.oldPrice !== undefined && data?.oldPrice !== null && (
              <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(data.oldPrice)}</p>
            )}
            <p className={styles.price}>{cstore.getPriceWithCurrency(data?.price)}</p>
          </div>
        </div>
      </Grid>
      <Grid item xs={2}>
        <p className={styles.itemTitle}>{props.data?.stockStatus ?? 'In stock'}</p>
        <p style={{ fontSize: '14px' }} className={styles.ellipsis}>
          {props.data?.sku}
        </p>
      </Grid>
      <Grid item xs={2} className={styles.listItemActions}>
        <Link to={`${productPageInfo.baseRoute}/${props.data?.id}`}>
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
        </Link>
        {!props.embedded && (
          <IconButton aria-label="delete" onClick={() => props.listItemProps.handleDeleteProductBtnClick(props.data)}>
            <DeleteForeverIcon />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
};

export default ProductListItem;
