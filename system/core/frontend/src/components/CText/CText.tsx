import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { CBlock } from '../CBlock/CBlock';
import { Link } from '../Link/Link';

type CTextProps = {
    children?: string;
    element?: keyof React.ReactHTML;
    href?: string;
} & TCromwellBlockProps;

export class CText extends React.Component<CTextProps> {
    render() {
        const props = this.props;
        const { children, element, ...rest } = props;
        return (
            <CBlock
                text={(children && typeof children === 'string') ? {
                    content: children,
                    textElementType: element ?? 'p'
                } : undefined}
                {...rest}
                type='text'
                content={(data, blockRef, setContentInstance) => {
                    setContentInstance(this);
                    let _type = data?.text?.textElementType ?? element;
                    if (!_type) _type = 'p';
                    const _text = data?.text?.content ?? children;
                    const href = data?.text?.href ?? props?.href;
                    if (href) {
                        return <Link href={href}>{_text}</Link>
                    }
                    return React.createElement(_type, {}, _text);
                }} />
        )
    }
}