import { TAttribute, TAttributeInstanceValue, TAttributeProductVariant, TProduct } from '@cromwell/core';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon, HighlightOff as HighlightOffIcon } from '@mui/icons-material';
import { Button, Fade, IconButton, MenuItem, Paper, Popper, Tooltip } from '@mui/material';
import React from 'react';

import TransferList from '../../components/transferList/TransferList';
import MainInfoCard from './MainInfoCard';
import { TInfoCardRef } from './Product';
import styles from './Product.module.scss';


export default function AttributesTab(props: {
    product: TProduct;
    attributes: TAttribute[];
    setProdData: (data: TProduct) => void;
    infoCardRef: React.MutableRefObject<TInfoCardRef>;
    forceUpdate: () => void;
}) {
    const { product, attributes, setProdData, infoCardRef, forceUpdate } = props;
    const [editingProductVariant, setEditingProductVariant] = React.useState<{
        prodAttrIdx: number; value: string;
    } | null>(null);
    const [popperAnchorEl, setPopperAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [popperOpen, setPopperOpen] = React.useState(false);

    const leftAttributesToAdd: TAttribute[] = [];

    attributes.forEach(attr => {
        if (product) {
            const hasAttr = product.attributes ? product.attributes.some(a => a.key === attr.key) : false;
            if (!hasAttr) {
                leftAttributesToAdd.push(attr);
            }
        }
    });

    return (
        <div>
            {product.attributes && attributes && (
                product.attributes.map((prodAttr, prodAttrIdx) => {
                    let origAttr: TAttribute | undefined = undefined;
                    for (const attr of attributes) {
                        if (attr.key === prodAttr.key) origAttr = attr;
                    }
                    if (origAttr) {
                        const leftValues = origAttr.values.filter(v => !prodAttr.values.some(pv => pv.value === v.value))
                        const rightValues = prodAttr.values.map(v => v.value);
                        return (
                            <div className={styles.attributeBlock} key={prodAttr.key}>
                                <div className={styles.attributeHeader}>
                                    <p className={styles.tag}>{prodAttr.key}</p>
                                    <Tooltip title="Delete attribute">
                                        <IconButton
                                            aria-label="delete attribute"
                                            onClick={() => {
                                                const prod: TProduct = JSON.parse(JSON.stringify(product));
                                                if (prod.attributes) {
                                                    prod.attributes = prod.attributes.filter((a, i) => i !== prodAttrIdx);
                                                    setProdData(prod);
                                                    forceUpdate();
                                                }
                                            }}
                                        ><DeleteForeverIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <TransferList
                                    left={leftValues.map(v => v.value)}
                                    setLeft={() => { }}
                                    right={rightValues}
                                    itemComp={(props) => (
                                        <div className={styles.attributeInstanceValue}>
                                            <p>{props.value}</p>
                                            {rightValues.includes(props.value) && (
                                                <Tooltip title="Edit product variant">
                                                    <IconButton
                                                        aria-label="edit product variant"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingProductVariant({
                                                                prodAttrIdx,
                                                                value: props.value
                                                            })
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </div>
                                    )}
                                    setRight={(val) => {
                                        const prod: TProduct = JSON.parse(JSON.stringify(product));
                                        if (!prod.attributes) prod.attributes = [];

                                        const newVals: TAttributeInstanceValue[] = [];
                                        val.forEach(newVal => {
                                            let hasVal = false;
                                            prod.attributes[prodAttrIdx].values.forEach(prodVal => {
                                                if (prodVal.value === newVal) {
                                                    newVals.push(prodVal);
                                                    hasVal = true;
                                                }
                                            })
                                            if (!hasVal) {
                                                newVals.push({
                                                    value: newVal
                                                });
                                            }
                                        });

                                        prod.attributes[prodAttrIdx].values = newVals.sort((a, b) => a.value > b.value ? 1 : -1);
                                        setProdData(prod);
                                        forceUpdate();
                                    }}
                                />
                                {editingProductVariant && editingProductVariant.prodAttrIdx === prodAttrIdx && (
                                    <div className={styles.editingProductVariant}>
                                        <div className={styles.attributeHeader}>
                                            <p className={styles.editingProductVariantTitle}>Editing product variant for value:
                                                <span className={styles.tag}>{editingProductVariant.value}</span>
                                            </p>
                                            <div>
                                                <Tooltip title="Close">
                                                    <IconButton
                                                        aria-label="close"
                                                        onClick={() => {
                                                            setEditingProductVariant(null)
                                                        }}
                                                    >
                                                        <HighlightOffIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <div className={styles.editingProductVariantCard}>
                                            <MainInfoCard
                                                infoCardRef={infoCardRef}
                                                productVariantVal={editingProductVariant.value}
                                                product={prodAttr.values.find(a => a.value === editingProductVariant.value)?.productVariant || product}
                                                setProdData={(data: TAttributeProductVariant) => {
                                                    const prod: TProduct = JSON.parse(JSON.stringify(product));
                                                    if (prod.attributes) {
                                                        prod.attributes[prodAttrIdx].values = prod.attributes[prodAttrIdx].values.map(val => {
                                                            if (val.value === editingProductVariant.value) {
                                                                return {
                                                                    value: val.value,
                                                                    productVariant: data
                                                                }
                                                            } else return val;
                                                        });
                                                        setProdData(prod);
                                                    }
                                                }}
                                                isProductVariant
                                            />
                                        </div>

                                    </div>
                                )}
                            </div>
                        )
                    }
                })
            )}
            <div style={{ width: '100%', display: 'flex' }}>
                <Button
                    className={styles.addAttributeBtn}
                    variant="contained"
                    color="primary"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        setPopperAnchorEl(event.currentTarget);
                        setPopperOpen((prev) => !prev);
                    }}
                    disabled={!leftAttributesToAdd.length}
                >Add attribute</Button>
            </div>
            <Popper open={popperOpen} anchorEl={popperAnchorEl} placement={'bottom-start'} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper className={styles.newAttributesList}>
                            {leftAttributesToAdd.map(attr => {
                                return (
                                    <MenuItem
                                        key={attr.key}
                                        onClick={() => {
                                            const prod: TProduct = JSON.parse(JSON.stringify(product));
                                            if (!prod.attributes) prod.attributes = [];
                                            prod.attributes.push({
                                                key: attr.key,
                                                values: []
                                            })
                                            setPopperOpen(false);
                                            setProdData(prod);
                                        }}
                                        className={styles.newAttributeOption}
                                    >{attr.key}</MenuItem>
                                )
                            })}
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div>
    )
}
