import { gql } from '@apollo/client';
import {
    ECommonComponentNames,
    getCommonComponent,
    getRandStr,
    StaticPageContext,
    TAttribute,
    TFrontendPluginProps,
    TPagedList,
    TProduct,
} from '@cromwell/core';
import { CGallery, getGraphQLClient, Link } from '@cromwell/core-frontend';
import React, { useRef } from 'react';

import { useStyles } from './styles';

type ProductShowcaseProps = {
    productShowcase?: TPagedList<TProduct>;
    attributes?: TAttribute[];
}

const ProductShowcase = (props: TFrontendPluginProps<ProductShowcaseProps>): JSX.Element => {
    const galleryId = useRef(`ProductShowcase_${getRandStr(5)}`);
    const classes = useStyles();
    const data = props.data?.productShowcase;
    const attributes = props.data?.attributes;

    // Try to load component if a Theme has already defined common Product view
    let ProductComp = getCommonComponent(ECommonComponentNames.ProductCard);
    if (!ProductComp) {
        // Default view otherwise
        ProductComp = (props: { data?: TProduct | undefined }): JSX.Element => {
            const p = props.data;
            if (p) return (
                <div key={p.id}>
                    <img src={p?.mainImage} width="300px" />
                    <Link href={`/product/${p.slug}`}><a>{p.name}</a></Link>
                    <p>{p.price}</p>
                </div>
            )
            else return <></>;
        }
    }

    return (
        <div className={classes.wrapper}>
            <CGallery
                editorHidden
                style={{ height: '100%' }}
                id={galleryId.current}
                gallery={{
                    slides: data?.elements?.map(product => {
                        return (
                            <div className={classes.listItem}>
                                {ProductComp && <ProductComp data={product}
                                    attributes={attributes} key={product.id} />}
                            </div>
                        )
                    }) ?? [],
                    loop: true,
                    navigation: true,
                    pagination: true,
                    slideMinWidth: 200,
                    slideMaxWidth: 350,
                    autoHeight: true,
                }}
            />
        </div>
    )
}

export const getStaticProps = async (context: StaticPageContext): Promise<ProductShowcaseProps> => {
    // slug of a product page
    const client = getGraphQLClient();
    const slug = context?.params?.slug ?? null;
    let data;
    try {
        data = await client?.query({
            query: gql`
                query pluginProductShowcase($slug: String) {
                    pluginProductShowcase(slug: $slug) {
                        pagedMeta {
                            pageSize
                        }
                        elements {
                            id
                            slug
                            name
                            price
                            oldPrice
                            mainImage
                            rating {
                                average
                                reviewsNumber
                            }
                        }
                    }
                }
            `,
            variables: {
                slug
            }
        });

    } catch (e) {
        console.error('ProductShowcase::getStaticProps', e, JSON.stringify(e?.result?.errors ?? null), null, 2)
    }

    let attributes: TAttribute[] | undefined;
    try {
        attributes = await client?.getAttributes();
    } catch (e) {
        console.error('Product::getStaticProps', e)
    }

    return {
        attributes,
        productShowcase: data?.data?.pluginProductShowcase,
    }
}

export default ProductShowcase;
