import React from 'react';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';

export const CImage = (props: { id: string, className?: string, src: string }) => {
    const { src, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='image' >
            <img src={src}></img>
        </CromwellBlock>
    )
}
