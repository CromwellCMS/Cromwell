import { MuiProductCard } from '@cromwell/commerce';
import { TAttribute, TProduct } from '@cromwell/core';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Theme, Tooltip, useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React from 'react';
import commonStyles from '../../styles/common.module.scss';
import { appState } from '../../helpers/AppState';
import styles from './ProductCard.module.scss';

export const ProductCard = (props?: {
  data?: TProduct;
  attributes?: TAttribute[];
  className?: string;
  variant?: 'vertical' | 'horizontal';
}) => {
  const product = props?.data;
  const router = useRouter();
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  const handleOpenQuickView = () => {
    if (!product?.id) return;
    appState.isQuickViewOpen = true;
    appState.quickViewProductId = product?.id;
  }

  return (
    <MuiProductCard
      classes={{
        root: clsx(props?.className, commonStyles.onHoverLinkContainer, styles.Product),
        title: commonStyles.onHoverLink,
      }}
      product={props?.data}
      attributes={props?.attributes}
      onOpenCart={() => appState.isCartOpen = true}
      onOpenWishlist={() => appState.isWishlistOpen = true}
      noImagePlaceholder={'/themes/@cromwell/theme-store/no-photos.png'}
      variant={(props?.variant === 'horizontal' && !isMobile) ? 'horizontal' : 'vertical'}
      onFailedAddToCart={(item, result) => {
        if (result.code === 4) {
          handleOpenQuickView();
        }
      }}
      elements={{
        OtherActions: () => {
          return (
            <Tooltip title="Quick view">
              <IconButton
                aria-label="Open product in quick view"
                className={styles.actionBtn}
                onClick={handleOpenQuickView}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
          )
        },
      }}
      onProductLinkClick={(event, link) => router?.push(link)}
      imageProps={{ unoptimized: true }}
    />
  );
}
