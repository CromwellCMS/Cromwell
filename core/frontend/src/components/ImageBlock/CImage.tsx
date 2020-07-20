import React from 'react';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { TCromwellBlockData } from '@cromwell/core';

export const CImage = (props: { id: string, className?: string, src?: string }) => {
    const { src, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='image'
            content={(props) => {
                return (
                    <div style={{
                        display: 'flex',
                        width: '100%'
                    }}>
                        <img src={(props.data && props.data.imageSource) ? props.data.imageSource : src}
                            style={{
                                width: '100%',
                                objectFit: 'contain'
                            }}
                        ></img>
                    </div>
                )
            }}
        />
    )
}
