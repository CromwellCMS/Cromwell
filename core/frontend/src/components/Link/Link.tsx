import React from 'react';
import NextLink from 'next/link';
import { TCromwellBlockData, getStoreItem, TGallerySettings } from '@cromwell/core';

type TLinkProps = {
    href: string;
    children?: React.ReactNode;
}

export const Link = (props: TLinkProps) => {
    const pagesInfo = getStoreItem('pagesInfo');
    let dynamicPageComp: string | undefined = undefined;
    const href = props.href;
    if (pagesInfo) {
        pagesInfo.forEach(i => {
            if (i.isDynamic && i.route) {
                let route = i.route;
                if (!route.startsWith('/')) {
                    route = `/${route}`;
                }
                let baseRoute = route.replace(/\[.*\]$/, '');
                if (href.startsWith(baseRoute)) {
                    dynamicPageComp = route;
                }
            }
        })
    }
    return (
        <NextLink
            href={dynamicPageComp ? dynamicPageComp : href}
            as={dynamicPageComp ? href : undefined}
        >
            {props.children}
        </NextLink>
    )
}