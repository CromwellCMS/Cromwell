import React from 'react';
import { DataModule } from '@cromwell/core';
import { CromwellPageType } from '@cromwell/core';
import ProductShowcase from '../modules/ProductShowcase';

const Index: CromwellPageType = (props) => {
    console.log('IndexTemplate props', props);

    return (
        <div>IndexTemp
        HELLO WOORLD1
            <DataModule
                moduleName="ProductShowcase"
                component={ProductShowcase}
            />
        </div>
    );
}
export default Index;