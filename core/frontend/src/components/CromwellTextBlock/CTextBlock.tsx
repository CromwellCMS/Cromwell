import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import React from 'react'
//@ts-ignore
import styles from './CromwellTextBlock.module.scss';

export const CTextBlock = (props: { id: string, children?: string }) => {
    return (
        <CromwellBlock id={props.id} type='text' >
            <p className={styles.CromwellTextBlockText}>{props.children}</p>
        </CromwellBlock>
    )
}
