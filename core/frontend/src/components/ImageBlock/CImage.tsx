import React from 'react';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { TCromwellBlockData } from '@cromwell/core';

export const CImage = (props: { id: string, className?: string, src?: string }) => {
    const { src, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='image'
            content={(props) => {
                return (
                    <img src={(props.data && props.data.imageSource) ? props.data.imageSource : src}></img>
                )
            }}
        />
    )
}
