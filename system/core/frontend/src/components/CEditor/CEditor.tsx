import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';

import { cleanParseContext, getParserTransform } from '../../helpers/parserTransform';
import { CBlock } from '../CBlock/CBlock';

export class CEditor extends React.Component<TCromwellBlockProps> {
    render() {
        const { children, editor, ...rest } = this.props;
        return (
            <CBlock {...rest} type='editor'
                content={(data, blockRef, setContentInstance) => {
                    setContentInstance(this);
                    let content = children;
                    const editorData = Object.assign({}, data?.editor, editor);
                    if (editorData?.html && data) {
                        content = ReactHtmlParser(editorData.html, {
                            transform: getParserTransform(data.id)
                        });
                        cleanParseContext(data.id);
                    }
                    return content;
                }}
            />
        )
    }
}
