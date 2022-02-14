import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { parseHtml } from '../../helpers/parserTransform';
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
                        content = parseHtml(editorData.html);
                    }
                    return content;
                }}
            />
        )
    }
}
