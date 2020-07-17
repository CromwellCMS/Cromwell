import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import React from 'react'
//@ts-ignore
import styles from './CromwellTextBlock.module.scss';

export const CText = (props: { id: string, className?: string, children?: string }) => {
    const { children, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='text' >
            <p className={styles.CromwellTextBlockText}>{children}</p>
        </CromwellBlock>
    )
}
