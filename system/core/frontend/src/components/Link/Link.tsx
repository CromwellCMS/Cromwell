import { getStoreItem } from '@cromwell/core';
import NextLink from 'next/link';
import React from 'react';

type TLinkProps = {
    href: string;
    children?: React.ReactNode;
}

export const Link = (props: TLinkProps) => {
    const pagesInfo = getStoreItem('pagesInfo');
    let dynamicPageComp: string | undefined = undefined;
    const href = props.href;
    if (pagesInfo && Array.isArray(pagesInfo)) {
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
    // NextLink in Next.js environment and <a> in Admin panel
    const LinkComp = NextLink ?? ((props) => <a>{props.children ?? ''}</a>);
    return (
        <LinkComp
            href={dynamicPageComp ? dynamicPageComp : href}
            as={dynamicPageComp ? href : undefined}
        >
            {props.children ?? ''}
        </LinkComp>
    )
}