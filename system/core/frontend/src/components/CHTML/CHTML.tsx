import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';

type CHTMLProps = { children?: React.ReactNode } & TCromwellBlockProps;

/** @noInheritDoc */
export class CHTML extends React.Component<CHTMLProps> {
    render() {
        const { children, ...rest } = this.props;
        return (
            <CromwellBlock {...rest} type='HTML'
                content={(data, blockRef, setContentInstance) => {
                    setContentInstance(this);
                    let content = children;
                    if (data?.html?.innerHTML) {
                        content = ReactHtmlParser(data.html.innerHTML);
                    }
                    return content;
                }}
            />
        )
    }
}
