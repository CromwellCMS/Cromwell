import React from 'react';
import { CromwellPageType, Link } from '@cromwell/core';
import { CTextBlock, CHTMLBlock, CromwellBlock } from '@cromwell/core-frontend';
// @ts-ignore
import styles from '../styles/Index.module.scss';

const Index: CromwellPageType = (props) => {
    console.log('IndexTheme props', props);

    return (
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
    );
}
export default Index;