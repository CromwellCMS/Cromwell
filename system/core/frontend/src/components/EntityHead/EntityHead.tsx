import { getStore, TBasePageEntity } from '@cromwell/core';
import React from 'react';

import { useAppPropsContext } from '../../constants';

/**
 * Creates a default head (SEO meta tags) for any BaseEntity (e.g. Post, Product, etc. See EDBEntity)
 */
export function EntityHead({ entity, image, useFallback }: {
  entity?: TBasePageEntity | null;
  image?: string | null;
  /**
   * If `pageTitle` is not defined, try to lookup for other known properties
   * to use as `pageTitle`. For example, `name` in `Product` entity.
   */
  useFallback?: boolean;
}) {
  const NextHead = getStore().nodeModules?.modules?.['next/head']?.default;
  if (!NextHead) return null;
  const pageContext = useAppPropsContext();
  const documentContext = pageContext?.pageProps?.cmsProps?.documentContext;
  const keywords = entity?.meta?.keywords;

  if (useFallback && entity) {
    if (!entity.pageTitle) {
      entity.pageTitle = (entity as any).name ?? (entity as any).title;
    }
    if (!image) {
      image = (entity as any).mainImage ?? (entity as any).image;
    }
  }
  return (
    <NextHead>
      {entity?.pageTitle && (
        <>
          <title>{entity.pageTitle}</title>
          <meta property="og:title" content={entity.pageTitle} />
        </>
      )}
      {documentContext?.fullUrl && (
        <meta property="og:url" content={documentContext?.fullUrl} />
      )}
      {entity?.pageDescription && (
        <>
          <meta name="description" content={entity.pageDescription} />
          <meta property="og:description" content={entity.pageDescription} />
        </>
      )}
      {image && documentContext?.origin && (
        <meta property="og:image" content={documentContext.origin + image} />
      )}
      {keywords?.length && (
        <meta name="keywords" content={keywords.join(',')} />
      )}
    </NextHead>
  )
}
