
import { Button } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import styles from './ProductAttributes.module.scss';

export const AttributeValue = (props) => {
    const { checked, valid } = props;
    return (
        <Button
            color="inherit"
            onClick={props.onClick}
            aria-label={`Attribute ${props?.attribute?.key} - value: ${props?.value}`}
            variant={checked ? 'contained' : 'outlined'}
            className={clsx(styles.attrValue, !valid && styles.invalidAttrValue,
                checked && styles.attrValueChecked)}
        >
            {props.icon && (
                <div
                    style={{ backgroundImage: `url(${props.icon}` }}
                    className={styles.attrValueIcon}></div>
            )}
            <p className={styles.attrValueText} style={{ textTransform: 'none' }}>{props.value}</p>
        </Button>
    )
}