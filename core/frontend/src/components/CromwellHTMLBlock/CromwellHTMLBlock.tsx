import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import React from 'react'

export const CromwellHTMLBlock = (props: { id: string, children: JSX.Element }) => {
    return (
        <CromwellBlock id={props.id} config={{ componentId: props.id, type: 'HTML' }} >
            {props.children}
        </CromwellBlock>
    )
}
