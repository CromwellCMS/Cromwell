import { getRandStr, TAttribute, TProduct, TProductVariant } from '@cromwell/core';
import { DeleteForever, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Box, Button, Collapse, IconButton } from '@mui/material';
import React, { useState } from 'react';
import clone from 'rfdc';

import { Select } from '../../components/select/Select';
import { toast } from '../../components/toast/toast';
import MainInfoCard from './MainInfoCard';
import styles from './Product.module.scss';

export default function VariantsTab({ product, setProdData, forceUpdate }: {
  product: TProduct;
  attributes: TAttribute[];
  setProdData: (data: TProduct) => void;
  forceUpdate: () => void;
}) {
  const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({});

  const usedAttributes = (product.attributes ?? []).filter(attr => attr.values?.length && attr.key)
    .map(attr => ({ ...attr, values: attr.values.filter(Boolean) }));

  if (product.variants?.length) {
    for (const variant of product.variants) {
      if (!variant.id) variant.id = getRandStr(8) as any;
    }
  }

  const handleAddProductVariant = () => {
    if (!usedAttributes.length) {
      toast.warn('No attributes selected');
      return;
    }
    setProdData({
      ...product,
      variants: [...(product?.variants ?? []), {
        id: getRandStr(8) as any,
      }],
    });
    forceUpdate();
  }

  return (
    <Box>
      <Box>
        {product?.variants?.map((variant) => (
          <Box key={variant.id} className={styles.paper} sx={{ my: 2 }}>
            <Box onClick={() => setExpandedVariants({
              ...expandedVariants,
              [variant.id]: !expandedVariants[variant.id]
            })}
              sx={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', cursor: 'pointer', p: 1,
                borderBottom: expandedVariants[variant.id] && '1px solid #aaa'
              }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {usedAttributes.map(attr => (
                  <Select
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
                    size="small"
                    sx={{ mr: 2 }}
                    onClick={event => event.stopPropagation()}
                    onChange={(event) => {
                      const newProduct = clone({ proto: true })(product);
                      newProduct.variants = newProduct.variants.map(v => {
                        if (v.id === variant.id) {
                          v.attributes = {
                            ...(v.attributes ?? {}),
                            [attr.key]: event.target.value,
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
                  style={{ transform: expandedVariants[variant.id] ? 'rotate(180deg)' : '' }}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
            </Box>
            <Collapse in={expandedVariants[variant.id]} timeout="auto" unmountOnExit>
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
                    forceUpdate();
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