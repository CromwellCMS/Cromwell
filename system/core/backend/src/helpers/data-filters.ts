import {
  TBaseFilter,
  TBasePageEntity,
  TBasePageEntityInput,
  TDBEntity,
  TPagedList,
  TPagedParams,
  TDeleteManyInput,
  TPermissionName,
  TPost,
  TTag,
  TProduct,
  TProductCategory,
  TProductReview,
  TAttribute,
  TOrder,
  TUser,
  TPluginEntity,
  TRole,
  TCustomEntity,
  TCoupon,
  TPostInput,
  TTagInput,
  TProductInput,
  TProductCategoryInput,
  TProductReviewInput,
  TAttributeInput,
  TOrderInput,
  TCreateUser,
  TUpdateUser,
  TRoleInput,
  TPluginEntityInput,
  TCustomEntityInput,
  TCouponInput,
  TPostFilter,
  TProductFilter,
  TProductCategoryFilter,
  TProductReviewFilter,
  TOrderFilter,
  TUserFilter,
  TCustomEntityFilter,
} from '@cromwell/core';

import { TAuthUserInfo } from './types';

type TFilterFunctionBaseOptions = {
  user?: TAuthUserInfo | null;
  permissions: TPermissionName[];
};

type TDataFilterParameters<
  TEntity = TBasePageEntity,
  TCreateEntity = TBasePageEntityInput,
  TUpdateEntity = TBasePageEntityInput,
  TEntityFilter = TBaseFilter,
> = {
  getOneByIdInput: { id: number } & TFilterFunctionBaseOptions;
  getOneByIdOutput: { data: TEntity; id: number } & TFilterFunctionBaseOptions;
  getOneBySlugInput: { slug: string } & TFilterFunctionBaseOptions;
  getOneBySlugOutput: { data: TEntity; slug: string } & TFilterFunctionBaseOptions;
  getManyInput: { params?: TPagedParams<TEntity>; filter?: TEntityFilter } & TFilterFunctionBaseOptions;
  getManyOutput: {
    data: TPagedList<TEntity>;
    params?: TPagedParams<TEntity>;
    filter?: TEntityFilter;
  } & TFilterFunctionBaseOptions;
  createInput: { data: TCreateEntity } & TFilterFunctionBaseOptions;
  createOutput: { data: TEntity; input: TCreateEntity } & TFilterFunctionBaseOptions;
  updateInput: { data: TUpdateEntity; id: number } & TFilterFunctionBaseOptions;
  updateOutput: { data: TEntity; id: number; input: TUpdateEntity } & TFilterFunctionBaseOptions;
  deleteInput: { id: number } & TFilterFunctionBaseOptions;
  deleteOutput: { id: number; success: boolean } & TFilterFunctionBaseOptions;
  deleteManyInput: { input: TDeleteManyInput; filter?: TEntityFilter } & TFilterFunctionBaseOptions;
  deleteManyOutput: {
    input: TDeleteManyInput;
    filter?: TEntityFilter;
    success: boolean;
  } & TFilterFunctionBaseOptions;
  anyInput: { entity: TDBEntity; action: string; data: any };
  anyOutput: { entity: TDBEntity; action: string; data: any };
  any: { entity: TDBEntity; action: string; data: any };
};

export type TFilterableEntities = {
  Post: { entity: TPost; create: TPostInput; update: TPostInput; filter: TPostFilter };
  Tag: { entity: TTag; create: TTagInput; update: TTagInput; filter: TBaseFilter };
  Product: { entity: TProduct; create: TProductInput; update: TProductInput; filter: TProductFilter };
  ProductCategory: {
    entity: TProductCategory;
    create: TProductCategoryInput;
    update: TProductCategoryInput;
    filter: TProductCategoryFilter;
  };
  ProductReview: {
    entity: TProductReview;
    create: TProductReviewInput;
    update: TProductReviewInput;
    filter: TProductReviewFilter;
  };
  Attribute: { entity: TAttribute; create: TAttributeInput; update: TAttributeInput; filter: TBaseFilter };
  Order: { entity: TOrder; create: TOrderInput; update: TOrderInput; filter: TOrderFilter };
  User: { entity: TUser; create: TCreateUser; update: TUpdateUser; filter: TUserFilter };
  Role: { entity: TRole; create: TRoleInput; update: TRoleInput; filter: TBaseFilter };
  Plugin: { entity: TPluginEntity; create: TPluginEntityInput; update: TPluginEntityInput; filter: TBaseFilter };
  CustomEntity: {
    entity: TCustomEntity;
    create: TCustomEntityInput;
    update: TCustomEntityInput;
    filter: TCustomEntityFilter;
  };
  Coupon: { entity: TCoupon; create: TCouponInput; update: TCouponInput; filter: TBaseFilter };
};

type TGetDataFilterParameter<
  TEntityKey extends keyof TFilterableEntities,
  TAction extends keyof TDataFilterParameters,
> = TDataFilterParameters<
  TFilterableEntities[TEntityKey]['entity'],
  TFilterableEntities[TEntityKey]['create'],
  TFilterableEntities[TEntityKey]['update'],
  TFilterableEntities[TEntityKey]['filter']
>[TAction];

type TDataFilterFunction<TEntityKey extends keyof TFilterableEntities, TAction extends keyof TDataFilterParameters> = (
  options: TGetDataFilterParameter<TEntityKey, TAction> & {
    entity: TDBEntity;
    action: keyof TDataFilterParameters;
  },
) => Promise<Partial<TGetDataFilterParameter<TEntityKey, TAction>> | null | undefined | void> | null | undefined | void;

type TRegisterDataFilterOptions<
  TEntityKey extends keyof TFilterableEntities,
  TAction extends keyof TDataFilterParameters,
> = {
  id: string;
  entity: TEntityKey | '*';
  action: TAction;
  filter: TDataFilterFunction<TEntityKey, TAction>;
};

const dataFilters: Record<
  string,
  TRegisterDataFilterOptions<keyof TFilterableEntities, keyof TDataFilterParameters>
> = {};

export const registerDataFilter = <
  TEntityKey extends keyof TFilterableEntities,
  TAction extends keyof TDataFilterParameters,
>(
  options: TRegisterDataFilterOptions<TEntityKey, TAction>,
) => {
  dataFilters[options.id] = options as any;
};

const geTDataFilterParameters = <
  TEntityKey extends keyof TFilterableEntities,
  TAction extends keyof TDataFilterParameters,
>(
  entity: TEntityKey | '*',
  action: TAction,
): TDataFilterFunction<TEntityKey, TAction>[] => {
  return Object.values(dataFilters)
    .filter((options) => {
      return (
        (options.entity === entity || options.entity === '*') &&
        (options.action === action ||
          options.action === 'any' ||
          (action.endsWith('Input') && options.action === 'anyInput') ||
          (action.endsWith('Output') && options.action === 'anyOutput'))
      );
    })
    .map((f) => f.filter) as any;
};

export const applyDataFilters = async <
  TEntityKey extends keyof TFilterableEntities,
  TAction extends keyof TDataFilterParameters,
>(
  entity: TEntityKey,
  action: TAction,
  data: TGetDataFilterParameter<TEntityKey, TAction>,
): Promise<TGetDataFilterParameter<TEntityKey, TAction>> => {
  const filters = geTDataFilterParameters<TEntityKey, TAction>(entity, action);

  for (const filter of filters) {
    const result = await filter({
      entity,
      action,
      ...data,
    });
    if (result) {
      Object.entries(result).forEach(([key, val]) => {
        data[key] = val;
      });
    }
  }
  return data;
};
