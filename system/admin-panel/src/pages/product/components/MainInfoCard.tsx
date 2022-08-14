import { EDBEntity, getRandStr, TProduct, TProductVariant, TStockStatus } from '@cromwell/core';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Grid, Tooltip } from '@mui/material';
import React, { useEffect, useMemo, useRef } from 'react';
import { debounce } from 'throttle-debounce';

import { GalleryPicker } from '../../../components/inputs/GalleryInput/GalleryInput';
import { SelectInput } from '../../../components/inputs/SelectInput';
import { SwitchInput } from '../../../components/inputs/SwitchInput';
import { TextInput } from '../../../components/inputs/TextInput';
import { getCustomMetaFor, RenderCustomFields } from '../../../helpers/customFields';
import { getEditorData, getEditorHtml, initTextEditor } from '../../../helpers/editor/editor';
import { useForceUpdate } from '../../../helpers/forceUpdate';
import styles from '../Product.module.scss';

const MainInfoCard = (props: {
  product: TProduct | TProductVariant,
  setProdData: (data: Partial<TProduct | TProductVariant>) => void;
  isProductVariant?: boolean;
  canValidate?: boolean;
}) => {
  const productPrevRef = useRef<TProductVariant | TProduct | null>(props.product);
  const cardIdRef = useRef<string>(getRandStr(10));
  const productRef = useRef<TProductVariant | TProduct | null>(props.product);
  const canUpdateMeta = useRef<boolean>(false);
  if (props.product !== productPrevRef.current) {
    productPrevRef.current = props.product;
    productRef.current = props.product;
  }
  const forceUpdate = useForceUpdate();
  const editorId = "prod-text-editor_" + cardIdRef.current;
  const product = productRef.current;

  const setProdData = (data: TProduct) => {
    Object.keys(data).forEach(key => { productRef.current[key] = data[key] });
    props.setProdData(data);
  }

  useEffect(() => {
    init();
  }, [])

  const init = async () => {
    let descriptionDelta;
    if (product?.descriptionDelta) {
      try {
        descriptionDelta = JSON.parse(product.descriptionDelta);
      } catch (e) { console.error(e) }
    }

    const updateText = debounce(300, async () => {
      const description = await getEditorHtml(editorId);
      const descriptionDelta = JSON.stringify(await getEditorData(editorId));

      productRef.current.description = description;
      productRef.current.descriptionDelta = descriptionDelta;

      props.setProdData({
        ...productRef.current,
        description,
        descriptionDelta,
      });
    })

    await initTextEditor({
      htmlId: editorId,
      data: descriptionDelta,
      placeholder: 'Product description...',
      onChange: updateText,
    });
  }

  const handleChange = (prop: keyof TProduct, val: any) => {
    if (product) {
      const prod = Object.assign({}, product, {
        [prop]: val,
      });
      if (prop === 'images') {
        prod.mainImage = val?.[0];
      }
      setProdData(prod as TProduct);
      forceUpdate();
    }
  }

  const onMetaChange = useMemo(() => {
    return debounce(300, async () => {
      if (!canUpdateMeta.current) return;
      const meta = await getCustomMetaFor(EDBEntity.ProductVariant);
      setProdData(Object.assign({}, product, { customMeta: meta }) as TProduct);
    });
  }, []);

  if (!product) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12}>
        <TextInput label="Name"
          value={product.name ?? ''}
          className={styles.textField}
          onChange={(e) => { handleChange('name', e.target.value) }}
          error={props.canValidate && !product?.name}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextInput label="SKU"
          value={product.sku ?? ''}
          className={styles.textField}
          onChange={(e) => { handleChange('sku', e.target.value) }}
        />
      </Grid>
      <Grid item xs={12} sm={6}></Grid>
      <Grid item xs={12} sm={6}>
        <SelectInput
          label="Stock status"
          value={product.stockStatus}
          onChange={(value) => { handleChange('stockStatus', value) }}
          options={['In stock', 'Out of stock', 'On backorder'] as TStockStatus[]}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextInput label="Stock amount"
          value={product.stockAmount ?? ''}
          className={styles.textField}
          type="number"
          onChange={(e) => {
            let val = parseInt(e.target.value);
            if (isNaN(val)) val = null;
            if (val && val < 0) val = 0;
            handleChange('stockAmount', val);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} style={{ display: 'flex', alignItems: 'center' }}>
        <SwitchInput
          label="Manage stock"
          value={!!product?.manageStock}
          onChange={() => handleChange('manageStock', !product?.manageStock)}
        />
        <Tooltip title="Automatically manage stock amount when new orders placed">
          <InfoOutlinedIcon sx={{ height: '20px', width: '20px', ml: 2 }} />
        </Tooltip>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextInput
          label="Price"
          type="currency"
          value={product.price ?? ''}
          className={styles.textField}
          onChange={(e) => { handleChange('price', e.target.value) }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextInput
          label="Old price"
          type="currency"
          value={product.oldPrice ?? ''}
          className={styles.textField}
          onChange={(e) => {
            const val = e.target.value;
            handleChange('oldPrice', val ? val : null);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <div className={styles.imageBlock}>
          <GalleryPicker
            classes={{
              imageInput: {
                root: styles.imageItem
              }
            }}
            label="Gallery"
            images={((product as TProduct)?.images ?? []).map(src => ({ src }))}
            onChange={(val) => handleChange('images', val.map(s => s.src))}
          />
        </div>
      </Grid>
      <Grid item xs={12} sm={12}>
        <div className={styles.descriptionEditor}>
          <div style={{ minHeight: '300px' }} id={editorId}></div>
        </div>
      </Grid>
      {props.isProductVariant && (
        <Grid item xs={12} sm={12}>
          <RenderCustomFields
            entityType={EDBEntity.ProductVariant}
            entityData={product}
            refetchMeta={async () => product.customMeta}
            onChange={onMetaChange}
            onDidMount={() => setTimeout(() => canUpdateMeta.current = true, 10)}
          />
        </Grid>
      )}
    </Grid>
  )
}

export default MainInfoCard;
