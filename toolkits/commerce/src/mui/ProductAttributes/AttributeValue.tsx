import { Button, TextField } from '@mui/material';
import clsx from 'clsx';
import React from 'react';

import { ProductAttributesProps } from '../../base/ProductAttributes/ProductAttributes';
import styles from './MuiProductAttributes.module.scss';

/** @internal */
type CompType = Required<Required<ProductAttributesProps>['elements']>['AttributeValue'];

/** @internal */
export const AttributeValue: CompType = (props) => {
  const { checked, valid, canValidate, classes, attribute } = props;
  if (!attribute) return null;
  if (attribute.type === 'text_input') {
    return <TextField size="small" multiline fullWidth onChange={(e) => props.onInputChange?.(e.target.value)} />;
  }
  return (
    <Button
      color="inherit"
      onClick={props.onClick}
      aria-label={`Attribute ${props?.attribute?.key} - value: ${props?.value}`}
      variant={checked ? 'contained' : 'outlined'}
      className={clsx(
        styles.attributeValue,
        classes?.attributeValue,
        canValidate && !valid && styles.invalidAttributeValue,
        canValidate && !valid && classes?.invalidAttributeValue,
        checked && styles.attributeValueChecked,
        checked && classes?.attributeValueChecked,
      )}
    >
      {props.icon && <div style={{ backgroundImage: `url(${props.icon}` }} className={styles.attributeValueIcon}></div>}
      <p className={styles.attributeValueText} style={{ textTransform: 'none' }}>
        {props.value}
      </p>
    </Button>
  );
};
