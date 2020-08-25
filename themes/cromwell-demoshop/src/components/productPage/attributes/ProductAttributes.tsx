import { TAttribute, TAttributeInstance, TAttributeInstanceValue, TProduct } from '@cromwell/core';
import { Button, Collapse } from '@material-ui/core';
import React, { Component, useEffect, useRef, useState } from 'react';
//@ts-ignore
import styles from './ProductAttributes.module.scss';

export const ProductAttributes = (props: {
    attributes?: TAttribute[]
    productAttributes?: TAttributeInstance[];
    product?: TProduct | null;
    modifyProduct: (product: TProduct) => void;
}): JSX.Element => {
    const { attributes, productAttributes, product } = props;
    const [checkedAttrs, setCheckedAttrs] = useState<Record<string, string[]>>({});
    const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>({});

    const handleSetAttribute = (key: string, checks: string[]) => {
        // console.log('key', key, 'checks', checks)
        setCheckedAttrs(prev => {
            const newCheckedAttrs: Record<string, string[]> = JSON.parse(JSON.stringify(prev));
            newCheckedAttrs[key] = checks;
            applyProductVariants(newCheckedAttrs);
            return newCheckedAttrs;
        })
    };

    const applyProductVariants = (checks: Record<string, string[]>) => {
        if (attributes && product && product.attributes) {
            // console.log('checks[key]', checks, 'attributes', attributes, 'product', product);

            const oldProd = Object.assign({}, product);

            for (const key of Object.keys(checks)) {
                const origAttribute = attributes.find(a => a.key === key);
                const attributeInstance = product.attributes.find(a => a.key === key);
                if (origAttribute && attributeInstance) {
                    if (origAttribute.type === 'radio') {
                        // checks array should contain one element for value
                        if (checks[key] && checks[key].length === 1) {
                            const valueInstance = attributeInstance.values.find(v => v.value === checks[key][0])
                            if (valueInstance && valueInstance.productVariant) {
                                const variant = valueInstance.productVariant;
                                // console.log('valueInstance variant', variant);

                                for (const varKey of Object.keys(variant)) {
                                    const varValue = (variant as any)[varKey];
                                    if (varValue !== null && varValue !== undefined) {
                                        (oldProd as any)[varKey] = varValue;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            props.modifyProduct(oldProd);
        }
    }

    return (
        <div className={styles.ProductAttributes}>
            {productAttributes && (
                productAttributes.map(attr => {
                    const checked: string[] | undefined = checkedAttrs[attr.key];
                    const numberOfChecked = () => checked ? checked.length : 0;
                    const origAttribute = attributes?.find(a => a.key === attr.key);
                    const isExpanded = !collapsedItems[attr.key];

                    if (origAttribute) {
                        return (
                            <div key={attr.key} className={styles.attribute}>
                                <div className={styles.headerWrapper}>
                                    <p>{attr.key}</p>
                                </div>
                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <div className={styles.valuesWrapper}>
                                        {attr.values.map((attrValue: TAttributeInstanceValue) => {
                                            const value = attrValue.value
                                            const labelId = `attribute-list-${attr.key}-${value}-label`;
                                            const origValue = origAttribute?.values?.find(v => v.value === value);
                                            const isChecked = Boolean(checked ? checked.indexOf(value) !== -1 : false);
                                            if (origValue) {
                                                return (
                                                    <Button
                                                        variant={isChecked ? 'contained' : 'outlined'}
                                                        key={value}
                                                        className={styles.attrValue}
                                                        onClick={() => {
                                                            const newChecked = checked ? [...checked] : [];
                                                            if (origAttribute?.type === 'radio') {
                                                                if (isChecked) {
                                                                    handleSetAttribute(attr.key, []);
                                                                } else {
                                                                    handleSetAttribute(attr.key, [value]);
                                                                }
                                                            }
                                                            if (origAttribute?.type === 'checkbox') {
                                                                const currentIndex = newChecked.indexOf(value);
                                                                if (currentIndex === -1) {
                                                                    newChecked.push(value);
                                                                } else {
                                                                    newChecked.splice(currentIndex, 1);
                                                                }
                                                                handleSetAttribute(attr.key, newChecked);
                                                            }
                                                        }}
                                                    >
                                                        {origValue && origValue.icon && (
                                                            <div
                                                                style={{ backgroundImage: `url(${origValue.icon}` }}
                                                                className={styles.attrValueIcon}></div>
                                                        )}
                                                        <p>{value}</p>
                                                    </Button>
                                                );
                                            }
                                        })}
                                    </div>
                                </Collapse>
                            </div>
                        )
                    }

                })
            )}
        </div>
    )
}