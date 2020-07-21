import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import React from 'react'
//@ts-ignore
import styles from './CromwellTextBlock.module.scss';

export const CText = (props: { id: string, className?: string, children?: string, type?: keyof React.ReactHTML }) => {
    const { children, type, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='text' content={(props) => {
            let _type = props.data && props.data.textElementType ? props.data.textElementType : type;
            if (!_type) _type = 'p';
            const _text = props.data && props.data.text ? props.data.text : children;
            return React.createElement(_type, {}, _text);
        }} />
    )
}
