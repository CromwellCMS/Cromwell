import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';
import ReactHtmlParser, { Transform } from 'react-html-parser';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';

type CHTMLProps = { children?: React.ReactNode } & TCromwellBlockProps;

let index = 0;
const parserTransform: Transform = (node) => {
    index++;
    if (node.type === 'script') {
        if (node.children?.[0]?.data && node.children[0].data !== '')
            return <script key={index} dangerouslySetInnerHTML={{ __html: node.children[0].data }} />
    }
    if (node.type === 'style') {
        if (node.children?.[0]?.data && node.children[0].data !== '')
            return <style key={index} type="text/css" dangerouslySetInnerHTML={{ __html: node.children[0].data }} />
    }
}

export class CHTML extends React.Component<CHTMLProps> {
    render() {
        const { children, ...rest } = this.props;
        return (
            <CromwellBlock {...rest} type='HTML'
                content={(data, blockRef, setContentInstance) => {
                    setContentInstance(this);
                    let content = children;
                    if (data?.html?.innerHTML) {
                        content = ReactHtmlParser(data.html.innerHTML, { transform: parserTransform });
                    }
                    return content;
                }}
            />
        )
    }
}
