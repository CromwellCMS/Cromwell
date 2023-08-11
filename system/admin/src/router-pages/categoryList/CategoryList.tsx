import { EDBEntity, TProductCategory, TProductCategoryFilter, TProductCategoryInput } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React, { useRef, useState } from 'react';

import EntityTable from '../../components/entity/entityTable/EntityTable';
import { IEntityListPage } from '../../components/entity/types';
import { categoryListPageInfo, categoryPageInfo } from '../../constants/PageInfos';
import { baseEntityColumns } from '../../helpers/customEntities';
import { useForceUpdate } from '../../helpers/forceUpdate';
import { HeaderActions } from './components/HeaderActions';
import { TreeView } from './components/TreeView';

export type ListItemProps = {
  handleDeleteCategory: (product: TProductCategory) => void;
  toggleSelection?: (data: TProductCategory) => void;
  embeddedView?: boolean;
};
export type TView = 'tree' | 'list';

const viewTypeKey = 'crw_category_view_type';

export default function CategoryList() {
  const client = getGraphQLClient();
  const [view, setView] = useState<TView>((window.localStorage.getItem(viewTypeKey) as any) || 'list');
  const [updateRoot, setUpdateRoot] = useState<any>({});

  const entityListPageRef = useRef<IEntityListPage<TProductCategory, TProductCategoryFilter> | null>(null);
  const collapsedItemsRef = useRef<Record<string, boolean>>({});
  const deletedItemsRef = useRef<Record<string, boolean>>({});
  const forceUpdate = useForceUpdate();

  const handleCollapseAll = () => {
    collapsedItemsRef.current['all'] = false;
    forceUpdate();
  };

  const handleExpandAll = () => {
    collapsedItemsRef.current['all'] = true;
    forceUpdate();
  };

  return (
    <EntityTable
      entityCategory={EDBEntity.ProductCategory}
      entityListRoute={categoryListPageInfo.route}
      entityBaseRoute={categoryPageInfo.baseRoute}
      listLabel="Categories"
      entityLabel="Category"
      nameProperty="name"
      customElements={{
        getHeaderRightActions: () => (
          <HeaderActions
            view={view}
            setView={(value) => {
              window.localStorage.setItem(viewTypeKey, value);
              setView(value);
            }}
            expandAll={handleExpandAll}
            collapseAll={handleCollapseAll}
          />
        ),
        getTableContent: () => {
          if (view === 'tree') {
            return (
              <TreeView
                entityListPageRef={entityListPageRef}
                collapsedItemsRef={collapsedItemsRef}
                updateRoot={updateRoot}
                deletedItemsRef={deletedItemsRef}
              />
            );
          }
        },
      }}
      getPageListInstance={(inst) => {
        entityListPageRef.current = inst;
      }}
      getMany={client.getProductCategories}
      deleteOne={async (id) => {
        deletedItemsRef.current[id] = true;
        const res = await client.deleteProductCategory(id);
        setUpdateRoot({});
        return res;
      }}
      deleteMany={async (input, filters) => {
        for (const id of input.ids) deletedItemsRef.current[id] = true;

        const res = await client.deleteManyProductCategories(input, filters);
        setUpdateRoot({});
        return res;
      }}
      columns={[
        {
          name: 'name',
          label: 'Name',
          type: 'Simple text',
          visible: true,
        },
        {
          name: 'mainImage',
          label: 'Image',
          type: 'Image',
          visible: true,
        },
        {
          name: 'parent_name',
          label: 'Parent name',
          type: 'Simple text',
          visible: true,
          applyFilter: (value: string, filter) => {
            (filter as TProductCategoryFilter).parentName = value;
            return filter;
          },
          getValueView: (parent, entity) => entity?.parent?.name,
          customGraphQlProperty: {
            parent: {
              name: true,
            },
          },
        },
        {
          name: 'parent_id',
          label: 'Parent ID',
          type: 'Simple text',
          visible: false,
          applyFilter: (value: string, filter) => {
            const id = Number(value);
            if (!id || isNaN(id)) {
              delete (filter as TProductCategoryInput).parentId;
            } else {
              (filter as TProductCategoryInput).parentId = id;
            }
            return filter;
          },
          getValueView: (parent, entity) => entity?.parent?.id,
          customGraphQlProperty: {
            parent: {
              id: true,
            },
          },
        },
        ...baseEntityColumns.map((col) => {
          if (col.name === 'createDate') return { ...col, visible: true };
          return { ...col, visible: false };
        }),
      ]}
    />
  );
}
