import React from 'react';
import { getStore } from '@cromwell/core';
import { TBasePageEntity, TCromwellPageCoreProps } from '@cromwell/core';

/**
 * Creates a default head (SEO meta tags) for any BaseEntity (e.g. Post, Product, etc. See EDBEntity)
 */
export function BaseEntityHead({ entity, pageProps, image }: {
    entity?: TBasePageEntity | null;
    pageProps?: TCromwellPageCoreProps | null;
    image?: string | null;
}) {
    const NextHead = getStore().nodeModules?.modules?.['next/head']?.default;
    if (!NextHead) return null;
    const documentContext = pageProps?.cmsProps?.documentContext;
    const keywords = entity?.meta?.keywords;
    return (
        <NextHead>
            {entity?.pageTitle && entity.pageTitle !== '' && (
                <>
                    <title>{entity.pageTitle}</title>
                    <meta property="og:title" content={entity.pageTitle} />
                </>
            )}
            {documentContext?.fullUrl && (
                <meta property="og:url" content={documentContext?.fullUrl} />
            )}
            {entity?.pageDescription && entity.pageDescription !== '' && (
                <>
                    <meta name="description" content={entity.pageDescription} />
                    <meta property="og:description" content={entity.pageDescription} />
                </>
            )}
            {image && documentContext?.origin && (
                <meta property="og:image" content={documentContext.origin + image} />
            )}
            {keywords && keywords?.length && (
                <meta name="keywords" content={keywords.join(',')} />
            )}
        </NextHead>
    )
}
