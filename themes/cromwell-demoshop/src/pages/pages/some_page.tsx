import React from 'react';
import { CromwellPageType, Link } from '@cromwell/core';
import { CromwellBlock, CHTMLBlock, CTextBlock } from '@cromwell/core-frontend';

const SomePage: CromwellPageType = (props) => {
    console.log('SomePageTheme props', props);

    return (
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
    );
}
export default SomePage;