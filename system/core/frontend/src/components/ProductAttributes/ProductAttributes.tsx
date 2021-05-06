import { TAttribute, TAttributeInstance, TAttributeInstanceValue, TProduct } from '@cromwell/core';
import React, { useState } from 'react';

import { getCStore } from '../../CStore';
import styles from './ProductAttributes.module.scss';


/**
 * Displays product's attributes
 */
export const ProductAttributes = (props: {
    /** Unmodified instance of Product */
    product: TProduct;

    /** All available attributes */
    attributes?: TAttribute[];

    /** 
     * Called when user picks any attribute, if picked value has productVariant,
     * it applies modifications to "product" prop and calls this method.
     * If value has no productVariant, then original product will be returned  
     * */
    onChange?: (checkedAttrs: Record<string, string[]>, modifiedProduct: TProduct) => void;

    /** UI elements to replace default ones */
    elements?: {
        /** Component for a value of an attribute. Must implement onClick prop */
        attributeValue?: React.ComponentType<{
            onClick: () => void;
            value: string;
            isChecked: boolean;
            icon?: string;
            attribute?: TAttribute;
            attributeInstance?: TAttributeInstance;
        }>;
        attributeTitle?: React.ComponentType<{ attribute?: TAttribute; }>;
    }
}): JSX.Element => {
    const { attributes, product, onChange } = props;
    const productAttributes = product.attributes;
    const [checkedAttrs, setCheckedAttrs] = useState<Record<string, string[]>>({});
    const cstore = getCStore();
    const ValueComp = props.elements?.attributeValue;
    const TitleComp = props.elements?.attributeTitle;

    const handleSetAttribute = (key: string, checks: string[]) => {
        setCheckedAttrs(prev => {
            const newCheckedAttrs: Record<string, string[]> = Object.assign({}, prev);
            newCheckedAttrs[key] = checks;
            setTimeout(() => {
                onChange?.(newCheckedAttrs, cstore.applyProductVariants(
                    product, newCheckedAttrs, attributes));
            }, 10);

            return newCheckedAttrs;
        })
    };

    return (
        <div className={styles.ProductAttributes}>
            {productAttributes && (
                productAttributes.map(attr => {
                    const checked: string[] | undefined = checkedAttrs[attr.key];
                    const origAttribute = attributes?.find(a => a.key === attr.key);
                    if (origAttribute) {
                        return (
                            <div key={attr.key} className={styles.attribute}>
                                <div className={styles.headerWrapper}>
                                    {TitleComp ? <TitleComp attribute={origAttribute}>{attr.key}</TitleComp> : <p>{attr.key}</p>}
                                </div>
                                <div className={styles.valuesWrapper}>
                                    {attr.values.map((attrValue: TAttributeInstanceValue) => {
                                        const value = attrValue.value
                                        const origValue = origAttribute?.values?.find(v => v.value === value);
                                        const isChecked = Boolean(checked ? checked.indexOf(value) !== -1 : false);
                                        if (origValue) {

                                            const handleClick = () => {
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
                                            }

                                            if (ValueComp) {
                                                return <ValueComp
                                                    key={value}
                                                    onClick={handleClick}
                                                    value={value}
                                                    isChecked={isChecked}
                                                    attribute={origAttribute}
                                                    attributeInstance={attr}
                                                />
                                            }

                                            return (
                                                <div
                                                    key={value}
                                                    className={`${styles.attrValue} ${isChecked ? styles.attrValueChecked : ''}`}
                                                    onClick={handleClick}
                                                >
                                                    {origValue && origValue.icon && (
                                                        <div
                                                            style={{ backgroundImage: `url(${origValue.icon}` }}
                                                            className={styles.attrValueIcon}></div>
                                                    )}
                                                    <p style={{ textTransform: 'none' }}>{value}</p>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        )
                    }
                })
            )}
        </div>
    )
}