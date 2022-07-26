import { getRandStr, TAttribute, TProduct, TProductVariant } from '@cromwell/core';
import { DeleteForever, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Box, Button, Collapse, IconButton } from '@mui/material';
import React, { useState } from 'react';
import clone from 'rfdc';

import { SelectInput } from '../../components/inputs/SelectInput';
import MainInfoCard from './MainInfoCard';
import styles from './Product.module.scss';

export function VariantsTab({ product, setProdData, forceUpdate, attributes }: {
  product: TProduct;
  attributes: TAttribute[];
  setProdData: (data: TProduct) => void;
  forceUpdate: () => void;
}) {
  const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({});

  if (product.variants?.length) {
    for (const variant of product.variants) {
      if (!variant.id) variant.id = getRandStr(8) as any;
    }
  }

  const handleAddProductVariant = () => {
    setProdData({
      ...product,
      variants: [...(product?.variants ?? []), {
        id: getRandStr(8) as any,
      }],
    });
    forceUpdate();
  }

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
      }
      const scrollParent: HTMLElement | undefined = getScrollParent(document.getElementById('product-variants-tab'));
      if (scrollParent) scrollParent.scrollTop = scrollParent.scrollTop - 60;
    }, 10);
  }

  return (
    <Box id="product-variants-tab" sx={{ width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        {product?.variants?.map((variant) => (
          <Box key={variant.id} id={`variant-${variant.id}`} className={styles.paper} sx={{ mb: 4, width: '100%' }}>
            <Box
              sx={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', p: 1,
                borderBottom: expandedVariants[variant.id] && '1px solid #aaa'
              }}>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }} flexWrap="wrap" justifyContent="space-between">
                {attributes?.map(attr => (
                  <SelectInput
                    label={attr.key}
                    key={attr.key}
                    options={[...attr.values.map(value => ({
                      label: value.value,
                      value: value.value,
                    })), {
                      label: 'any',
                      value: 'any'
                    }]}
                    value={variant.attributes?.[attr.key] ?? 'any'}
                    style={{ marginRight: '15px', minWidth: '100px' }}
                    onChange={(value) => {
                      const newProduct = clone({ proto: true })(product);
                      newProduct.variants = newProduct.variants.map(v => {
                        if (v.id === variant.id) {
                          v.attributes = {
                            ...(v.attributes ?? {}),
                            [attr.key]: value,
                          }
                        }
                        return v;
                      });
                      setProdData(newProduct);
                      forceUpdate();
                    }}
                  />
                ))}
              </Box>
              <Box>
                <IconButton
                  onClick={() => {
                    const newProduct = clone({ proto: true })(product);
                    newProduct.variants = newProduct.variants.filter(v => variant.id !== v.id);
                    setProdData(newProduct);
                    forceUpdate();
                  }}
                >
                  <DeleteForever />
                </IconButton>
                <IconButton
                  onClick={() => expandVariant(variant.id)}
                  style={{ transform: expandedVariants[variant.id] ? 'rotate(180deg)' : '' }}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
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
                    newProduct.variants = newProduct.variants.map(v => {
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
      <Box sx={{ width: '100%', my: 4 }}>
        <Button variant="contained" sx={{ mx: 'auto', display: 'block' }}
          onClick={handleAddProductVariant}>Add product variant</Button>
      </Box>
    </Box>
  )
}