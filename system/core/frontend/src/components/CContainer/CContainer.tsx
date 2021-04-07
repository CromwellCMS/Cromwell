import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';

type CContainerProps = {
    children?: React.ReactNode;
} & TCromwellBlockProps;

export const CContainer = (props: CContainerProps) => {
    const { children, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='container' >
            {children}
        </CromwellBlock>
    )
}
