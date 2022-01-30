import clsx from 'clsx';
import React from 'react';

import { ProductAttributesProps } from '../../base/ProductAttributes/ProductAttributes';
import styles from './MuiProductAttributes.module.scss';

/** @internal */
type CompType = Required<Required<ProductAttributesProps>['elements']>['AttributeTitle'];

/** @internal */
export const AttributeTitle: CompType = (props) => {
  const { valid } = props;
  return (
    <p className={clsx(styles.attrTitle, !valid && styles.invalidAttributeTitle)}
    >{props.attribute?.title || props.attribute?.key}</p>
  );
}