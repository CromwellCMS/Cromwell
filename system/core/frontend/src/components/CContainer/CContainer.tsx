import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';

export const CContainer = (props: { children?: React.ReactNode } & TCromwellBlockProps) => {
    const { children, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='container' >
            {children}
        </CromwellBlock>
    )
}
