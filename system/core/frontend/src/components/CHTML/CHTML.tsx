import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';

export const CHTML = (props: { children?: React.ReactNode } & TCromwellBlockProps) => {
    const { children, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='HTML' >
            {children}
        </CromwellBlock>
    )
}
