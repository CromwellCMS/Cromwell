import React from 'react';
import { TCromwellPage } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
import { CTextBlock, CHTMLBlock, CromwellBlock } from '@cromwell/core-frontend';
import Layout from '../components/layout/Layout';
// @ts-ignore
import styles from '../styles/Index.module.scss';

const Index: TCromwellPage = (props) => {
    console.log('IndexTheme props', props);

    return (
        <Layout>
            <div className={styles.IndexPage}>IndexTemp
            HELLO WOORLD1
            <Link href='/pages/some_page'><a>SomePage</a></Link>
                <CTextBlock id="1">'Custom' Block text 1 </CTextBlock>
                <div>
                    <h2>Some subtitle</h2>
                </div>
                <CHTMLBlock id="2">
                    <div>
                        <p>Custom Block text 2</p>
                    </div>
                </CHTMLBlock>
                <CromwellBlock id="5" />
            </div>
        </Layout>
    );
}
export default Index;