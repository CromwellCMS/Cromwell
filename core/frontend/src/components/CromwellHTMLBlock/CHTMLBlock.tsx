import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import React from 'react'

export const CHTMLBlock = (props: { id: string, children?: JSX.Element }) => {
    return (
        <CromwellBlock id={props.id} type='HTML' >
            {props.children}
        </CromwellBlock>
    )
}
