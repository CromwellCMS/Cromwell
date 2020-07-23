import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import React from 'react'

export const CContainer = (props: { id: string, className?: string, children?: React.ReactNode }) => {
    const { children, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='container' >
            {children}
        </CromwellBlock>
    )
}
