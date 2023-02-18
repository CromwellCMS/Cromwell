import { getRandStr, TAttribute, TProduct, TProductVariant } from '@cromwell/core';
import { PencilIcon, TrashIcon, PlusIcon, CogIcon } from '@heroicons/react/24/outline';
import { Box, Collapse, Popover } from '@mui/material';
import React, { useState } from 'react';
import clone from 'rfdc';

import { IconButton } from '../../../components/buttons/IconButton';
import { TextButton } from '../../../components/buttons/TextButton';
import { SelectInput } from '../../../components/inputs/SelectInput';
import { SwitchInput } from '../../../components/inputs/SwitchInput';
import { askConfirmation } from '../../../components/modal/Confirmation';
import commonStyles from '../../../styles/common.module.scss';
import MainInfoCard from './MainInfoCard';
import styles from '../Product.module.scss';

export function VariantsTab({
  product,
  setProdData,
  forceUpdate,
  usedVariantAttributes,
  attributes,
  setUsedVariantAttributes,
}: {
  product: TProduct;
  attributes: TAttribute[];
  setProdData: (data: TProduct) => void;
  forceUpdate: () => void;
  usedVariantAttributes: string[];
  setUsedVariantAttributes: (value: string[]) => void;
}) {
  const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({});
  const [isEditingAttributes, setIsEditingAttributes] = useState(false);
  const [popperAnchorEl, setPopperAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  if (product.variants?.length) {
    for (const variant of product.variants) {
      if (!variant.id) variant.id = getRandStr(8) as any;
    }
  }

  const handleAddProductVariant = () => {
    setProdData({
      ...product,
      variants: [
        ...(product?.variants ?? []),
        {
          id: getRandStr(8) as any,
        },
      ],
    });
    forceUpdate();
  };

  const expandVariant = (id: number) => {
    setExpandedVariants({
      [id]: !expandedVariants[id],
    });
    setTimeout(() => {
      document.getElementById(`variant-${id}`).scrollIntoView();

      const getScrollParent = (node) => {
        if (!node) return;
        if (node.scrollHeight > node.clientHeight) {
          return node;
        } else {
          return getScrollParent(node.parentNode);
        }
      };
      const scrollParent: HTMLElement | undefined = getScrollParent(document.getElementById('product-variants-tab'));
      if (scrollParent) scrollParent.scrollTop = scrollParent.scrollTop - 90;
    }, 10);
  };

  const handleDeleteVariant = async (variant: TProductVariant) => {
    if (!(await askConfirmation({ title: 'Delete variant?' }))) return;
    const newProduct = clone({ proto: true })(product);
    newProduct.variants = newProduct.variants.filter((v) => variant.id !== v.id);
    setProdData(newProduct);
    forceUpdate();
  };

  const onAttributeChange = (variant: TProductVariant, attribute: TAttribute, value: string | number) => {
    const newProduct = clone({ proto: true })(product);
    newProduct.variants = newProduct.variants.map((v) => {
      if (v.id === variant.id) {
        v.attributes = {
          ...(v.attributes ?? {}),
          [attribute.key]: value,
        };
      }
      return v;
    });
    setProdData(newProduct);
    forceUpdate();
  };

  const handleEditAttributes = (event) => {
    setPopperAnchorEl(event.currentTarget);
    setIsEditingAttributes(!isEditingAttributes);
  };

  const onUsedAttributeChange = (key: string) => {
    const used = !!usedVariantAttributes.includes(key);
    if (!used) setUsedVariantAttributes([key, ...usedVariantAttributes]);
    else {
      setUsedVariantAttributes(usedVariantAttributes.filter((a) => a !== key));

      const newProduct = clone({ proto: true })(product);
      newProduct.variants = newProduct.variants.map((v) => {
        if (v.attributes) delete v.attributes[key];
        return v;
      });
      setProdData(newProduct);
      forceUpdate();
    }
  };

  return (
    <Box id="product-variants-tab" sx={{ width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        {product?.variants?.map((variant) => (
          <Box key={variant.id} id={`variant-${variant.id}`} className={styles.paper} sx={{ mb: 4, width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 1,
                borderBottom: expandedVariants[variant.id] && '2px dashed #ddd',
                minHeight: '50px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }} flexWrap="wrap" justifyContent="space-between">
                {attributes
                  ?.filter((attr) => usedVariantAttributes.includes(attr.key))
                  ?.map((attr) => (
                    <SelectInput
                      label={attr.key}
                      key={attr.key}
                      options={[
                        ...attr.values.map((value) => ({
                          label: value.value,
                          value: value.value,
                        })),
                        {
                          label: 'any',
                          value: 'any',
                        },
                      ]}
                      value={variant.attributes?.[attr.key] ?? 'any'}
                      style={{ margin: '10px 15px 10px 0', minWidth: '100px' }}
                      onChange={(value) => onAttributeChange(variant, attr, value)}
                    />
                  ))}
              </Box>
              <Box>
                <IconButton onClick={() => expandVariant(variant.id)} aria-label="show more">
                  <PencilIcon className="w-5 h-5" />
                </IconButton>
                <IconButton onClick={() => handleDeleteVariant(variant)}>
                  <TrashIcon className="w-5 h-5" />
                </IconButton>
              </Box>
            </Box>
            <Collapse in={expandedVariants[variant.id]} timeout={0} unmountOnExit>
              <Box sx={{ my: 1, p: 2 }}>
                <MainInfoCard
                  product={variant}
                  setProdData={(data: TProductVariant) => {
                    const newProduct = clone({ proto: true })(product);
                    if (!newProduct.variants) newProduct.variants = [];
                    newProduct.variants = newProduct.variants.map((v) => {
                      if (v.id === variant.id) {
                        return { ...data };
                      }
                      return v;
                    });
                    setProdData(newProduct);
                  }}
                  isProductVariant
                />
              </Box>
            </Collapse>
          </Box>
        ))}
      </Box>
      <Box sx={{ width: '100%', my: 4, display: 'flex' }}>
        <Box sx={{ mx: 'auto', display: 'flex' }}>
          <TextButton
            style={{ marginRight: '15px' }}
            onClick={handleAddProductVariant}
            disabled={!usedVariantAttributes?.length}
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            Add product variant
          </TextButton>
          <TextButton onClick={handleEditAttributes}>
            <CogIcon className="w-5 h-5 mr-1" />
            Edit attributes
          </TextButton>
          <Popover
            open={isEditingAttributes}
            anchorEl={popperAnchorEl}
            classes={{ paper: styles.popoverPaper }}
            elevation={0}
            onClose={handleEditAttributes}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <div className={styles.newAttributesList}>
              {attributes.map((attr) => {
                return (
                  <div
                    key={attr.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      minWidth: '20px',
                      padding: '10px 15px',
                    }}
                  >
                    <div className={commonStyles.center}>
                      <SwitchInput
                        value={!!usedVariantAttributes.includes(attr.key)}
                        onChange={() => onUsedAttributeChange(attr.key)}
                        label={attr.key}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Popover>
        </Box>
      </Box>
    </Box>
  );
}
