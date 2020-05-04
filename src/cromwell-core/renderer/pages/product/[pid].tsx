import React, { Component } from 'react';
import { NextPage } from 'next'
import { useRouter } from 'next/router';
import { componentDataFetcher } from '../../common/componentDataFetcher';
import { CromwellPage } from '../../types';
import dynamic from "next/dynamic";
import gql from 'graphql-tag';
import { graphQLClient } from '../../common/graphQLClient';
// import { Product as ProductType } from '../../../orm/models/entities/Product';

const config = require('../../../cmsconfig.json');
const Product = dynamic(import(`../../../../templates/${config.templateName}/src/pages/product`));


interface Props {
    userAgent?: string;
    pid?: string;
    data?: any
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
    const { childGetStaticProps } = await import(`../../../../templates/${config.templateName}/src/pages/product`);
    const childStaticProps = childGetStaticProps ? await childGetStaticProps(context) : {};

    const pid = (context && context.params) ? context.params.pid : '';


    const componentsData = await componentDataFetcher('product', context);
    return {
        props: {
            ...childStaticProps,
            pid,
            componentsData: componentsData
        }
    }
}

export async function getStaticPaths() {
    let data;
    let paths = [];
    try {
        data = await graphQLClient.request(`
            query getPosts {
                posts {
                    id
                }
            }
        `);
        if (data) {
            paths = data.posts.map(p => {
                return {
                    params: { pid: p.id }
                }
            })
        }
    } catch (e) {
        console.error(e)
    }
    console.log('getStaticPaths', paths)
    return {
        paths,
        fallback: true
    };
}

export default ProductCore;
