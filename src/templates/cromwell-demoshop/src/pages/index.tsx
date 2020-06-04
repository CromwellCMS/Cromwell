import React from 'react';
import { CromwellPageType, MoveableComponent } from '@cromwell/core';
import ProductShowcase from '../modules/ProductShowcase';

const Index: CromwellPageType = (props) => {
    console.log('IndexTemplate props', props);

    return (
        <div>IndexTemp
            
        HELLO WOORLD1
            <MoveableComponent id="1">
                <div>
                    <p>MoveableComponent 1</p>
                </div>
            </MoveableComponent>
            <div>
                <h2>Some subtitle</h2>
            </div>
            <MoveableComponent id="2">
                <div>
                    <p>MoveableComponent 2</p>
                </div>
            </MoveableComponent>
            <ProductShowcase />
        </div>
    );
}
export default Index;