import { TBasePageEntity, TNextDocumentContext } from '@cromwell/core';
import Head from 'next/head';
import React from 'react';

export const getHead = ({ data, documentContext, image }: {
    data?: TBasePageEntity | null;
    documentContext?: TNextDocumentContext;
    image?: string | null;
}) => {
    const keywords = data?.meta?.keywords;
    return (
        <Head>
            {data?.pageTitle && data.pageTitle !== '' && (
                <>
                    <title>{data.pageTitle}</title>
                    <meta property="og:title" content={data.pageTitle} />
                </>
            )}
            {documentContext?.fullUrl && (
                <meta property="og:url" content={documentContext?.fullUrl} />
            )}
            {data?.pageDescription && data.pageDescription !== '' && (
                <>
                    <meta name="description" content={data.pageDescription} />
                    <meta property="og:description" content={data.pageDescription} />
                </>
            )}
            {image && documentContext?.origin && (
                <meta property="og:image" content={documentContext.origin + image} />
            )}
            {keywords && keywords?.length && (
                <meta name="keywords" content={keywords.join(',')} />
            )}
        </Head>
    )
}