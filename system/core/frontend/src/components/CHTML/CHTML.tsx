import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';

import { cleanParseContext, getParserTransform } from '../../helpers/parserTransform';
import { CBlock } from '../CBlock/CBlock';

type CHTMLProps = { children?: React.ReactNode } & TCromwellBlockProps;

export class CHTML extends React.Component<CHTMLProps> {
    render() {
        const { children, ...rest } = this.props;
        return (
            <CBlock {...rest} type='HTML'
                content={(data, blockRef, setContentInstance) => {
                    setContentInstance(this);
                    let content = children;
                    if (data?.html?.innerHTML) {
                        content = ReactHtmlParser(data.html.innerHTML, {
                            transform: getParserTransform(data.id, { executeScripts: true })
                        });
                        cleanParseContext(data.id);
                    }
                    return content;
                }}
            />
        )
    }
}