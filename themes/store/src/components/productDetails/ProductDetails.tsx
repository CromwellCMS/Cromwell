import { MuiProductActions, MuiProductAttributes, ProductGallery, useProductVariants } from '@cromwell/commerce';
import { CContainer, CImage, CText, getBlockHtmlId, getCStore } from '@cromwell/core-frontend';
import { Rating } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { appState } from '../../helpers/AppState';
import { ProductProps } from '../../pages/product/[slug]';
import styles from './ProductDetails.module.scss';

export default function ProductDetails(props: {
  compact?: boolean;
} & ProductProps) {
  const cstore = getCStore();
  const router = useRouter();
  const product = useProductVariants(props.product);

  useEffect(() => {
    if (product) cstore.addToWatchedItems({ product });
  }, [props.product]);


  const scrollToReviews = () => {
    if (props.compact) return;
    document.getElementById(getBlockHtmlId('product_reviewsBlock'))?.scrollIntoView({ behavior: "smooth" });
  }

  const onTitleClick = () => {
    if (props.compact) {
      const productLink = `/product/${product?.slug ?? product?.id}`;
      router.push(productLink);
      appState.closeAllModals();
    }
  }

  if (!product) {
    return (
      <div className={styles.productNotFound}>
        <h3>Product not found</h3>
      </div>
    )
  }

  return (
    <CContainer id="product_01"
      className={styles.ProductDetails + (props.compact ? ' ' + styles.compact : '')}
      style={{ backgroundColor: !props.compact ? '#fff' : undefined }}
    >
      <CContainer id="product_0" className={styles.imageAndCaptionBlock}>
        <CContainer id="product_2" className={styles.imageBlock}>
          <ProductGallery product={product}
            noImagePlaceholder="/themes/@cromwell/theme-store/no-photos.png"
          />
        </CContainer>
        <CContainer id="product_3" className={styles.captionBlock}>
          <CContainer id="product_4">
            <h1 onClick={onTitleClick}
              style={{
                textDecoration: props.compact ? 'underline' : 'none',
                cursor: props.compact ? 'pointer' : 'initial',
              }}
              className={styles.productName}>{product?.name}</h1>
          </CContainer>
          <CContainer id="product_13" className={styles.ratingBlock}>
            <Rating name="read-only" value={product?.rating?.average} precision={0.5} readOnly />
            {product?.rating?.reviewsNumber ? (
              <a className={styles.ratingCaption} onClick={scrollToReviews}>
                ({product?.rating?.average ? product?.rating?.average.toFixed(2) : ''}) {product?.rating?.reviewsNumber} reviews.</a>
            ) : null}
          </CContainer>
          <CContainer id="product_5" className={styles.priceBlock}>
            {(product?.oldPrice !== undefined && product.oldPrice !== null) && (
              <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(product.oldPrice)}</p>
            )}
            <p className={styles.price}>{cstore.getPriceWithCurrency(product.price)}</p>
          </CContainer>
          <CContainer id="productActionsBlock">
            <MuiProductAttributes
              attributes={props.attributes}
              product={props.product}
            />
            <MuiProductActions
              attributes={props.attributes}
              product={props.product}
              onCartOpen={() => appState.isCartOpen = true}
              onWishlistOpen={() => appState.isWishlistOpen = true}
            />
          </CContainer>
        </CContainer>
      </CContainer>

      <CContainer id="product_31" className={styles.tabsAndSidebar}>
        <CContainer id="product_11" className={styles.tabsBlock}>
          <div className={styles.tab} >
            <div className={styles.tabDescription}
              dangerouslySetInnerHTML={(product?.description) ? { __html: product.description } : undefined}
            ></div>
          </div>
        </CContainer>
        {!props.compact && (
          <CContainer id="product_8" className={styles.infoBlock}>
            <CContainer id="product_9" className={styles.advantagesBlock}>
              <CContainer id="main_02" className={styles.advantageItem}>
                <CImage id="main_09" src="/themes/@cromwell/theme-store/free_shipping.png" />
                <CContainer id="main_11" className={styles.advantageItemText}>
                  <CText id="main_06" className={styles.advantageItemHeader}>FREE SHIPPING & RETURN</CText>
                </CContainer>
              </CContainer>
              <CContainer id="main_03" className={styles.advantageItem}>
                <CImage id="main_09" src="/themes/@cromwell/theme-store/wallet.png" />
                <CContainer id="main_13" className={styles.advantageItemText}>
                  <CText id="main_07" className={styles.advantageItemHeader}>MONEY BACK GUARANTEE</CText>
                </CContainer>
              </CContainer>
              <CContainer id="main_04" className={styles.advantageItem}>
                <CImage id="main_09" src="/themes/@cromwell/theme-store/technical-support.png" />
                <CContainer id="main_10" className={styles.advantageItemText}>
                  <CText id="main_08" className={styles.advantageItemHeader} >ONLINE SUPPORT 24/7</CText>
                </CContainer>
              </CContainer>
            </CContainer>
            <CImage id="product_10" src="/themes/@cromwell/theme-store/sub_banner_3.jpg"
              className={styles.infoBanner} imgLink="/category/1" withEffect={true} />
          </CContainer>
        )}
      </CContainer>
    </CContainer>
  )
}

