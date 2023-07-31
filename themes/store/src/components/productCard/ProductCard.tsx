import { MuiProductCard, ProductCardProps } from '@cromwell/toolkit-commerce';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Theme, Tooltip, useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React from 'react';

import { appState } from '../../helpers/AppState';
import commonStyles from '../../styles/common.module.scss';
import styles from './ProductCard.module.scss';

export const ProductCard = (
  props?: ProductCardProps & {
    className?: string;
  },
) => {
  const { product } = props ?? {};
  const router = useRouter();
  const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  const variant = props?.variant === 'horizontal' && !isMobile ? 'horizontal' : 'vertical';

  const handleOpenQuickView = () => {
    if (!product?.id) return;
    appState.isQuickViewOpen = true;
    appState.quickViewProductId = product?.id;
  };

  if (!product) return null;

  return (
    <MuiProductCard
      product={product}
      attributes={props?.attributes}
      classes={{
        root: clsx(props?.className, commonStyles.onHoverLinkContainer, styles.Product),
        title: commonStyles.onHoverLink,
      }}
      onOpenCart={() => (appState.isCartOpen = true)}
      onOpenWishlist={() => (appState.isWishlistOpen = true)}
      noImagePlaceholderUrl={'/themes/@cromwell/theme-store/no-photos.png'}
      variant={variant}
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
                onClick={handleOpenQuickView}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
          );
        },
      }}
      onProductLinkClick={(event, link) => router?.push(link)}
    />
  );
};
