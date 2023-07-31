import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { parseHtml } from '../../helpers/parserTransform';
import { CBlock } from '../CBlock/CBlock';

type CHTMLProps = { children?: React.ReactNode } & TCromwellBlockProps;

export class CHTML extends React.Component<CHTMLProps> {
  render() {
    const { children, ...rest } = this.props;
    return (
      <CBlock
        {...rest}
        type="HTML"
        content={(data, blockRef, setContentInstance) => {
          setContentInstance(this);
          let content = children;
          if (data?.html?.innerHTML) {
            content = parseHtml(data.html.innerHTML, { executeScripts: true });
          }
          return content;
        }}
      />
    );
  }
}
