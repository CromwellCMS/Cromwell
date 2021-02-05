import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';

type CHTMLProps = { children?: React.ReactNode } & TCromwellBlockProps;

export const CHTML = (props: CHTMLProps) => {
    const { children, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='HTML' >
            {children}
        </CromwellBlock>
    )
}
