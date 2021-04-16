import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { Link } from '../Link/Link';

type CTextProps = {
    children?: string;
    element?: keyof React.ReactHTML;
    href?: string;
} & TCromwellBlockProps;

export const CText = (props: CTextProps) => {
    const { children, element, ...rest } = props;
    return (
        <CromwellBlock
            text={(children && typeof children === 'string') ? {
                content: children,
                textElementType: element ?? 'p'
            } : undefined}
            {...rest}
            type='text'
            content={(data) => {
                let _type = data?.text?.textElementType ?? element;
                if (!_type) _type = 'p';
                const _text = data?.text?.content ?? children;

                // If text was passed as child in JSX element, save it into config
                if (data && (_text || _type)) {
                    data.text = {
                        ...(data.text ?? {}),
                        content: _text,
                        textElementType: _type
                    }
                }

                const href = data?.text?.href ?? props?.href;
                if (href) {
                    return <Link href={href}>{_text}</Link>
                }

                return React.createElement(_type, {}, _text);
            }} />
    )
}
