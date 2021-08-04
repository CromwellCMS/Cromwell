import { getStore } from '@cromwell/core';
import React from 'react';

type TLinkProps = {
    href: string;
    children?: React.ReactNode;
}

export const Link = (props: TLinkProps) => {
    const NextLink = getStore().nodeModules?.modules?.['next/link']?.default ??
        getStore().nodeModules?.modules?.['next/link'];

    if (NextLink) {
        return (
            <NextLink
                href={props.href}
            >
                {props.children ?? ''}
            </NextLink>
        )
    }
    return (
        <a href={props.href + ''}>{props.children ?? ''}</a>
    )
}