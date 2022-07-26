import { EDBEntity, getRandStr, TPagedParams, TProduct, TProductCategory } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { SmartButton as SmartButtonIcon } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { SearchInput } from '../../components/inputs/Search/SearchInput';
import EntityEdit from '../../components/entity/entityEdit/EntityEdit';
import LoadBox from '../../components/loadBox/LoadBox';
import { couponListPageInfo, couponPageInfo } from '../../constants/PageInfos';


export default function CouponPage() {
  const client = getGraphQLClient();

  return <EntityEdit
    entityCategory={EDBEntity.Coupon}
    entityListRoute={couponListPageInfo.route}
    entityBaseRoute={couponPageInfo.baseRoute}
    listLabel="Coupons"
    entityLabel="Coupon"
    disableMeta
    getById={client.getCouponById}
    update={client.updateCoupon}
    create={client.createCoupon}
    deleteOne={client.deleteCoupon}
    fields={[
      {
        key: 'code',
        type: 'custom',
        label: 'Code',
        required: true,
        width: { sm: 6 },
        component: ({ value, onChange, canValidate, error }) => {
          const handleGenerateCode = () => {
            onChange(getRandStr(8).toUpperCase());
          }

          return <TextField label="Code"
            value={value || ''}
            fullWidth
            style={{ margin: '10px 0' }}
            variant="standard"
            onChange={(e) => { onChange(e.target.value) }}
            error={canValidate && error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Generate code">
                    <IconButton
                      aria-label="Generate code"
                      onClick={handleGenerateCode}
                      edge="end"
                    >
                      {<SmartButtonIcon />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        }
      },
      {
        key: 'discountType',
        type: 'Select',
        label: 'Discount type',
        width: { sm: 6 },
        // getInitialValue: (value) => value ?? 'fixed',
        options: [{
          value: 'fixed',
          label: 'Fixed'
        },
        {
          value: 'percentage',
          label: 'Percentage'
        }],
        required: true,
      },
      {
        key: 'value',
        type: 'Simple text',
        simpleTextType: 'float',
        label: 'Discount value',
        width: { sm: 6 },
        required: true,
      },
      {
        key: 'description',
        type: 'Simple text',
        label: 'Description',
        simpleTextType: 'textarea',
        width: { sm: 6 },
      },
      {
        key: 'minimumSpend',
        type: 'Currency',
        label: 'Cart total minimum',
        width: { sm: 6 },
      },
      {
        key: 'maximumSpend',
        type: 'Currency',
        label: 'Cart total maximum',
        width: { sm: 6 },
      },
      {
        key: 'expiryDate',
        type: 'Datetime',
        label: 'Expiry date',
        width: { sm: 6 },
      },
      {
        key: 'usageLimit',
        type: 'Simple text',
        simpleTextType: 'integer',
        label: 'Usage limit',
        width: { sm: 6 },
      },
      {
        key: 'categoryIds',
        type: 'custom',
        component: ({ value, onChange }) => {
          const categoryIds: number[] = value;
          const [pickedCategories, setPickedCategories] = useState<TProductCategory[] | null>(null);

          const handleSearchCategory = async (text: string, params: TPagedParams<TProductCategory>) => {
            return client?.getProductCategories({
              filterParams: {
                nameSearch: text
              },
              pagedParams: params
            });
          }

          const init = async () => {
            if (categoryIds?.length) {
              const categories = await Promise.all(categoryIds.map(async (id) => {
                try {
                  return await client.getProductCategoryById(Number(id));
                } catch (error) {
                  console.error(error);
                }
              }));
              setPickedCategories(categories ?? []);
            } else setPickedCategories([]);
          }

          useEffect(() => {
            init();
          }, []);

          return pickedCategories ? (
            <SearchInput<TProductCategory>
              multiple
              style={{ margin: '10px 0' }}
              loader={handleSearchCategory}
              onSelect={(data: TProductCategory[]) => {
                if (!data?.length) onChange(null);
                else onChange(data.map(cat => cat.id));
              }}
              getOptionLabel={(data) => `${data.name} (id: ${data.id}${data?.parent?.id ? `; parent id: ${data.parent.id}` : ''})`}
              getOptionValue={(data) => data.name}
              fullWidth
              defaultValue={pickedCategories}
              label={"Categories"}
            />
          ) : <LoadBox size={30} />
        }
      },

      {
        key: 'productIds',
        type: 'custom',
        component: ({ value, onChange }) => {
          const productIds: number[] = value;
          const [pickedProducts, setPickedProducts] = useState<TProduct[] | null>(null);

          const handleSearchProduct = async (text: string, params: TPagedParams<TProduct>) => {
            return client?.getProducts({
              filterParams: {
                nameSearch: text
              },
              pagedParams: params
            });
          }

          const init = async () => {
            if (productIds?.length) {
              const products = await Promise.all(productIds.map(async id => {
                try {
                  return await client.getProductById(Number(id));
                } catch (error) {
                  console.error(error);
                }
              }));
              setPickedProducts(products ?? []);
            } else setPickedProducts([]);
          }

          useEffect(() => {
            init();
          }, []);

          return pickedProducts ? (
            <SearchInput<TProduct>
              multiple
              style={{ margin: '10px 0' }}
              loader={handleSearchProduct}
              onSelect={(data: TProduct[]) => {
                if (!data?.length) onChange(null);
                else onChange(data.map(cat => cat.id));
              }}
              getOptionLabel={(data) => `${data.name} (id: ${data.id})`}
              getOptionValue={(data) => data.name}
              fullWidth
              defaultValue={pickedProducts}
              label={"Products"}
            />
          ) : <LoadBox size={30} />
        }
      },
    ]}
  />
}