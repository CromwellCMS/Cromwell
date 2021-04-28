import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';

type CContainerProps = {
    children?: React.ReactNode;
} & TCromwellBlockProps;

export class CContainer extends React.Component<CContainerProps> {
    render() {
        const { children, ...rest } = this.props;
        return (
            <CromwellBlock {...rest} type='container'
                content={(data, blockRef, setContentInstance) => {
                    setContentInstance(this);
                    return children;
                }}
            />
        )
    }
}