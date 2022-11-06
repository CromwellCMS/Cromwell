import { EDBEntity, TPagedParams, TProductCategory } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React, { useEffect, useState } from 'react';

import Autocomplete from '../../components/inputs/Search/SearchInput';
import EntityEdit from '../../components/entity/entityEdit/EntityEdit';
import {
  getInitialValueOfTextEditorField,
  setValueOfTextEditorField,
} from '../../components/entity/entityEdit/helpers';
import { categoryListPageInfo, categoryPageInfo } from '../../constants/PageInfos';

export default function CategoryPage() {
  const client = getGraphQLClient();

  return (
    <EntityEdit
      entityCategory={EDBEntity.ProductCategory}
      entityListRoute={categoryListPageInfo.route}
      entityBaseRoute={categoryPageInfo.baseRoute}
      listLabel="Categories"
      entityLabel="Category"
      defaultPageName="category"
      getById={client.getProductCategoryById}
      update={client.updateProductCategory}
      create={client.createProductCategory}
      deleteOne={client.deleteProductCategory}
      fields={[
        {
          key: 'name',
          type: 'Simple text',
          label: 'Name',
          required: true,
        },
        {
          key: 'parent',
          type: 'custom',
          customGraphQlProperty: {
            parent: {
              id: true,
              slug: true,
            },
          },
          saveValue: (parent) => {
            return {
              parentId: parent?.id,
            };
          },
          component: (props) => {
            const { onChange } = props;
            const category = props.entity as TProductCategory;
            const [parentCategory, setParentCategory] = useState<TProductCategory | null>(null);

            const handleSearchRequest = async (text: string, params: TPagedParams<TProductCategory>) => {
              return client.getProductCategories({
                filterParams: {
                  nameSearch: text,
                },
                pagedParams: params,
              });
            };

            const handleParentCategoryChange = (data: TProductCategory | null) => {
              if (data && category && category.id === data.id) return;
              onChange(data ?? undefined);
            };

            const getParentCategory = async (parentId: number) => {
              try {
                const parent = await client.getProductCategoryById(parentId);
                if (parent) {
                  setParentCategory(parent);
                  handleParentCategoryChange(parent);
                }
              } catch (e) {
                console.error(e);
              }
            };

            useEffect(() => {
              const urlParams = new URLSearchParams(window.location?.search);
              const parentIdParam = urlParams.get('parentId');

              if (parentIdParam) {
                getParentCategory(parseInt(parentIdParam));
              } else if (category?.parent?.id) {
                getParentCategory(category?.parent?.id);
              }
            }, []);

            return (
              <Autocomplete<TProductCategory>
                loader={handleSearchRequest}
                onSelect={handleParentCategoryChange}
                getOptionLabel={(data) =>
                  `${data.name} (id: ${data.id}${data?.parent?.id ? `; parent id: ${data.parent.id}` : ''})`
                }
                getOptionValue={(data) => data.name}
                fullWidth
                defaultValue={parentCategory}
                label={'Parent category'}
              />
            );
          },
        },
        {
          key: 'mainImage',
          type: 'Image',
          label: 'Image',
        },
        {
          key: 'description',
          type: 'Text editor',
          label: 'Description',
          saveValue: setValueOfTextEditorField,
          getInitialValue: getInitialValueOfTextEditorField,
          customGraphQlProperty: {
            description: true,
            descriptionDelta: true,
          },
        },
      ]}
    />
  );
}
