import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';

import { htmlBlockContentClass } from '../../constants';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';

type CHTMLProps = { children?: React.ReactNode } & TCromwellBlockProps;

export const CHTML = (props: CHTMLProps) => {
    const { children, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='HTML'
            content={(data) => {
                let content = props.children;
                if (data?.html?.innerHTML) {
                    content = ReactHtmlParser(data.html.innerHTML);
                }

                return (
                    <div className={htmlBlockContentClass}>{content}</div>
                )
            }}
        />
    )
}
