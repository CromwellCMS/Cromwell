import { TPagedParams, TProduct, TProductCategory, TAttribute } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForceUpdate } from '../../helpers/forceUpdate';

import { TFieldsComponentProps } from '../../components/entity/entityEdit/EntityEdit';
import { SearchInput } from '../../components/inputs/Search/SearchInput';
import { useTabs } from './Header';
import MainInfoCard from './MainInfoCard';
import { store } from './Product';
import { VariantsTab } from './VariantsTab';

export const PageContent = ({ entityData, canValidate }: TFieldsComponentProps<TProduct>) => {
  const client = getGraphQLClient();
  const productRef = React.useRef<TProduct | null>(entityData);
  const [mainCategory, setMainCategory] = useState<TProductCategory | null>(null);
  const [activeTabNum] = useTabs();
  const [attributes, setAttributes] = useState<TAttribute[]>([]);
  const forceUpdate = useForceUpdate();

  const setProdData = (data: Partial<TProduct>) => {
    productRef.current = Object.assign({}, productRef.current, data);
    store.product = productRef.current;
  }

  const handleSearchCategory = async (text: string, params: TPagedParams<TProductCategory>) => {
    return client.getProductCategories({
      filterParams: {
        nameSearch: text
      },
      pagedParams: params
    });
  }

  const handleChangeCategories = (data: TProductCategory[]) => {
    if (!data?.length) setProdData({ categories: null })
    else setProdData({ categories: data })
  }

  const handleMainCategoryChange = (data: TProductCategory | null) => {
    if (productRef.current?.mainCategoryId === data?.id) return;
    setProdData({ mainCategoryId: data?.id || null });
  }

  useEffect(() => {
    getMainCategory();
    getAttributes();
  }, []);

  const getMainCategory = async () => {
    if (productRef.current?.mainCategoryId) {
      try {
        const main = await client.getProductCategoryById(productRef.current?.mainCategoryId);
        if (main) {
          setMainCategory(main);
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  const getAttributes = async () => {
    try {
      const attr = await client?.getAttributes({ pagedParams: { pageSize: 1000 } });
      if (attr?.elements) setAttributes(attr.elements);
    } catch (e) { console.error(e) }
  }

  return (
    <Box sx={{ p: 3, pb: 0, width: '100%' }}>
      {activeTabNum === 0 && (<>
        <MainInfoCard
          product={productRef.current}
          setProdData={setProdData}
          canValidate={canValidate}
        />
        <SearchInput<TProductCategory>
          multiple
          loader={handleSearchCategory}
          onSelect={handleChangeCategories}
          getOptionLabel={(data) => `${data.name} (id: ${data.id}${data?.parent?.id ? `; parent id: ${data.parent.id}` : ''})`}
          getOptionValue={(data) => data.name}
          fullWidth
          defaultValue={productRef.current.categories ?? []}
          label={"Categories"}
          style={{ margin: '25px 0' }}
        />
        <SearchInput<TProductCategory>
          loader={handleSearchCategory}
          onSelect={handleMainCategoryChange}
          getOptionLabel={(data) => `${data.name} (id: ${data.id}${data?.parent?.id ? `; parent id: ${data.parent.id}` : ''})`}
          getOptionValue={(data) => data.name}
          fullWidth
          defaultValue={mainCategory}
          label={"Main category"}
          style={{ margin: '15px 0' }}
        />
      </>)}
      {activeTabNum === 1 && (<>
        <VariantsTab
          forceUpdate={forceUpdate}
          product={productRef.current}
          setProdData={setProdData}
          attributes={attributes}
        />
      </>)}
    </Box>
  )

}
