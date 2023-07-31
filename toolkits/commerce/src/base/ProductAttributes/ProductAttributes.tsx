import { TAttribute, TAttributeInstance, TAttributeInstanceValue, TProduct } from '@cromwell/core';
import { getCStore, useForceUpdate } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { useModuleState } from '../../helpers/state';
import { useStoreAttributes } from '../../helpers/useStoreAttributes';
import styles from './ProductAttributes.module.scss';

export type ProductAttributesProps = {
  classes?: Partial<
    Record<
      | 'root'
      | 'attribute'
      | 'headerWrapper'
      | 'valuesWrapper'
      | 'attributeValue'
      | 'attributeValueIcon'
      | 'attributeValueText'
      | 'productAttributesValidate'
      | 'attributeValueChecked'
      | 'invalidAttributeValue',
      string
    >
  >;

  /** UI elements to replace default ones */
  elements?: {
    /** Component for a value of an attribute. Must implement onClick prop */
    AttributeValue?: React.ComponentType<{
      onClick?: () => void;
      onInputChange?: (value: string) => void;
      value: string;
      checked?: boolean;
      valid?: boolean;
      canValidate?: boolean;
      icon?: string | null;
      attribute?: TAttribute;
      attributeInstance?: TAttributeInstance;
      classes?: Partial<
        Record<
          | 'attributeValue'
          | 'attributeValueIcon'
          | 'attributeValueText'
          | 'productAttributesValidate'
          | 'attributeValueChecked'
          | 'invalidAttributeValue',
          string
        >
      >;
    }>;
    /** Title of attribute block */
    AttributeTitle?: React.ComponentType<{
      attribute?: TAttribute;
      valid?: boolean;
      canValidate?: boolean;
    }>;
  };

  /** Product data. Required */
  product: TProduct;

  /** All available attributes */
  attributes?: TAttribute[];

  /**
   * Called when user picks any attribute. If picked value of an attribute has assigned
   * product variant, it applies modifications of variant to original "product" prop
   * and calls this method. *Prefer to use `useProductVariants` hook instead.*
   */
  onChange?: (checkedAttributes: Record<string, string[]>, modifiedProduct: TProduct) => void;

  /**
   * Show error if some required attributes weren't selected?
   */
  canValidate?: boolean;
};

/**
 * Displays product's attributes.
 * When user picks an attribute applies product variant and returns modified
 * product from `onChange` function prop.
 */
export function ProductAttributes(props: ProductAttributesProps): JSX.Element {
  const moduleState = useModuleState();
  const {
    product,
    onChange,
    classes,
    canValidate = product?.id ? moduleState.products[product.id]?.canValidate : undefined,
  } = props;
  const attributes = useStoreAttributes(props.attributes);
  const productAttributes = product?.attributes;
  const [checkedAttrs, setCheckedAttrs] = useState<Record<string, string[]>>({});
  const cstore = getCStore();
  const ValueComp = props.elements?.AttributeValue;
  const TitleComp = props.elements?.AttributeTitle ?? DefaultTitleComp;
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const onUpdateId =
      product?.id &&
      moduleState.addOnProductUpdateListener(product.id, () => {
        forceUpdate();
      });

    return () => {
      if (product?.id) {
        delete moduleState.products[product.id];
        if (onUpdateId) {
          moduleState.removeOnProductUpdateListener(product?.id, onUpdateId);
        }
      }
    };
  }, []);

  const handleSetAttribute = (key: string, checks: string[]) => {
    if (!product) return;
    setCheckedAttrs((prev) => {
      const newCheckedAttrs: Record<string, string[]> = Object.assign({}, prev);
      newCheckedAttrs[key] = checks;
      const modifiedProduct = cstore.applyProductVariants(product, newCheckedAttrs);

      onChange?.(newCheckedAttrs, modifiedProduct);
      moduleState.setCheckedAttributes(product.id, newCheckedAttrs, modifiedProduct);

      return newCheckedAttrs;
    });
  };

  return (
    <div
      className={clsx(
        styles.ProductAttributes,
        classes?.root,
        !!canValidate && styles.productAttributesValidate,
        !!canValidate && classes?.productAttributesValidate,
      )}
    >
      {productAttributes?.map((attr) => {
        const checked: string[] | undefined = checkedAttrs[attr.key];
        const origAttribute = attributes?.find((a) => a.key === attr.key);
        let isValid = true;

        if (origAttribute?.required && origAttribute.key) {
          if (!checkedAttrs || !checkedAttrs[origAttribute.key] || !checkedAttrs[origAttribute.key].length)
            isValid = false;
        }

        if (origAttribute) {
          return (
            <div key={attr.key} className={clsx(styles.attribute, classes?.attribute)}>
              <div className={clsx(styles.headerWrapper, classes?.headerWrapper)}>
                <TitleComp attribute={origAttribute} valid={isValid} canValidate={canValidate} />
              </div>
              <div className={clsx(styles.valuesWrapper, classes?.valuesWrapper)}>
                {origAttribute.type === 'text_input' &&
                  (ValueComp ? (
                    <ValueComp
                      key={origAttribute.key}
                      value={'text_input'}
                      icon={origAttribute.icon}
                      valid={isValid}
                      attribute={origAttribute}
                      attributeInstance={attr}
                      canValidate={canValidate}
                      onInputChange={(value) => {
                        handleSetAttribute(attr.key, [value]);
                      }}
                    />
                  ) : (
                    <input
                      onChange={(e) => {
                        handleSetAttribute(attr.key, [e.target.value]);
                      }}
                    />
                  ))}
                {(origAttribute.type === 'radio' || origAttribute.type === 'checkbox') &&
                  attr.values.map((attrValue: TAttributeInstanceValue) => {
                    const value = attrValue.value;
                    const origValue = origAttribute?.values?.find((v) => v.value === value);
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
                      };

                      if (ValueComp) {
                        return (
                          <ValueComp
                            key={value}
                            onClick={handleClick}
                            value={value}
                            icon={origValue.icon}
                            checked={isChecked}
                            valid={isValid}
                            attribute={origAttribute}
                            attributeInstance={attr}
                            canValidate={canValidate}
                          />
                        );
                      }

                      return (
                        <div
                          key={value}
                          className={clsx(
                            styles.attributeValue,
                            classes?.attributeValue,
                            isChecked && styles.attributeValueChecked,
                            isChecked && classes?.attributeValueChecked,
                            !isValid && styles.invalidAttributeValue,
                            !isValid && classes?.invalidAttributeValue,
                          )}
                          onClick={handleClick}
                        >
                          {origValue && origValue.icon && (
                            <div
                              style={{ backgroundImage: `url(${origValue.icon}` }}
                              className={clsx(styles.attributeValueIcon, classes?.attributeValueIcon)}
                            ></div>
                          )}
                          <p
                            className={clsx(styles.attributeValueText, classes?.attributeValueText)}
                            style={{ textTransform: 'none' }}
                          >
                            {value}
                          </p>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

const DefaultTitleComp: Required<Required<ProductAttributesProps>['elements']>['AttributeTitle'] = (props) => (
  <p style={{ margin: 0 }}>{props.attribute?.key}</p>
);
