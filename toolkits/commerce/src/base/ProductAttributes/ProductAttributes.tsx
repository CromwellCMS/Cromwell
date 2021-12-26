import { TAttribute, TAttributeInstance, TAttributeInstanceValue, TProduct } from '@cromwell/core';
import { CContainer, getCStore, getGraphQLClient, getGraphQLErrorInfo } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import { useForceUpdate } from '../../helpers/forceUpdate';
import { moduleState } from '../../helpers/state';
import styles from './ProductAttributes.module.scss';

export type ProductAttributesProps = {
  /** Product data. Required */
  product?: TProduct | null;

  /** All available attributes */
  attributes?: TAttribute[];

  /** 
   * Called when user picks any attribute. If picked value of an attribute has assigned
   * product variant, it applies modifications of variant to original "product" prop
   * and calls this method.
   * */
  onChange?: (checkedAttributes: Record<string, string[]>, modifiedProduct: TProduct) => void;

  /** UI elements to replace default ones */
  elements?: {
    /** Component for a value of an attribute. Must implement onClick prop */
    AttributeValue?: React.ComponentType<{
      onClick: () => void;
      value: string;
      checked: boolean;
      valid?: boolean;
      icon?: string;
      attribute?: TAttribute;
      attributeInstance?: TAttributeInstance;
    }>;
    AttributeTitle?: React.ComponentType<{
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
  const { product, onChange,
    canValidate = product?.id ? moduleState.products[product.id]?.canValidate : undefined } = props;
  const attributesRef = useRef(props.attributes);
  if (props.attributes && props.attributes !== attributesRef.current) {
    attributesRef.current = props.attributes;
  }
  const productAttributes = product?.attributes;
  const [checkedAttrs, setCheckedAttrs] = useState<Record<string, string[]>>({});
  const cstore = getCStore();
  const ValueComp = props.elements?.AttributeValue;
  const TitleComp = props.elements?.AttributeTitle ?? (
    (props) => <p>{props.attribute?.key}</p>
  );
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    checkAttributesData();

    const onUpdateId = product?.id && moduleState.addOnProductUpdateListener(product.id, () => {
      forceUpdate();
    });

    return () => {
      if (product?.id) {
        delete moduleState.products[product.id];
        if (onUpdateId) {
          moduleState.removeOnProductUpdateListener(product?.id, onUpdateId);
        }
      }
    }
  }, []);

  const checkAttributesData = async () => {
    const client = getGraphQLClient();
    if (!attributesRef.current) {
      try {
        attributesRef.current = await client?.getAttributes();
        forceUpdate();
      } catch (e) {
        console.error('ProductAttributes::checkAttributesData', getGraphQLErrorInfo(e))
      }
    }
  }

  const handleSetAttribute = (key: string, checks: string[]) => {
    if (!product) return;
    setCheckedAttrs(prev => {
      const newCheckedAttrs: Record<string, string[]> = Object.assign({}, prev);
      newCheckedAttrs[key] = checks;
      const modifiedProduct = cstore.applyProductVariants(product, newCheckedAttrs)

      onChange?.(newCheckedAttrs, modifiedProduct);
      moduleState.setCheckedAttributes(product.id, newCheckedAttrs, modifiedProduct);

      return newCheckedAttrs;
    })
  };

  return (
    <CContainer className={clsx(styles.ProductAttributes,
      !!canValidate && styles.productAttributesValidate)}
      id="ccom_product_attributes"
    >
      {productAttributes?.map(attr => {
        const checked: string[] | undefined = checkedAttrs[attr.key];
        const origAttribute = attributesRef.current?.find(a => a.key === attr.key);
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
    </CContainer>
  )
}