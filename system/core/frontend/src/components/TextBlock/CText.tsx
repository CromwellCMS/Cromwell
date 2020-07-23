import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import React from 'react'
//@ts-ignore
import styles from './CromwellTextBlock.module.scss';

export const CText = (props: { id: string, className?: string, children?: string, type?: keyof React.ReactHTML }) => {
    const { children, type, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='text' content={(data) => {
            let _type = data && data.text && data.text.textElementType ? data.text.textElementType : type;
            if (!_type) _type = 'p';
            const _text = data && data.text && data.text.content ? data.text.content : children;
            return React.createElement(_type, {}, _text);
        }} />
    )
}
