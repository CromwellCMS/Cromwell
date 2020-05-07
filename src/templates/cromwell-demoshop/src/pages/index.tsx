import React from 'react';
import { DataComponent } from '@cromwell/core';
import { CromwellPage } from '@cromwell/core';
import ProductShowcase from '../components/ProductShowcase';

const Index: CromwellPage = (props) => {
    console.log('IndexTemplate props', props);

    return (
        <div>IndexTemp
        HELLO WOORLD1
            <DataComponent
                componetName="ProductShowcase"
                component={ProductShowcase}
            />
        </div>
    );
}
export default Index;