import React from 'react';
import { CromwellPageType, Link } from '@cromwell/core';
import { CromwellBlock, CromwellHTMLBlock, CromwellTextBlock } from '@cromwell/core-frontend';

const SomePage: CromwellPageType = (props) => {
    console.log('SomePageTheme props', props);

    return (
        <div>SomePage
            <Link href='/'><a>HOME</a></Link>
        HELLO WOORLD1 SomePage
            <CromwellHTMLBlock id="1">
                <div>
                    <p>CBlock 1</p>
                </div>
            </CromwellHTMLBlock>
            <div>
                <h2>Some subtitle</h2>
            </div>
            <CromwellTextBlock id="2">
                CBlock 2
            </CromwellTextBlock>
        </div>
    );
}
export default SomePage;