import { resolvePageRoute, TDefaultPageName, TProduct, TProductCategory } from '@cromwell/core';
import { useAppPropsContext } from '@cromwell/core-frontend';

/** @internal */
export const useProductLink = (product?: TProduct, getProductLink?: (product: TProduct) => string | undefined) => {
  const pageContext = useAppPropsContext();

  const productBaseRoute = pageContext.pageProps?.cmsProps?.defaultPages?.['product' as TDefaultPageName];
  if (!productBaseRoute && !getProductLink) {
    console.error('@cromwell/toolkit-commerce: cannot resolve product link. Configure `defaultPages` in cromwell.config.js ' +
      'https://cromwellcms.com/docs/development/theme-development/#default-pages' +
      ' or provide `getProductLink` prop');
  }
  const productLink = product && (getProductLink ? getProductLink(product) :
    productBaseRoute && resolvePageRoute(productBaseRoute, { slug: product?.slug ?? product?.id }));

  return productLink;
}

/** @internal */
export const useCategoryLink = (category?: TProductCategory, getCategoryLink?: (category: TProductCategory) => string | undefined) => {
  const pageContext = useAppPropsContext();

  const categoryBaseRoute = pageContext.pageProps?.cmsProps?.defaultPages?.['category' as TDefaultPageName];
  if (!categoryBaseRoute && !getCategoryLink) {
    console.error('@cromwell/toolkit-commerce: cannot resolve category link. Configure `defaultPages` in cromwell.config.js ' +
      'https://cromwellcms.com/docs/development/theme-development/#default-pages' +
      ' or provide `getCategoryLink` prop');
  }
  const categoryLink = category && (getCategoryLink ? getCategoryLink(category) :
    categoryBaseRoute && resolvePageRoute(categoryBaseRoute, { slug: category?.slug ?? category?.id }));

  return categoryLink;
}