import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import React from 'react'

export const CContainerBlock = (props: { id: string, children?: JSX.Element }) => {
    return (
        <CromwellBlock id={props.id} config={{ componentId: props.id, type: 'container' }} >
            {props.children}
        </CromwellBlock>
    )
}
