import { TAttribute, TAttributeInstance, TAttributeInstanceValue, TProduct } from '@cromwell/core';
import { getCStore } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React, { useState } from 'react';

import { useAdapter } from '../../adapter';
import styles from './ProductAttributes.module.scss';

export type ProductAttributesProps = {
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
      checked: boolean;
      valid?: boolean;
      icon?: string;
      attribute?: TAttribute;
      attributeInstance?: TAttributeInstance;
    }>;
    attributeTitle?: React.ComponentType<{
      attribute?: TAttribute;
      valid?: boolean;
    }>;
  }

  /**
   * Show error if some required attributes weren't selected?
   */
  canValidate?: boolean;
}

/**
 * Displays product's attributes
 * When user picks an attribute applies product variant and returns modified
 * product from `onChange` function prop
 */
export const ProductAttributes = (props: ProductAttributesProps): JSX.Element => {
  const { attributes, product, onChange, canValidate } = props;
  const productAttributes = product.attributes;
  const [checkedAttrs, setCheckedAttrs] = useState<Record<string, string[]>>({});
  const cstore = getCStore();
  const { AttributeValue, AttributeTitle } = useAdapter();
  const ValueComp = props.elements?.attributeValue ?? AttributeValue;
  const TitleComp = props.elements?.attributeTitle ?? AttributeTitle ?? (
    (props) => <p>{props.attribute?.key}</p>
  );

  const handleSetAttribute = (key: string, checks: string[]) => {
    setCheckedAttrs(prev => {
      const newCheckedAttrs: Record<string, string[]> = Object.assign({}, prev);
      newCheckedAttrs[key] = checks;
      setTimeout(() => {
        onChange?.(newCheckedAttrs, cstore.applyProductVariants(
          product, newCheckedAttrs));
      }, 10);

      return newCheckedAttrs;
    })
  };

  return (
    <div className={clsx(styles.ProductAttributes,
      !!canValidate && styles.productAttributesValidate)}>
      {productAttributes?.map(attr => {
        const checked: string[] | undefined = checkedAttrs[attr.key];
        const origAttribute = attributes?.find(a => a.key === attr.key);
        let isValid = true;

        if (origAttribute?.required && origAttribute.key) {
          if (!checkedAttrs || !checkedAttrs[origAttribute.key]
            || !checkedAttrs[origAttribute.key].length)
            isValid = false;
        }

        if (origAttribute) {
          return (
            <div key={attr.key} className={styles.attribute}>
              <div className={styles.headerWrapper}>
                <TitleComp
                  attribute={origAttribute}
                  valid={isValid}
                />
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
                        icon={origValue.icon}
                        checked={isChecked}
                        valid={isValid}
                        attribute={origAttribute}
                        attributeInstance={attr}
                      />
                    }

                    return (
                      <div key={value}
                        className={clsx(styles.attributeValue,
                          isChecked && styles.attributeValue_checked,
                          !isValid && styles.invalidAttributeValue)}
                        onClick={handleClick}
                      >
                        {origValue && origValue.icon && (
                          <div
                            style={{ backgroundImage: `url(${origValue.icon}` }}
                            className={styles.attributeValueIcon}></div>
                        )}
                        <p className={styles.attributeValueText} style={{ textTransform: 'none' }}>{value}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}