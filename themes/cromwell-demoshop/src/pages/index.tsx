import React from 'react';
import { CromwellPageType, CromwellBlock, Link } from '@cromwell/core';

const Index: CromwellPageType = (props) => {
    console.log('IndexTheme props', props);

    return (
        <div>IndexTemp
            
        HELLO WOORLD1
        <Link href='/pages/some_page'><a>SomePage</a></Link>
            <CromwellBlock id="1">
                <div>
                    <p>CromwellBlock 1</p>
                </div>
            </CromwellBlock>
            <div>
                <h2>Some subtitle</h2>
            </div>
            <CromwellBlock id="2">
                <div>
                    <p>CromwellBlock 2</p>
                </div>
            </CromwellBlock>
            <CromwellBlock id="5" />
        </div>
    );
}
export default Index;