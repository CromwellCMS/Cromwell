import React, { Component } from 'react';
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router';
// import { Product } from '@cromwell/core';
// import { ComponentProps } from '@cromwell/core';

interface DataProps {
    // products?: Product[];
    userAgent?: string;
}

// const ProductShowcase = (props: ComponentProps<DataProps>) => {
const ProductShowcase = (props: any) => {
    const router = useRouter()
    const pid = (router && router.query) ? router.query.pid : undefined;
    console.log('ProductShowcase props', props)

    return (
        <main style={{ backgroundColor: "#999" }}>
            <p>pid: {pid}</p>
            <p>userAgent: {props.data.userAgent}</p>
            <p>Showcase Time!</p>
            {/* {
                props.data.products && props.data.products.map(p => (
                    <div id={p.id}>
                        <h1>Name: {p.name}</h1>
                        <h1>Price: {p.price}</h1>
                        <h1>id: {p.id}</h1>
                    </div>
                ))
            } */}
        </main>
    )
}

export const getStaticProps = async (context: NextPageContext): Promise<DataProps> => {
    console.log('ProductShowcase.getStaticProps')
    const { pid } = context.query;
    const userAgent = context.req ? context.req.headers['user-agent'] : navigator.userAgent
    // return { userAgent, products: [] }
    return { userAgent }
}

export default ProductShowcase;
