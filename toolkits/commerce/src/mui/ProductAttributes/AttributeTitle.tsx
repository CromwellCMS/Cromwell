import clsx from 'clsx';
import React from 'react';

import { ProductAttributesProps } from '../../base/ProductAttributes/ProductAttributes';
import styles from './MuiProductAttributes.module.scss';

type CompType = Required<Required<ProductAttributesProps>['elements']>['AttributeTitle'];

export const AttributeTitle: CompType = (props) => {
  const { valid } = props;
  return (
    <p className={clsx(styles.attrTitle, !valid && styles.invalidAttributeTitle)}
    >{props.attribute?.title || props.attribute?.key}</p>
  );
}