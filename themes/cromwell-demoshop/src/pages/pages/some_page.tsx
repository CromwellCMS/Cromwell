import React from 'react';
import { TCromwellPage } from '@cromwell/core';
import { Link, Head } from '@cromwell/core-frontend';
import { CHTMLBlock, CTextBlock } from '@cromwell/core-frontend';
import Layout from '../../components/layout/Layout';


const SomePage: TCromwellPage = (props) => {
    console.log('SomePageTheme props', props);
    return (
        <Layout>
            <Head>
                <meta charSet="utf-8" />
                {/* can be replaced by title in page config */}
                <title>SomePage Title</title>
                {/* can be replaced by description in page config */}
                <meta property="og:description" content={'dfsdfd'} key="description" />
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