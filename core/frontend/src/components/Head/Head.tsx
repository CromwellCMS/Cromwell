import React from 'react'
import NextHead from 'next/head';

type THeadProps = {
    children?: React.ReactNode;
}
export const Head = (props: THeadProps) => {
    return (
        <NextHead>
            {props.children}
        </NextHead>
    )
}
