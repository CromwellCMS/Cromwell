import clsx from 'clsx';
import React from 'react';

import styles from './ProductAttributes.module.scss';

export const AttributeTitle = (props) => {
    const { valid } = props;
    return (
        <p className={clsx(styles.attrTitle, !valid && styles.invalidAttrTitle)}
        >{props.attribute?.key}</p>
    );
}