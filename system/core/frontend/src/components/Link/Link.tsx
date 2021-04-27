import { getStoreItem } from '@cromwell/core';
import NextLink from 'next/link';
import React from 'react';

type TLinkProps = {
    href: string;
    children?: React.ReactNode;
}

export const Link = (props: TLinkProps) => {
    const pagesInfo = getStoreItem('pagesInfo');
    let dynamicPageCompHref: string | undefined = undefined;
    if (pagesInfo && Array.isArray(pagesInfo)) {
        pagesInfo.forEach(i => {
            if (i.isDynamic && i.route) {
                let route = i.route;
                if (!route.startsWith('/')) {
                    route = `/${route}`;
                }
                const baseRoute = route.replace(/\[.*\]$/, '');
                if (props.href.startsWith(baseRoute)) {
                    dynamicPageCompHref = route;
                }
            }
        })
    }
    // NextLink in Next.js environment and <a> in Admin panel
    if (NextLink) {
        return (
            <NextLink
                href={dynamicPageCompHref ?? props.href}
                as={dynamicPageCompHref ? props.href : undefined}
            >
                {props.children ?? ''}
            </NextLink>
        )
    }
    return (
        <a href={props.href + ''}>{props.children ?? ''}</a>
    )
}