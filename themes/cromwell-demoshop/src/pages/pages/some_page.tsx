import React from 'react';
import { CromwellPageType } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
import { CHTMLBlock, CTextBlock } from '@cromwell/core-frontend';
import Layout from '../../components/layout/Layout';
import Head from 'next/head';


const SomePage: CromwellPageType = (props) => {
    console.log('SomePageTheme props', props);

    return (
        <Layout>
            <Head>
                <meta charSet="utf-8" />
                <title>My Title</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Head>
            <div>SomePage
            <Link href='/'><a>HOME</a></Link>
        HELLO WOORLD1 SomePage
            <CHTMLBlock id="1">
                    <div>
                        <p>CBlock 1</p>
                    </div>
                </CHTMLBlock>
                <div>
                    <h2>Some subtitle</h2>
                </div>
                <CTextBlock id="2">
                    CBlock 2
            </CTextBlock>
            </div>
        </Layout>
    );
}
export default SomePage;