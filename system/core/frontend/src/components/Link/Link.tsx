import { TCromwellBlockProps } from '@cromwell/core';
import { getStoreItem } from '@cromwell/core';
import NextLink from 'next/link';
import React from 'react';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';

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
                let baseRoute = route.replace(/\[.*\]$/, '');
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

export const CLink = (props: TLinkProps & TCromwellBlockProps) => {
    const { children, href, ...rest } = props;

    return (
        <CromwellBlock
            type='link'
            {...rest}
            content={(data) => {
                const _href = data?.link?.href ?? href;
                const _text = data?.link?.text ?? props.children ?? '';
                return <Link href={_href}>{_text}</Link>
            }} />
    )
}
