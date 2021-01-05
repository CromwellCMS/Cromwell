import React from 'react';
import { TCromwellPage } from '@cromwell/core';
import { Link, Head } from '@cromwell/core-frontend';
import { CHTML, CText, CContainer } from '@cromwell/core-frontend';
import Layout from '../../components/layout/Layout';


const SomePage: TCromwellPage = (props) => {
    console.log('SomePageTheme props', props);
    return (
        <Layout>
            <CContainer id="somep_1">SomePage
                <Link href='/'><a>HOME</a></Link>

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
            </CContainer>
            <CText id="3">CBlock 3</CText>
        </Layout>
    );
}
export default SomePage;