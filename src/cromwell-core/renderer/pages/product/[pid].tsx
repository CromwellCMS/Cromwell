import React, { Component } from 'react';
import { NextPage } from 'next'
import { useRouter } from 'next/router';
import { componentDataFetcher } from '../../core/componentDataFetcher';
import { CromwellPage } from '../../types';
import dynamic from "next/dynamic";
const config = require('../../../cmsconfig.json');
const Product = dynamic(import(`../../../../templates/${config.templateName}/src/pages/product`));


interface Props {
    userAgent?: string;
    pid?: string;
}

const ProductCore: CromwellPage<Props> = (props) => {
    const router = useRouter()
    const pid = router && router.query ? router.query.pid : '';
    console.log('Product props', props);

    return (
        <main>
            <p>pid: {pid}</p>
            <p>Your user agent: {props.userAgent}</p>
            <Product />
        </main>
    )
}

export const getStaticProps = async (context) => {
    const { pid } = context.query;
    const userAgent = context.req ? context.req.headers['user-agent'] : '';
    const componentsData = await componentDataFetcher('product', context);
    return {
        props: {
            userAgent,
            pid: !Array.isArray(pid) ? pid : undefined,
            componentsData: componentsData
        }
    }
}

export async function getStaticPaths() {
    return {
        paths: [
            { params: { ... } } 
        ],
        fallback: true
    };
}

export default ProductCore;
