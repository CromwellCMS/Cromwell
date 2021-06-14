import NextLink from 'next/link';
import React from 'react';

type TLinkProps = {
    href: string;
    children?: React.ReactNode;
}

export const Link = (props: TLinkProps) => {
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