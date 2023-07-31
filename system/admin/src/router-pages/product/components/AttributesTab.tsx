import { TAttribute, TAttributeInstanceValue, TProduct } from '@cromwell/core';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Box, Fade, MenuItem, Popper } from '@mui/material';
import React from 'react';

import { IconButton } from '../../../components/buttons/IconButton';
import { TextButton } from '../../../components/buttons/TextButton';
import TransferList from '../../../components/transferList/TransferList';
import styles from '../Product.module.scss';

export function AttributesTab(props: {
  product: TProduct;
  attributes: TAttribute[];
  setProdData: (data: TProduct) => void;
  forceUpdate: () => void;
}) {
  const { product, attributes, setProdData, forceUpdate } = props;
  const [popperAnchorEl, setPopperAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [popperOpen, setPopperOpen] = React.useState(false);

  const leftAttributesToAdd: TAttribute[] = [];

  attributes.forEach((attr) => {
    if (product) {
      const hasAttr = product.attributes ? product.attributes.some((a) => a.key === attr.key) : false;
      if (!hasAttr) {
        leftAttributesToAdd.push(attr);
      }
    }
  });

  const addAttribute = (key: string) => {
    const prod: TProduct = JSON.parse(JSON.stringify(product));
    if (!prod.attributes) prod.attributes = [];
    prod.attributes.push({
      key,
      values: [],
    });
    setPopperOpen(false);
    setProdData(prod);
    forceUpdate();
  };

  const deleteAttribute = (index: number) => {
    const prod: TProduct = JSON.parse(JSON.stringify(product));
    if (prod.attributes) {
      prod.attributes = prod.attributes.filter((a, i) => i !== index);
      setProdData(prod);
      forceUpdate();
    }
  };

  const setRight = (prodAttrIdx: number, val: string[]) => {
    const prod: TProduct = JSON.parse(JSON.stringify(product));
    if (!prod.attributes) prod.attributes = [];

    const newVals: TAttributeInstanceValue[] = [];
    val.forEach((newVal) => {
      let hasVal = false;
      prod.attributes?.[prodAttrIdx]?.values.forEach((prodVal) => {
        if (prodVal.value === newVal) {
          newVals.push(prodVal);
          hasVal = true;
        }
      });
      if (!hasVal) {
        newVals.push({
          value: newVal,
        });
      }
    });

    prod.attributes[prodAttrIdx].values = newVals.sort((a, b) => (a.value > b.value ? 1 : -1));
    setProdData(prod);
    forceUpdate();
  };

  return (
    <div className={styles.AttributesTab}>
      {product.attributes &&
        attributes &&
        product.attributes.map((prodAttr, prodAttrIdx) => {
          const attribute = attributes.find((a) => a.key === prodAttr.key);
          if (!attribute) return null;

          const leftValues = attribute.values?.filter((v) => !prodAttr.values.some((pv) => pv.value === v.value)) || [];
          const rightValues = prodAttr.values?.map((v) => v.value) || [];

          return (
            <div className={styles.attributeBlock} key={prodAttr.key}>
              <div className={styles.attributeHeader}>
                <p className={styles.attributeName}>{attribute.title || attribute.key || ''}</p>
                <IconButton aria-label="delete attribute" onClick={() => deleteAttribute(prodAttrIdx)}>
                  <TrashIcon className="w-5 h-5" />
                </IconButton>
              </div>
              {attribute.type !== 'text_input' && (
                <TransferList
                  text={{ choices: 'Available', chosen: 'Assigned' }}
                  left={leftValues.map((v) => v.value)}
                  setLeft={() => {}}
                  right={rightValues}
                  classes={{ checklist: styles.checklist }}
                  itemComp={(props) => (
                    <div className={styles.attributeInstanceValue}>
                      <p>{props.value}</p>
                    </div>
                  )}
                  setRight={(val) => setRight(prodAttrIdx, val)}
                />
              )}
            </div>
          );
        })}
      <Box sx={{ my: 1 }} style={{ width: '100%', display: 'flex' }}>
        <TextButton
          color="primary"
          style={{ margin: '0 auto' }}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setPopperAnchorEl(event.currentTarget);
            setPopperOpen((prev) => !prev);
          }}
          disabled={!leftAttributesToAdd.length}
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          Add attribute
        </TextButton>
      </Box>
      <Popper open={popperOpen} anchorEl={popperAnchorEl} placement={'bottom-start'} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div className={styles.newAttributesList}>
              {leftAttributesToAdd.map((attr) => {
                if (!attr.key) return null;
                return (
                  <MenuItem
                    disableRipple
                    key={attr.key}
                    onClick={() => addAttribute(attr.key!)}
                    className={styles.newAttributeOption}
                  >
                    {attr.title ?? attr.key ?? ''}
                  </MenuItem>
                );
              })}
            </div>
          </Fade>
        )}
      </Popper>
    </div>
  );
}
