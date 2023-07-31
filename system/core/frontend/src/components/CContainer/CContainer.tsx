import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { CBlock } from '../CBlock/CBlock';

export type CContainerProps = {
  children?: React.ReactNode;
} & TCromwellBlockProps;

export class CContainer extends React.Component<CContainerProps> {
  render() {
    const { children, ...rest } = this.props;
    return (
      <CBlock
        {...rest}
        type="container"
        content={(data, blockRef, setContentInstance) => {
          setContentInstance(this);
          return children;
        }}
      />
    );
  }
}
