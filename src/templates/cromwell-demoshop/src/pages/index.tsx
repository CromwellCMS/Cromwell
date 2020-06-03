import React from 'react';
import { CromwellPageType } from '@cromwell/core';
import ProductShowcase from '../modules/ProductShowcase';

const Index: CromwellPageType = (props) => {
    console.log('IndexTemplate props', props);

    return (
        <div>IndexTemp
            
        HELLO WOORLD1
            <ProductShowcase />

        </div>
    );
}
export default Index;