import { MuiProductCard, ProductCardProps } from '@cromwell/commerce';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Theme, Tooltip, useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React from 'react';

import { appState } from '../../helpers/AppState';
import commonStyles from '../../styles/common.module.scss';
import styles from './ProductCard.module.scss';

export const ProductCard = (props?: ProductCardProps & {
  className?: string;
}) => {
  const { product } = props ?? {};
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
      product={product}
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
