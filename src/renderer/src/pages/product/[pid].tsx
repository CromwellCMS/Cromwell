import React, { Component } from 'react';
import { useRouter } from 'next/router';
import { componentDataFetcher } from '../../common/componentDataFetcher';
import { CromwellPage } from '@cromwell/core';
import dynamic from "next/dynamic";
import { graphQLClient } from '@cromwell/core';
// import { Product as ProductType } from '../../../orm/models/entities/Product';
import { importProductPage } from '@cromwell/templates';
const config = require('@cromwell/core/cmsconfig.json');
const Product = dynamic(importProductPage(config.templateName));

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
            <Product {...props} />
        </main>
    )
}

export const getStaticProps = async (context) => {
    console.log('await importProductPage', await importProductPage(config.templateName))
    const childGetStaticProps = (await importProductPage(config.templateName)).getStaticProps;
    let childStaticProps = {}
    if (childGetStaticProps) {
        try {
            childStaticProps = await childGetStaticProps(context);
        } catch (e) {
            console.error(e);
        }
    }

    console.log('childStaticProps', childStaticProps)
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
