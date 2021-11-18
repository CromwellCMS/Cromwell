import { gql } from '@apollo/client';
import {
    ECommonComponentNames,
    getCommonComponent,
    getRandStr,
    TStaticPagePluginContext,
    TAttribute,
    TFrontendPluginProps,
    TPagedList,
    TProduct,
} from '@cromwell/core';
import { CGallery, getGraphQLClient, Link } from '@cromwell/core-frontend';
import React, { useRef, useState, useEffect } from 'react';

import { useStyles } from './styles';

type ProductShowcaseProps = {
    slug?: string;
}

const ProductShowcase = (props: TFrontendPluginProps<ProductShowcaseProps>): JSX.Element => {
    const galleryId = useRef(`ProductShowcase_${getRandStr(5)}`);
    const classes = useStyles();
    const [products, setProducts] = useState<TPagedList<TProduct> | undefined>();
    const [attributes, setAttributes] = useState<TAttribute[] | undefined>();

    const getData = async () => {
        const slug = props.data?.slug;
        const client = getGraphQLClient();
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
            setProducts(data?.data?.pluginProductShowcase);
        } catch (e: any) {
            console.error('ProductShowcase::getStaticProps', e, JSON.stringify(e?.result?.errors ?? null), null, 2)
        }

        try {
            const attributes: TAttribute[] | undefined = await client?.getAttributes();
            setAttributes(attributes)
        } catch (e) {
            console.error('Product::getStaticProps', e)
        }
    }

    useEffect(() => {
        getData();
    }, []);

    // Try to load component if a Theme has already defined common Product view
    let ProductComp = getCommonComponent(ECommonComponentNames.ProductCard);
    if (!ProductComp) {
        // Default view otherwise
        ProductComp = (props: { data?: TProduct | undefined }): JSX.Element => {
            const p = props.data;
            if (p) return (
                <div key={p.id}>
                    <img src={p?.mainImage ?? undefined} width="300px" />
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
                    slides: products?.elements?.map(product => {
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

export const getStaticProps = async (context: TStaticPagePluginContext): Promise<ProductShowcaseProps> => {
    // slug of a product page
    const slug = context?.params?.slug ?? null;
    return {
        slug: typeof slug === 'string' ? slug : undefined,
    }
}

export default ProductShowcase;
