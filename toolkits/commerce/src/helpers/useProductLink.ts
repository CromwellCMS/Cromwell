import { resolvePageRoute, TDefaultPageName, TProduct } from '@cromwell/core';
import { usePagePropsContext } from '@cromwell/core-frontend';

export const useProductLink = (product?: TProduct, getProductLink?: (product: TProduct) => string) => {
  const pageContext = usePagePropsContext();

  const productBaseRoute = pageContext.pageProps?.cmsProps?.defaultPages?.['product' as TDefaultPageName];
  if (!productBaseRoute && !getProductLink) {
    console.error('ProductCard: cannot define product link. Configure `defaultPages` in cromwell.config.js ' +
      'https://cromwellcms.com/docs/development/theme-development/#default-pages' +
      ' or provide `getProductLink` prop');
  }
  const productLink = product && (getProductLink ? getProductLink(product) :
    productBaseRoute && resolvePageRoute(productBaseRoute, { slug: product?.slug ?? product?.id }));

  return productLink;
}
