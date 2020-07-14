import React from 'react';
import { TCromwellPage } from '@cromwell/core';
import { Link, Head } from '@cromwell/core-frontend';
import { CHTML, CText } from '@cromwell/core-frontend';
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
            <CHTML id="1">
                    <div>
                        <p>CBlock 1</p>
                    </div>
                </CHTML>
                <div>
                    <h2>Some subtitle</h2>
                </div>
                <CText id="2">
                    CBlock 2
            </CText>
            </div>
        </Layout>
    );
}
export default SomePage;